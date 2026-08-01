import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

let tenantResolutionPromise: Promise<string | null> | null = null;

async function resolveTenantContext(): Promise<string | null> {
  const existing = localStorage.getItem('veriq_tenant_id') || localStorage.getItem('veriq_organization_id');
  if (existing) return existing;

  if (!tenantResolutionPromise) {
    tenantResolutionPromise = axios.get('/api/v1/organizations')
      .then(res => {
        const orgs = res.data?.data;
        if (orgs && orgs.length > 0) {
          const orgId = orgs[0].id;
          localStorage.setItem('veriq_tenant_id', orgId);
          localStorage.setItem('veriq_organization_id', orgId);
          return orgId;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        tenantResolutionPromise = null;
      });
  }
  return tenantResolutionPromise;
}

// Request Interceptor: Inject Tenant & User Context Headers (With Automatic Tenant Context Resolution)
apiClient.interceptors.request.use(
  async (config) => {
    let tenantId = localStorage.getItem('veriq_tenant_id') || localStorage.getItem('veriq_organization_id');

    if (!tenantId && !config.url?.includes('/organizations')) {
      tenantId = await resolveTenantContext();
    }

    const userId = localStorage.getItem('veriq_user_id');
    const token = localStorage.getItem('veriq_auth_token');

    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId;
    }
    if (userId) {
      config.headers['X-User-Id'] = userId;
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format Errors & 401 / 403 Exception Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        // Clear active session on unauthenticated error
        localStorage.removeItem('veriq_auth_token');
        localStorage.removeItem('veriq_user_id');
      }

      return Promise.reject({
        status,
        success: false,
        message: data?.message || (status === 403 ? 'Access Denied: Insufficient Permissions' : 'API Request Failed'),
        error: data?.error || { code: status === 403 ? 'FORBIDDEN' : 'API_ERROR' },
        timestamp: new Date().toISOString(),
      });
    }

    return Promise.reject({
      status: 500,
      success: false,
      message: error.message || 'Network error or backend unreachable',
      error: { code: 'NETWORK_ERROR', details: error.message },
      timestamp: new Date().toISOString(),
    });
  }
);
