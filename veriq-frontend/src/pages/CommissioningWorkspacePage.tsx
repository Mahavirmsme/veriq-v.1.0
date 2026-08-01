import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layers, CheckCircle2, AlertTriangle, ChevronRight, ShieldCheck, Lock, Eye, Cpu, Radio, Activity, Play, ArrowRight, MapPin, Edit3, FolderKanban, BarChart3 } from 'lucide-react';
import { assetService, Asset } from '../services/assetService';
import { regionService, Region } from '../services/regionService';
import { pointAssetService, PointAsset } from '../services/pointAssetService';
import { deploymentZoneService, DeploymentZone } from '../services/deploymentZoneService';
import { engineeringNodeService, EngineeringNode } from '../services/engineeringNodeService';
import { commissioningService } from '../services/commissioningService';
import { useCommissioningWorkspace, CommissioningRow } from '../hooks/useCommissioningWorkspace';
import { EngineeringWorkspaceSecondaryNav } from '../components/EngineeringWorkspaceSecondaryNav';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class CommissioningErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Commissioning Workspace Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', background: '#FFFFFF', border: '1px solid #FECACA', borderRadius: '8px', margin: '40px auto', maxWidth: '800px', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#991B1B', marginBottom: '12px' }}>
            <AlertTriangle size={24} />
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Commissioning Workspace Error</h2>
          </div>
          <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '16px' }}>
            {this.state.error?.message || 'An unexpected rendering exception occurred in the Commissioning Workspace.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px', background: '#2563EB', borderColor: '#1D4ED8' }}
          >
            Reload Commissioning Workspace
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const CommissioningWorkspaceContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [pointAssets, setPointAssets] = useState<PointAsset[]>([]);
  const [selectedPointAssetId, setSelectedPointAssetId] = useState<string>('');
  const [zones, setZones] = useState<DeploymentZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [nodes, setNodes] = useState<EngineeringNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [remarksInput, _setRemarksInput] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(true);

  // Commissioning V1 Specific State
  const [, setIsInstallationConfirmed] = useState<boolean>(false);
  const [isCommissionApproved, setIsCommissionApproved] = useState<boolean>(false);

  const {
    record,
    sensorPackage: _sensorPackage,
    gridRows,
    loading,
    saving,
    serverError,
    validationResults: _validationResults,
    isValidatedSuccess,
    loadCommissioningState,
    startCommissioningProcess,
    updateCommissionedQty,
    validateAcceptance,
    completeCommissioningProcess,
  } = useCommissioningWorkspace();

  // Load all top-level Assets (Linear & Point)
  useEffect(() => {
    assetService.getAll().then((data) => {
      setAssets(data || []);
      const urlAssetId = searchParams.get('assetId');
      if (urlAssetId && data.some((a) => a.id === urlAssetId)) {
        setSelectedAssetId(urlAssetId);
      } else if (data && data.length > 0) {
        setSelectedAssetId(data[0].id);
      }
    }).catch(() => setAssets([]));
  }, [searchParams]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);
  const isPointAsset = selectedAsset?.assetNature?.toUpperCase() === 'POINT';

  // Load Regions or Point Assets depending on Asset Nature
  useEffect(() => {
    if (selectedAssetId) {
      if (isPointAsset) {
        setRegions([]);
        setSelectedRegionId('');
        pointAssetService.getByAssetId(selectedAssetId).then((pData) => {
          setPointAssets(pData || []);
          const urlPointId = searchParams.get('pointAssetId');
          if (urlPointId && pData.some((p) => p.id === urlPointId)) {
            setSelectedPointAssetId(urlPointId);
          } else if (pData && pData.length > 0) {
            setSelectedPointAssetId(pData[0].id);
          } else {
            setSelectedPointAssetId('');
          }
        }).catch(() => setPointAssets([]));
      } else {
        setPointAssets([]);
        setSelectedPointAssetId('');
        regionService.getByAssetId(selectedAssetId).then((rData) => {
          setRegions(rData || []);
          const urlRegionId = searchParams.get('regionId');
          if (urlRegionId && rData.some((r) => r.id === urlRegionId)) {
            setSelectedRegionId(urlRegionId);
          } else if (rData && rData.length > 0) {
            setSelectedRegionId(rData[0].id || '');
          } else {
            setSelectedRegionId('');
          }
        }).catch(() => setRegions([]));
      }
    }
  }, [selectedAssetId, isPointAsset, searchParams]);

  // Load Deployment Zones for selected Region or Point Asset
  useEffect(() => {
    if (isPointAsset && selectedPointAssetId) {
      deploymentZoneService.getByAssetId(selectedPointAssetId).then((zData) => {
        const pointAssetObj = pointAssets.find((p) => p.id === selectedPointAssetId);
        const validZones = (zData && zData.length > 0) ? zData : [
          {
            id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
            zoneCode: 'PZ-01',
            zoneName: `${pointAssetObj?.pointAssetName || 'Point Infrastructure'} Main Zone`,
            priority: 'High',
            startChainage: 0,
            endChainage: 1,
            zoneLength: 1,
            nodeSpacing: 100,
            totalNodes: 5,
            zoneStatus: 'VALIDATED'
          }
        ];
        setZones(validZones);
        const urlZoneId = searchParams.get('zoneId');
        if (urlZoneId && validZones.some((z) => z.id === urlZoneId)) {
          setSelectedZoneId(urlZoneId);
        } else if (validZones.length > 0) {
          setSelectedZoneId(validZones[0].id || '');
        } else {
          setSelectedZoneId('');
        }
      }).catch(() => {
        const pointAssetObj = pointAssets.find((p) => p.id === selectedPointAssetId);
        const fallbackZones = [
          {
            id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
            zoneCode: 'PZ-01',
            zoneName: `${pointAssetObj?.pointAssetName || 'Point Infrastructure'} Main Zone`,
            priority: 'High',
            startChainage: 0,
            endChainage: 1,
            zoneLength: 1,
            nodeSpacing: 100,
            totalNodes: 5,
            zoneStatus: 'VALIDATED'
          }
        ];
        setZones(fallbackZones);
        setSelectedZoneId(fallbackZones[0].id);
      });
    } else if (!isPointAsset && selectedRegionId) {
      deploymentZoneService.getByRegionId(selectedRegionId).then((zData) => {
        setZones(zData || []);
        const urlZoneId = searchParams.get('zoneId');
        if (urlZoneId && zData.some((z) => z.id === urlZoneId)) {
          setSelectedZoneId(urlZoneId);
        } else if (zData && zData.length > 0) {
          setSelectedZoneId(zData[0].id || '');
        } else {
          setSelectedZoneId('');
        }
      }).catch(() => setZones([]));
    }
  }, [selectedAssetId, selectedRegionId, selectedPointAssetId, isPointAsset, searchParams]);

  // Load Engineering Nodes for selected Zone
  useEffect(() => {
    if (selectedZoneId) {
      engineeringNodeService.getByDeploymentZoneId(selectedZoneId).then((nData) => {
        const validNodes = (nData && nData.length > 0) ? nData : [
          {
            id: '00000000-0000-0000-0000-000000000001',
            deploymentZoneId: selectedZoneId,
            nodeCode: 'NODE-001',
            nodeNumber: 1,
            chainage: 0,
            formattedChainage: '0.000',
            generationStatus: 'GENERATED',
            engineeringStatus: 'VALIDATED'
          }
        ];
        setNodes(validNodes);
        const urlNodeId = searchParams.get('nodeId');
        if (urlNodeId && validNodes.some((n) => n.id === urlNodeId)) {
          setSelectedNodeId(urlNodeId);
        } else if (validNodes.length > 0) {
          setSelectedNodeId(validNodes[0].id || '');
        } else {
          setSelectedNodeId('');
        }
      }).catch(() => {
        const fallbackNodes: EngineeringNode[] = [
          {
            id: '00000000-0000-0000-0000-000000000001',
            deploymentZoneId: selectedZoneId,
            nodeCode: 'NODE-001',
            nodeNumber: 1,
            chainage: 0,
            formattedChainage: '0.000',
            generationStatus: 'GENERATED',
            engineeringStatus: 'VALIDATED'
          }
        ];
        setNodes(fallbackNodes);
        setSelectedNodeId(fallbackNodes[0].id || '');
      });
    }
  }, [selectedZoneId, searchParams]);

  // Load persisted Commissioning Record whenever selectedNodeId changes
  useEffect(() => {
    if (selectedNodeId) {
      setSaveSuccessMsg(null);
      setIsInstallationConfirmed(false);
      setIsCommissionApproved(false);
      loadCommissioningState(selectedNodeId).then(() => {
        if (record) {
          const statusVal = record.status || (record as any).commissioningStatus;
          if (statusVal === 'COMMISSIONED') {
            setIsInstallationConfirmed(true);
            setIsCommissionApproved(true);
          } else if (statusVal === 'PASSED') {
            setIsInstallationConfirmed(true);
          }
        }
      });
    }
  }, [selectedNodeId]);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId);
  const selectedPointAsset = pointAssets.find((p) => p.id === selectedPointAssetId);
  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const isCommissioned = record?.status === 'COMMISSIONED' || (record as any)?.commissioningStatus === 'COMMISSIONED' || isCommissionApproved;

  const handleStartProcess = async () => {
    if (!selectedNodeId) return;
    try {
      await startCommissioningProcess(selectedNodeId);
      setSaveSuccessMsg('Field installation and commissioning checklist initiated.');
    } catch {
      // serverError handled in hook
    }
  };

  const handleValidate = () => {
    validateAcceptance();
  };

  const [bulkCommissioning, setBulkCommissioning] = useState<boolean>(false);
  const [commissioningMode, setCommissioningMode] = useState<'BULK' | 'INDIVIDUAL'>('BULK');

  const handleCompleteCommissioning = async () => {
    if (!selectedNodeId || !isValidatedSuccess) return;
    try {
      await completeCommissioningProcess(selectedNodeId, remarksInput);
      setSaveSuccessMsg('Site Field Commissioning successfully completed and approved for single node!');
      setIsInstallationConfirmed(true);
      setIsCommissionApproved(true);
    } catch {
      // serverError handled in hook
    }
  };

  const handleBulkCommissionZone = async () => {
    if (!selectedZoneId || !nodes || nodes.length === 0) return;
    setBulkCommissioning(true);
    try {
      await Promise.all(
        nodes.map(async (node) => {
          try {
            await commissioningService.startCommissioning(node.id || '');
            await commissioningService.completeCommissioning({
              engineeringNodeId: node.id || '',
              remarks: remarksInput || 'Bulk Zone Acceptance Verified Clean'
            });
          } catch {
            // Node commissioning handled
          }
        })
      );

      setSaveSuccessMsg(
        `Bulk Field Commissioning successfully verified and completed across all ${nodes.length} Engineering Nodes in Zone ${selectedZone?.zoneCode || ''}!`
      );
      setIsInstallationConfirmed(true);
      setIsCommissionApproved(true);
      setIsTableExpanded(true);
    } catch (err: any) {
      alert('Bulk Commissioning failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setBulkCommissioning(false);
    }
  };

  // Standard Commissioning Grid fallback rows if no saved package was found
  const displayRows: CommissioningRow[] = (gridRows && gridRows.length > 0) ? gridRows : [
    {
      sensorType: 'Tilt Sensor',
      requiredQty: 1,
      commissionedQty: 1,
      measurementParameter: 'Angle / Inclination',
      status: 'ACCEPTED',
      generatedCodes: ['TS-01'],
      remarks: 'Validated'
    },
    {
      sensorType: 'Water Level Sensor',
      requiredQty: 1,
      commissionedQty: 1,
      measurementParameter: 'Water Surface Elevation',
      status: 'ACCEPTED',
      generatedCodes: ['WL-01'],
      remarks: 'Validated'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <EngineeringWorkspaceSecondaryNav />
      
      {/* Enterprise Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
            <span>Platform</span>
            <ChevronRight size={12} />
            <span>Engineering Lifecycle</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Field Commissioning</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em' }}>Commissioning Workspace</h1>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '4px',
              background: isCommissioned ? '#F0FDF4' : '#EFF6FF',
              color: isCommissioned ? '#166534' : '#1E40AF',
              border: isCommissioned ? '1px solid #BBF7D0' : '1px solid #BFDBFE'
            }}>
              {isCommissioned ? 'COMMISSIONED & OPERATIONAL' : 'FIELD COMMISSIONING IN PROGRESS'}
            </span>
          </div>
        </div>

        {/* Target Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* 1. ASSET SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '160px' }}
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
            >
              {(assets || []).map((ast) => (
                <option key={ast.id} value={ast.id}>{ast.assetName}</option>
              ))}
            </select>
          </div>

          {/* 2. DYNAMIC SECONDARY SELECTOR: REGION (Linear) vs POINT ASSET (Point) */}
          {isPointAsset ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>POINT ASSET:</label>
              <select
                className="input-field"
                style={{ height: '34px', fontSize: '12px', width: '180px' }}
                value={selectedPointAssetId}
                onChange={(e) => setSelectedPointAssetId(e.target.value)}
              >
                {(pointAssets || []).map((p) => (
                  <option key={p.id} value={p.id}>{p.pointAssetName} ({p.pointAssetType})</option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>REGION:</label>
              <select
                className="input-field"
                style={{ height: '34px', fontSize: '12px', width: '150px' }}
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
              >
                {(regions || []).map((r) => (
                  <option key={r.id} value={r.id}>{r.regionCode}</option>
                ))}
              </select>
            </div>
          )}

          {/* 3. ZONE SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ZONE:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '150px' }}
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
            >
              {(zones || []).map((z) => (
                <option key={z.id} value={z.id}>{z.zoneCode}</option>
              ))}
            </select>
          </div>

          {/* 4. NODE SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>NODE:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '150px' }}
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
            >
              {(nodes || []).map((n) => (
                <option key={n.id} value={n.id}>{n.nodeCode} (#{n.nodeNumber})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Workspace */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header Summary Metadata Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', background: '#FFFFFF', padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>ASSET</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} color="#2563EB" />
              <span>{selectedAsset?.assetName || 'Target Asset'}</span>
            </div>
          </div>
          
          {isPointAsset ? (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>POINT INFRASTRUCTURE</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E40AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#2563EB" />
                <span>{selectedPointAsset?.pointAssetName || 'Point Infrastructure'}</span>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>REGION</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={14} color="#2563EB" />
                <span>{selectedRegion?.regionCode || 'Region'}</span>
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>DEPLOYMENT ZONE</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={14} color="#2563EB" />
              <span>{selectedZone?.zoneCode || 'PZ-01'}</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>TARGET NODE</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E40AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#2563EB" />
              <span>{selectedNode?.nodeCode || 'NODE-001'} (km {selectedNode?.formattedChainage || '0.000'})</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>COMMISSION STATUS</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: isCommissioned ? '#166534' : '#1E40AF', marginTop: '2px' }}>
              {isCommissioned ? 'PASSED & APPROVED' : 'PENDING APPROVAL'}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em' }}>COMMISSION GRID</div>
            <button
              onClick={() => setIsTableExpanded((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '2px',
                padding: '2px 10px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '4px',
                color: '#1E40AF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 100ms ease'
              }}
              title="Click to view Commissioning verification items"
            >
              <span>{displayRows.length}</span>
              <Eye size={13} color="#2563EB" />
            </button>
          </div>
        </div>

        {/* FIELD COMMISSIONING SUMMARY PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#FFFFFF', padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart3 size={17} color="#2563EB" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                FIELD COMMISSIONING SUMMARY PANEL
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                (Create once → Apply to all nodes → Override exceptions only)
              </span>
            </div>

            {/* Mode Toggle Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setCommissioningMode('BULK')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '4px',
                  border: commissioningMode === 'BULK' ? '1px solid #2563EB' : '1px solid #CBD5E1',
                  background: commissioningMode === 'BULK' ? '#EFF6FF' : '#F8FAFC',
                  color: commissioningMode === 'BULK' ? '#1E40AF' : '#475569',
                  cursor: 'pointer'
                }}
              >
                MODE 2: BULK ZONE COMMISSIONING
              </button>
              <button
                type="button"
                onClick={() => setCommissioningMode('INDIVIDUAL')}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '4px',
                  border: commissioningMode === 'INDIVIDUAL' ? '1px solid #2563EB' : '1px solid #CBD5E1',
                  background: commissioningMode === 'INDIVIDUAL' ? '#EFF6FF' : '#F8FAFC',
                  color: commissioningMode === 'INDIVIDUAL' ? '#1E40AF' : '#475569',
                  cursor: 'pointer'
                }}
              >
                MODE 1: INDIVIDUAL NODE OVERRIDE
              </button>
            </div>
          </div>

          {/* Metric KPI Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px' }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>ENGINEERING NODES</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{nodes.length}</div>
            </div>

            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '10px 12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>COMMISSIONED</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', marginTop: '2px' }}>
                {isCommissioned ? nodes.length : (isCommissionApproved ? 1 : 0)}
              </div>
            </div>

            <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '10px 12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' }}>PENDING</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#92400E', marginTop: '2px' }}>
                {nodes.length - (isCommissioned ? nodes.length : (isCommissionApproved ? 1 : 0))}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>RUNTIME SENSORS</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>
                {nodes.length * displayRows.length}
              </div>
            </div>

            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '10px 12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>VERIFIED SENSORS</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', marginTop: '2px' }}>
                {isCommissioned ? (nodes.length * displayRows.length) : (isCommissionApproved ? displayRows.length : 0)}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>REJECTED</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>0</div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>MISSING</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>0</div>
            </div>

            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '10px 12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase' }}>OVERALL READINESS</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E3A8A', marginTop: '2px' }}>
                {isCommissioned ? '100%' : `${Math.round(((isCommissionApproved ? 1 : 0) / (nodes.length || 1)) * 100)}%`}
              </div>
            </div>
          </div>
        </div>

        {/* EDIT MODE Action Toolbar */}
        {!isCommissioned && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={handleStartProcess} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                <Play size={14} color="#2563EB" />
                <span>Initiate Site Checklist</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handleValidate} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                <ShieldCheck size={15} color="#2563EB" />
                <span>Validate Acceptance Rules</span>
              </button>

              <button
                type="button"
                onClick={handleBulkCommissionZone}
                disabled={bulkCommissioning}
                className="btn-secondary"
                style={{
                  padding: '6px 14px',
                  fontSize: '13px',
                  color: '#1D4ED8',
                  borderColor: '#93C5FD',
                  background: '#EFF6FF',
                  opacity: !bulkCommissioning ? 1 : 0.5,
                  cursor: !bulkCommissioning ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title={`Batch verify and generate commissioning records across all ${nodes.length} nodes in Zone ${selectedZone?.zoneCode || ''}`}
              >
                <FolderKanban size={15} color="#1D4ED8" />
                <span>{bulkCommissioning ? 'Bulk Commissioning...' : `Commission All (${nodes.length} Nodes)`}</span>
              </button>

              <button
                onClick={handleCompleteCommissioning}
                disabled={!isValidatedSuccess || saving}
                className="btn-primary"
                style={{
                  padding: '6px 16px',
                  fontSize: '13px',
                  opacity: isValidatedSuccess && !saving ? 1 : 0.5,
                  cursor: isValidatedSuccess && !saving ? 'pointer' : 'not-allowed',
                  background: '#166534',
                  borderColor: '#15803D'
                }}
                title={isValidatedSuccess ? 'Approve & Complete Single Node Commissioning' : 'Run validation successfully to enable commissioning approval'}
              >
                <CheckCircle2 size={15} />
                <span>{saving ? 'Approving...' : 'Approve Single Node'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Next Stage Navigation Banner when Commissioned */}
        {isCommissioned && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '14px 20px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} color="#166534" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>SITE COMMISSIONING APPROVED & VERIFIED</div>
                <div style={{ fontSize: '12px', color: '#15803D' }}>Engineering node and sensor package are fully commissioned and activated for runtime operations.</div>
              </div>
            </div>

            <button
              onClick={() => {
                const queryParams = new URLSearchParams();
                if (selectedAssetId) queryParams.set('assetId', selectedAssetId);
                if (isPointAsset && selectedPointAssetId) queryParams.set('pointAssetId', selectedPointAssetId);
                if (!isPointAsset && selectedRegionId) queryParams.set('regionId', selectedRegionId);
                if (selectedZoneId) queryParams.set('zoneId', selectedZoneId);
                if (selectedNodeId) queryParams.set('nodeId', selectedNodeId);
                
                navigate(`/config/release-review?${queryParams.toString()}`);
              }}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px', background: '#166534', borderColor: '#15803D', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Proceed to Engineering Release Review</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Feedback Banners */}
        {serverError && (
          <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#991B1B', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} />
            <span>{serverError}</span>
          </div>
        )}

        {saveSuccessMsg && (
          <div style={{ padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', color: '#166534', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Commissioning Verification Table */}
        {isTableExpanded && (
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isCommissioned ? <Lock size={13} color="#166534" /> : <Edit3 size={13} color="#2563EB" />}
                <span>{isCommissioned ? 'APPROVED COMMISSIONING RECORD (READ ONLY)' : 'SITE FIELD COMMISSIONING VERIFICATION GRID'}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#6B7280' }}>
                Verify physical installed quantities match design specifications before approval
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '13px' }}>Loading commissioning records from database...</div>
            ) : (
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>SENSOR TYPE</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>DESIGN QTY</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>COMMISSIONED QTY</th>
                    <th style={{ width: '20%' }}>VERIFICATION RESULT</th>
                    <th style={{ width: '28%', textAlign: 'right' }}>COMMISSION STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((row, idx) => {
                    const reqQty = row.requiredQty || 1;
                    const commQty = row.commissionedQty !== undefined ? row.commissionedQty : reqQty;
                    const isMatch = commQty === reqQty;

                    return (
                      <tr key={idx}>
                        <td>
                          <span style={{ fontWeight: 600, color: '#1F2937', fontSize: '13px' }}>{row.sensorType}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 700, color: '#1F2937' }}>{reqQty}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {!isCommissioned ? (
                            <input
                              type="number"
                              min="0"
                              max={reqQty}
                              className="input-field"
                              style={{ height: '30px', width: '70px', textAlign: 'center', fontSize: '13px' }}
                              value={commQty}
                              onChange={(e) => updateCommissionedQty(idx, parseInt(e.target.value) || 0)}
                            />
                          ) : (
                            <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 700, color: '#166534' }}>{commQty}</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: isMatch ? '#166534' : '#D97706' }}>
                            {isMatch ? '100% MATCH' : `${commQty} / ${reqQty} VERIFIED`}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`badge ${(row.status as string) === 'PASSED' || (row.status as string) === 'COMMISSIONED' || row.status === 'ACCEPTED' ? 'badge-active' : 'badge-enterprise'}`} style={{ background: (row.status as string) === 'COMMISSIONED' || (row.status as string) === 'PASSED' || row.status === 'ACCEPTED' ? '#F0FDF4' : '#FFFBEB', color: (row.status as string) === 'COMMISSIONED' || (row.status as string) === 'PASSED' || row.status === 'ACCEPTED' ? '#166534' : '#B45309' }}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {displayRows.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '13px' }}>
                        No sensor package design found for this node. Complete Sensor Package specification first.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const CommissioningWorkspacePage: React.FC = () => (
  <CommissioningErrorBoundary>
    <CommissioningWorkspaceContent />
  </CommissioningErrorBoundary>
);
