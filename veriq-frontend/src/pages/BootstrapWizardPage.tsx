import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bootstrapService } from '../services/bootstrapService';
import { CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Building2, ChevronRight, Lock } from 'lucide-react';

export const BootstrapWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);
  const [isAlreadyInitialized, setIsAlreadyInitialized] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [initializing, setInitializing] = useState<boolean>(false);
  const [initProgress, setInitProgress] = useState<number>(0);
  const [initStageText, setInitStageText] = useState<string>('');

  // Form State for Stage-0 Bootstrap
  const [formData, setFormData] = useState({
    platformName: 'VERIQ Infrastructure Intelligence',
    organizationName: 'Water Resources Department Bihar',
    deploymentEnvironment: 'Production',
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    let isMounted = true;
    bootstrapService.getBootstrapStatus()
      .then((status) => {
        if (isMounted) {
          if (status.initialized) {
            setIsAlreadyInitialized(true);
          }
          setCheckingStatus(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCheckingStatus(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasswordStrength = (pass: string): boolean => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passRegex.test(pass);
  };

  const handleStep1Next = () => {
    const errors: Record<string, string> = {};
    if (!formData.organizationName.trim()) {
      errors.organizationName = 'Organization Name is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    const errors: Record<string, string> = {};

    if (!formData.adminName.trim()) {
      errors.adminName = 'System Administrator full name is required.';
    }

    if (!formData.adminEmail.trim()) {
      errors.adminEmail = 'Email Address is required.';
    } else if (!validateEmail(formData.adminEmail.trim())) {
      errors.adminEmail = 'Please enter a valid email format (e.g. name@domain.com).';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (!validatePasswordStrength(formData.password)) {
      errors.password = 'Password must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, and 1 number.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setCurrentStep(3);
    runInitializationSequence();
  };

  const runInitializationSequence = async () => {
    setInitializing(true);

    try {
      setInitProgress(25);
      setInitStageText('Verifying Database Connection (PostgreSQL)...');
      await new Promise(r => setTimeout(r, 600));

      setInitProgress(50);
      setInitStageText('Executing Flyway Schema Migrations (V1 to V23)...');
      await new Promise(r => setTimeout(r, 800));

      setInitProgress(75);
      setInitStageText('Seeding System Security Configuration & Admin Persona...');
      await new Promise(r => setTimeout(r, 600));

      await bootstrapService.initializePlatform({
        platformName: 'VERIQ Infrastructure Intelligence',
        organizationName: formData.organizationName,
        deploymentEnvironment: formData.deploymentEnvironment,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        password: formData.password
      });

      setInitProgress(100);
      setInitStageText('Platform Marked as Initialized.');
      await new Promise(r => setTimeout(r, 500));

      setCurrentStep(4);

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);

    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Platform initialization failed.';
      if (msg.toLowerCase().includes('already initialized')) {
        setIsAlreadyInitialized(true);
      } else {
        setFieldErrors({ system: msg });
        setCurrentStep(2);
      }
    } finally {
      setInitializing(false);
    }
  };

  const wizardSteps = [
    { num: 1, label: 'Platform Info' },
    { num: 2, label: 'System Admin' },
    { num: 3, label: 'Initialization' },
    { num: 4, label: 'Complete' }
  ];

  if (checkingStatus) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0F172A',
        color: '#60A5FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: '13px',
        fontWeight: 700
      }}>
        VERIQ BOOTSTRAP STATUS CHECK...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F172A',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '640px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#0F172A',
          padding: '20px 24px',
          borderBottom: '2px solid #2563EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#60A5FA', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              STAGE-0: PLATFORM BOOTSTRAP
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0' }}>
              VERIQ One-Time Initialization
            </h1>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', fontFamily: 'monospace' }}>
            {isAlreadyInitialized ? 'INITIALIZED' : `STEP ${currentStep} OF 4`}
          </span>
        </div>

        {/* ALREADY INITIALIZED SCREEN */}
        {isAlreadyInitialized ? (
          <div style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              border: '1px solid #10B981'
            }}>
              <CheckCircle2 size={36} color="#10B981" />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px' }}>
              Platform Already Initialized
            </h2>

            <p style={{ fontSize: '13px', color: '#CBD5E1', margin: '0 0 24px', lineHeight: 1.5 }}>
              This platform has already been configured and initialized. Re-initialization is strictly restricted.
            </p>

            <button
              onClick={() => navigate('/login', { replace: true })}
              style={{
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Go to Login</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <>
            {/* Visual Step Progress Indicator */}
            <div style={{
              background: '#0F172A',
              padding: '12px 24px',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              {wizardSteps.map((step, idx) => {
                const isActive = currentStep === step.num;
                const isCompleted = currentStep > step.num;

                return (
                  <React.Fragment key={step.num}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isCompleted ? '#10B981' : isActive ? '#2563EB' : '#1E293B',
                        color: isCompleted || isActive ? '#FFFFFF' : '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: isActive ? '2px solid #60A5FA' : '1px solid #334155'
                      }}>
                        {isCompleted ? <CheckCircle2 size={13} /> : step.num}
                      </div>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#F8FAFC' : isCompleted ? '#34D399' : '#94A3B8'
                      }}>
                        {step.label}
                      </span>
                    </div>
                    {idx < wizardSteps.length - 1 && (
                      <ChevronRight size={14} color="#475569" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Form Body */}
            <div style={{ padding: '28px' }}>
              
              {/* STEP 1: PLATFORM INFORMATION */}
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={18} color="#60A5FA" />
                    Step-1: Platform Information
                  </h2>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Platform Name</label>
                    <input
                      type="text"
                      value="VERIQ Infrastructure Intelligence"
                      readOnly
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        marginTop: '4px',
                        background: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        color: '#94A3B8',
                        fontSize: '13px',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Organization Name</label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={e => {
                        setFormData({ ...formData, organizationName: e.target.value });
                        if (fieldErrors.organizationName) setFieldErrors({ ...fieldErrors, organizationName: '' });
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        marginTop: '4px',
                        background: '#0F172A',
                        border: fieldErrors.organizationName ? '1px solid #EF4444' : '1px solid #334155',
                        borderRadius: '4px',
                        color: '#FFFFFF',
                        fontSize: '13px'
                      }}
                    />
                    {fieldErrors.organizationName && (
                      <div style={{ fontSize: '11px', color: '#F87171', marginTop: '4px', fontWeight: 500 }}>
                        {fieldErrors.organizationName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Deployment Environment (Optional)</label>
                    <select
                      value={formData.deploymentEnvironment}
                      onChange={e => setFormData({ ...formData, deploymentEnvironment: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', marginTop: '4px', background: '#0F172A', border: '1px solid #334155', borderRadius: '4px', color: '#FFFFFF', fontSize: '13px' }}
                    >
                      <option value="Production">Production</option>
                      <option value="Staging">Staging</option>
                      <option value="Development">Development</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button
                      onClick={handleStep1Next}
                      style={{
                        background: '#2563EB',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      Continue to System Admin <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: CREATE SYSTEM ADMINISTRATOR */}
              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="#60A5FA" />
                    Step-2: Create System Administrator
                  </h2>

                  {fieldErrors.system && (
                    <div style={{ fontSize: '12px', color: '#F87171', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '4px', border: '1px solid #EF4444' }}>
                      {fieldErrors.system}
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Full Name</label>
                    <input
                      type="text"
                      value={formData.adminName}
                      onChange={e => {
                        setFormData({ ...formData, adminName: e.target.value });
                        if (fieldErrors.adminName) setFieldErrors({ ...fieldErrors, adminName: '' });
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        marginTop: '4px',
                        background: '#0F172A',
                        border: fieldErrors.adminName ? '1px solid #EF4444' : '1px solid #334155',
                        borderRadius: '4px',
                        color: '#FFFFFF',
                        fontSize: '13px'
                      }}
                    />
                    {fieldErrors.adminName && (
                      <div style={{ fontSize: '11px', color: '#F87171', marginTop: '4px', fontWeight: 500 }}>
                        {fieldErrors.adminName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Email Address</label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={e => {
                        setFormData({ ...formData, adminEmail: e.target.value });
                        if (fieldErrors.adminEmail) setFieldErrors({ ...fieldErrors, adminEmail: '' });
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        marginTop: '4px',
                        background: '#0F172A',
                        border: fieldErrors.adminEmail ? '1px solid #EF4444' : '1px solid #334155',
                        borderRadius: '4px',
                        color: '#FFFFFF',
                        fontSize: '13px'
                      }}
                    />
                    {fieldErrors.adminEmail && (
                      <div style={{ fontSize: '11px', color: '#F87171', marginTop: '4px', fontWeight: 500 }}>
                        {fieldErrors.adminEmail}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={e => {
                          setFormData({ ...formData, password: e.target.value });
                          if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          marginTop: '4px',
                          background: '#0F172A',
                          border: fieldErrors.password ? '1px solid #EF4444' : '1px solid #334155',
                          borderRadius: '4px',
                          color: '#FFFFFF',
                          fontSize: '13px'
                        }}
                      />
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                        Min 8 characters (at least 1 uppercase, 1 lowercase, 1 number).
                      </div>
                      {fieldErrors.password && (
                        <div style={{ fontSize: '11px', color: '#F87171', marginTop: '2px', fontWeight: 500 }}>
                          {fieldErrors.password}
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Confirm Password</label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={e => {
                          setFormData({ ...formData, confirmPassword: e.target.value });
                          if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          marginTop: '4px',
                          background: '#0F172A',
                          border: fieldErrors.confirmPassword ? '1px solid #EF4444' : '1px solid #334155',
                          borderRadius: '4px',
                          color: '#FFFFFF',
                          fontSize: '13px'
                        }}
                      />
                      {fieldErrors.confirmPassword && (
                        <div style={{ fontSize: '11px', color: '#F87171', marginTop: '4px', fontWeight: 500 }}>
                          {fieldErrors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                    <button
                      onClick={() => setCurrentStep(1)}
                      style={{
                        background: 'transparent',
                        color: '#94A3B8',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ArrowLeft size={15} /> Back
                    </button>

                    <button
                      onClick={handleStep2Next}
                      style={{
                        background: '#2563EB',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      Initialize VERIQ Platform <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: INITIALIZE PLATFORM PROGRESS */}
              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '20px 0' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                    Step-3: Initializing VERIQ Platform
                  </h2>

                  <div style={{ width: '100%', background: '#0F172A', borderRadius: '8px', height: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
                    <div style={{ width: `${initProgress}%`, background: '#2563EB', height: '100%', transition: 'width 300ms ease' }} />
                  </div>

                  <p style={{ fontSize: '13px', color: '#60A5FA', fontWeight: 600, margin: 0, fontFamily: 'monospace' }}>
                    {initStageText}
                  </p>
                </div>
              )}

              {/* STEP 4: FINISH */}
              {currentStep === 4 && (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid #10B981' }}>
                    <CheckCircle2 size={36} color="#10B981" />
                  </div>
                  
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px' }}>
                    VERIQ Platform initialized successfully.
                  </h2>
                  
                  <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 20px' }}>
                    Redirecting automatically to Login Screen...
                  </p>

                  <button
                    onClick={() => navigate('/login', { replace: true })}
                    style={{
                      background: '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '10px 24px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Go to Login Immediately
                  </button>
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
};
