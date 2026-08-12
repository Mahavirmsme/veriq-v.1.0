import React, { useMemo } from 'react';
import { useEngineeringContext } from '../context/useEngineeringContext';

/**
 * Enterprise Operations Command Center - Right Operational Intelligence Panel.
 * Displays ONLY the 7 Human-Readable Failure Mechanisms.
 * 
 * NO raw enums or internal EKP codes in user UI.
 * 100% Runtime engine-backed presenting authoritative values or truthful empty states (N/A / —).
 */
export interface MechanismDisplayItem {
  id: string;
  name: string;
  value: string;
  status: 'STABLE' | 'WARNING' | 'CRITICAL' | 'UNEVALUATED';
}

export const OperationalIntelligencePanel: React.FC = () => {
  const { contextNodes } = useEngineeringContext();

  // Map 7 Human-Readable Failure Mechanisms from authoritative runtime mechanism engine output
  const mechanisms: MechanismDisplayItem[] = useMemo(() => {
    const allObservations = (contextNodes || []).flatMap(n => (n as any).observations || []);
    const allMechanisms = (contextNodes || []).flatMap(n => (n as any).mechanisms || []);

    const findObs = (types: string[]) => allObservations.find(o => types.includes(o.sensorType?.toUpperCase()));
    const findMech = (mType: string) => allMechanisms.find(m => m.mechanismType === mType);

    // 1. Overtopping Risk (EKP-001) - Auth backend mechanism output
    const overtoppingMech = findMech('OVERTOPPING');
    let overtoppingVal = 'N/A';
    let overtoppingStatus: 'STABLE' | 'WARNING' | 'CRITICAL' | 'UNEVALUATED' = 'UNEVALUATED';
    let overtoppingMsg = overtoppingMech?.evaluationMessage || 'Overtopping assessment blocked: unconfigured engineering specification.';

    if (overtoppingMech && overtoppingMech.status === 'EVALUATED') {
      const msg = overtoppingMech.evaluationMessage || '';
      if (msg.includes('CRITICAL')) {
        overtoppingStatus = 'CRITICAL';
      } else if (msg.includes('WARNING')) {
        overtoppingStatus = 'WARNING';
      } else {
        overtoppingStatus = 'STABLE';
      }
      const overtoppingObs = findObs(['WL', 'WAVE', 'WATER_LEVEL', 'WAVE_HEIGHT']);
      overtoppingVal = overtoppingObs ? `${overtoppingObs.measuredValue} ${overtoppingObs.unit || 'm'}` : 'N/A';
    }

    // 2. Internal Seepage
    const seepageObs = findObs(['PZ', 'PORE_PRESSURE', 'SEEPAGE']);
    const seepageVal = seepageObs ? `${seepageObs.measuredValue} ${seepageObs.unit || 'kPa'}` : 'N/A';
    const seepageStatus = seepageObs ? (seepageObs.status === 'HEALTHY' ? 'STABLE' : seepageObs.status as any) : 'UNEVALUATED';

    // 3. Internal Erosion
    const erosionObs = findObs(['TURB', 'TURBIDITY', 'PIPING']);
    const erosionVal = erosionObs ? `${erosionObs.measuredValue} ${erosionObs.unit || 'NTU'}` : 'N/A';
    const erosionStatus = erosionObs ? (erosionObs.status === 'HEALTHY' ? 'STABLE' : erosionObs.status as any) : 'UNEVALUATED';

    // 4. Slope Instability
    const slopeObs = findObs(['INC', 'INCLINOMETER', 'SLOPE']);
    const slopeVal = slopeObs ? `${slopeObs.measuredValue} ${slopeObs.unit || 'deg'}` : 'N/A';
    const slopeStatus = slopeObs ? (slopeObs.status === 'HEALTHY' ? 'STABLE' : slopeObs.status as any) : 'UNEVALUATED';

    // 5. Structural Settlement
    const settlementObs = findObs(['SG', 'SETTLEMENT', 'STRAIN']);
    const settlementVal = settlementObs ? `${settlementObs.measuredValue} ${settlementObs.unit || 'mm'}` : 'N/A';
    const settlementStatus = settlementObs ? (settlementObs.status === 'HEALTHY' ? 'STABLE' : settlementObs.status as any) : 'UNEVALUATED';

    // 6. Toe & Foundation Erosion
    const toeObs = findObs(['SCOUR', 'TOE_EROSION', 'FLOW']);
    const toeVal = toeObs ? `${toeObs.measuredValue} ${toeObs.unit || 'm'}` : 'N/A';
    const toeStatus = toeObs ? (toeObs.status === 'HEALTHY' ? 'STABLE' : toeObs.status as any) : 'UNEVALUATED';

    // 7. Rainfall-Induced Instability
    const rainObs = findObs(['RG', 'RAIN_GAUGE', 'RAINFALL']);
    const rainVal = rainObs ? `${rainObs.measuredValue} ${rainObs.unit || 'mm/h'}` : 'N/A';
    const rainStatus = rainObs ? (rainObs.status === 'HEALTHY' ? 'STABLE' : rainObs.status as any) : 'UNEVALUATED';

    return [
      { id: 'm1', name: 'Overtopping Risk', value: overtoppingVal, status: overtoppingStatus, message: overtoppingMsg },
      { id: 'm2', name: 'Internal Seepage', value: seepageVal, status: seepageStatus },
      { id: 'm3', name: 'Internal Erosion', value: erosionVal, status: erosionStatus },
      { id: 'm4', name: 'Slope Instability', value: slopeVal, status: slopeStatus },
      { id: 'm5', name: 'Structural Settlement', value: settlementVal, status: settlementStatus },
      { id: 'm6', name: 'Toe & Foundation Erosion', value: toeVal, status: toeStatus },
      { id: 'm7', name: 'Rainfall-Induced Instability', value: rainVal, status: rainStatus },
    ];
  }, [contextNodes]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
      {/* 1. SHARED COLUMN HEADER */}
      <div className="veriq-column-header">
        <h2 className="veriq-column-header-title">ENGINEERING INTELLIGENCE</h2>
        <span className="veriq-column-header-badge">7 MECHANISMS</span>
      </div>

      {/* 2. UNIFIED MECHANISMS LIST */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {mechanisms.map((m) => {
          const isUnevaluated = m.status === 'UNEVALUATED';
          const isCritical = m.status === 'CRITICAL';
          const isWarning = m.status === 'WARNING';
          
          const statusBg = isUnevaluated ? '#F1F5F9' : isCritical ? '#FEF2F2' : isWarning ? '#FFFBEB' : '#F0FDF4';
          const statusColor = isUnevaluated ? '#64748B' : isCritical ? '#DC2626' : isWarning ? '#D97706' : '#16A34A';
          const statusBorder = isUnevaluated ? '#CBD5E1' : isCritical ? '#FCA5A5' : isWarning ? '#FDE68A' : '#86EFAC';
          const displayStatus = m.status;

          return (
            <div
              key={m.id}
              className="mechanism-row"
              title={(m as any).message || m.name}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto auto',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 0',
                borderBottom: '1px solid #F1F5F9',
                boxSizing: 'border-box'
              }}
            >
              {/* COLUMN 1: mechanism-name */}
              <div
                className="mechanism-name"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#0F172A',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {m.name}
              </div>

              {/* COLUMN 2: mechanism-value */}
              <div
                className="mechanism-value"
                style={{
                  fontSize: '10px',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  justifyContent: 'flex-end'
                }}
              >
                <span>Value:</span>
                <strong style={{ color: m.value === 'N/A' ? '#64748B' : '#0F172A', fontFamily: 'monospace' }}>
                  {m.value}
                </strong>
              </div>

              {/* COLUMN 3: mechanism-status */}
              <div
                className="mechanism-status"
                style={{
                  textAlign: 'right',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 5px',
                    borderRadius: '4px',
                    backgroundColor: statusBg,
                    color: statusColor,
                    border: `1px solid ${statusBorder}`,
                    fontFamily: 'monospace',
                    letterSpacing: '0.04em',
                    display: 'inline-block'
                  }}
                >
                  {displayStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OperationalIntelligencePanel;


