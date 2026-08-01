import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, ArrowRight, CheckCircle2, Play, RefreshCw } from 'lucide-react';
import { executionEngineService, ExecutionRecord } from '../../services/executionEngineService';

export const DigitalInfrastructureWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [lastExecution, setLastExecution] = useState<ExecutionRecord | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

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

  const handleExecutePublish = async () => {
    setIsExecuting(true);
    setExecutionError(null);
    try {
      const record = await executionEngineService.executePublish({
        projectName: 'VERIQ Enterprise Digital Twin',
        configurationVersion: `v1.${Date.now().toString().slice(-4)}`
      });
      setLastExecution(record);
      setIsExecuting(false);
      setCurrentStep(10); // Advance to Commission step
    } catch (err: any) {
      setIsExecuting(false);
      setExecutionError(err?.errorMessage || err?.message || 'Execution engine transaction failed.');
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Workspace Header */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        padding: '20px',
        borderLeft: '4px solid #2563EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em' }}>
            PROJECT CONFIGURATION WORKSPACE
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '4px 0 0' }}>
            Digital Infrastructure Wizard
          </h1>
        </div>

        {lastExecution && (
          <div style={{
            background: '#ECFDF5',
            border: '1px solid #6EE7B7',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#047857',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle2 size={14} color="#047857" />
            <span>EXECUTION SUCCESS: {lastExecution.id} ({lastExecution.generatedRuntimeNodesCount} Nodes, {lastExecution.generatedRuntimeSensorsCount} Sensors)</span>
          </div>
        )}
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
                  opacity: isActive ? 1 : 0.7
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isCompleted ? '#059669' : isActive ? '#2563EB' : '#F1F5F9',
                  color: (isCompleted || isActive) ? '#FFFFFF' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 800,
                  border: isActive ? '2px solid #2563EB' : '1px solid #CBD5E1'
                }}>
                  {isCompleted ? <CheckCircle2 size={14} /> : stepNum}
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#0F172A' : '#64748B',
                  whiteSpace: 'nowrap'
                }}>
                  {title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight size={14} color="#94A3B8" style={{ flexShrink: 0, margin: '0 4px' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Layout Shell */}
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

          {/* Step 9: Execution Engine Publish Action */}
          {currentStep === 9 ? (
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px', marginTop: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
                Publish Configuration to Execution Engine
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px', lineHeight: 1.5 }}>
                Clicking <strong>Execute Publish</strong> invokes the Execution Engine pipeline. This automatically converts the published digital twin hierarchy into runtime engineering state records, populates the Commission Queue, and transitions execution status to <code>SUCCESS</code>.
              </p>

              {executionError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '10px 14px', borderRadius: '4px', color: '#991B1B', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>
                  Execution Failed: {executionError}
                </div>
              )}

              <button
                onClick={handleExecutePublish}
                disabled={isExecuting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: isExecuting ? 'not-allowed' : 'pointer',
                  opacity: isExecuting ? 0.7 : 1
                }}
              >
                {isExecuting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Executing Engine Pipeline (NEW → RUNNING → SUCCESS)...</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Execute Publish & Generate Runtime</span>
                  </>
                )}
              </button>
            </div>
          ) : currentStep === 10 ? (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '6px', padding: '20px', marginTop: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#065F46', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>Commissioning Queue Populated</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#047857', margin: 0, lineHeight: 1.5 }}>
                Runtime entities generated successfully. All engineering nodes have been automatically enqueued into the Commissioning Workspace.
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Digital Infrastructure Wizard — Configured step for {steps[currentStep - 1]}.
            </p>
          )}
        </div>

        {/* Wizard Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
          <button
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
            disabled={currentStep === 1 || isExecuting}
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
              cursor: (currentStep === 1 || isExecuting) ? 'not-allowed' : 'pointer'
            }}
          >
            <ArrowLeft size={14} /> Previous Step
          </button>

          <button
            onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length))}
            disabled={currentStep === steps.length || isExecuting}
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
              cursor: (currentStep === steps.length || isExecuting) ? 'not-allowed' : 'pointer'
            }}
          >
            Next Step <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default DigitalInfrastructureWizard;
