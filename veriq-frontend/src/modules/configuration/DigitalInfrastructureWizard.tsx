import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const DigitalInfrastructureWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps = [
    'Organization',
    'Project',
    'Asset',
    'Region',
    'Deployment Zone',
    'Node Strategy',
    'Sensor Strategy',
    'Review',
    'Publish',
    'Commission'
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Workspace Header */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        padding: '20px',
        borderLeft: '4px solid #2563EB'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em' }}>
          PROJECT CONFIGURATION WORKSPACE
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '4px 0 0' }}>
          Digital Infrastructure Wizard Layout Shell
        </h1>
      </div>

      {/* 10-Step Wizard Bar */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'auto'
      }}>
        {steps.map((title, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <React.Fragment key={title}>
              <div
                onClick={() => setCurrentStep(stepNum)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: isActive ? '#EFF6FF' : 'transparent'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isCompleted ? '#10B981' : isActive ? '#2563EB' : '#F1F5F9',
                  color: isCompleted || isActive ? '#FFFFFF' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 800,
                  border: isActive ? '2px solid #1E40AF' : '1px solid #CBD5E1'
                }}>
                  {isCompleted ? <CheckCircle2 size={14} /> : stepNum}
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? '#1E40AF' : '#475569',
                  whiteSpace: 'nowrap'
                }}>
                  {title}
                </span>
              </div>
              {stepNum < steps.length && (
                <ChevronRight size={14} color="#CBD5E1" style={{ flexShrink: 0 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Placeholder Layout Shell */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        padding: '32px',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>
            STEP {currentStep} OF {steps.length}
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '6px 0 12px' }}>
            {steps[currentStep - 1]} Configuration Step
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Digital Infrastructure Wizard Shell — Placeholder for {steps[currentStep - 1]} step.
          </p>
        </div>

        {/* Wizard Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
          <button
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
            disabled={currentStep === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFFFFF',
              color: currentStep === 1 ? '#94A3B8' : '#334155',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <ArrowLeft size={14} /> Previous Step
          </button>

          <button
            onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length))}
            disabled={currentStep === steps.length}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: currentStep === steps.length ? 'not-allowed' : 'pointer'
            }}
          >
            Next Step <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};
