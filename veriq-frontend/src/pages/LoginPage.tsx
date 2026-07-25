import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your credentials.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const session = await login(email.trim(), password);
      // Workspace Resolution
      if (session.allowedWorkspaces && session.allowedWorkspaces.length > 1) {
        // Multi-role / Multi-workspace -> Open Workspace Selector
        navigate('/workspace-selector', { replace: true });
      } else if (session.allowedWorkspaces && session.allowedWorkspaces.length === 1) {
        // Single role / Single workspace -> Open default workspace directly
        const ws = session.allowedWorkspaces[0];
        if (ws === 'administration') navigate('/admin', { replace: true });
        else if (ws === 'configuration') navigate('/config', { replace: true });
        else navigate('/ops', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Authentication failed. Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '36px',
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: '8px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            background: '#2563EB',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            color: '#FFFFFF'
          }}>
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: 0 }}>VERIQ Platform Sign In</h2>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
            Enterprise Decision Intelligence Gateway
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '4px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#F87171',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '18px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px', textTransform: 'uppercase' }}>
              USERNAME / EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                name="veriq_login_email"
                autoComplete="off"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  fontSize: '13px'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter username or email address..."
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px', textTransform: 'uppercase' }}>
              SECURITY PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                name="veriq_login_password"
                autoComplete="new-password"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  fontSize: '13px'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '6px'
            }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Platform</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
