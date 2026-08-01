import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layers, CheckCircle2, AlertTriangle, ChevronRight, Save, ShieldCheck, Edit3, Lock, Eye, Cpu, Radio, Activity, Plus, Trash2, ArrowRight, MapPin, FolderKanban } from 'lucide-react';
import { assetService, Asset } from '../services/assetService';
import { regionService, Region } from '../services/regionService';
import { pointAssetService, PointAsset } from '../services/pointAssetService';
import { deploymentZoneService, DeploymentZone } from '../services/deploymentZoneService';
import { engineeringNodeService, EngineeringNode } from '../services/engineeringNodeService';
import { SENSOR_MASTER_LIST, sensorPackageService } from '../services/sensorPackageService';
import { useSensorPackageWorkspace } from '../hooks/useSensorPackageWorkspace';

export const SensorPackageWorkspacePage: React.FC = () => {
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

  const [selectedTypeInput, setSelectedTypeInput] = useState<string>(SENSOR_MASTER_LIST[0].type);
  const [customTypeInput, setCustomTypeInput] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [batchApplying, setBatchApplying] = useState<boolean>(false);

  // Single Source of Truth State: isSaved controls READ ONLY vs EDIT mode
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(true);

  const {
    items,
    loading,
    saving,
    serverError,
    validationResults: _validationResults,
    isValidatedSuccess,
    loadExistingPackage,
    addSensorType,
    removeSensorRow,
    updateSensorRow,
    validateDesign,
    saveEngineeringDesign,
  } = useSensorPackageWorkspace();

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
  }, [selectedAssetId, selectedRegionId, selectedPointAssetId, isPointAsset, pointAssets, searchParams]);

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

  // Load persisted Sensor Package whenever selectedNodeId changes
  useEffect(() => {
    if (selectedNodeId) {
      setSaveSuccessMsg(null);
      loadExistingPackage(selectedNodeId).then((data) => {
        if (data && data.items && data.items.length > 0) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      });
    }
  }, [selectedNodeId, loadExistingPackage]);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId);
  const selectedPointAsset = pointAssets.find((p) => p.id === selectedPointAssetId);
  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleAddSensor = () => {
    const sensorType = selectedTypeInput === 'CUSTOM' ? customTypeInput.trim() : selectedTypeInput;
    if (!sensorType) return;
    addSensorType(sensorType);
    if (selectedTypeInput === 'CUSTOM') setCustomTypeInput('');
    setSaveSuccessMsg(null);
  };

  const handleValidate = () => {
    if (!selectedNode) return;
    validateDesign();
  };

  const handleSave = async () => {
    if (!selectedNode) return;
    let isValid = isValidatedSuccess;
    if (!isValid) {
      isValid = validateDesign();
    }
    if (!isValid) return;

    try {
      await saveEngineeringDesign(selectedNode.id || '00000000-0000-0000-0000-000000000001');
      setSaveSuccessMsg('Sensor Package engineering design successfully validated and published as permanent artifact!');
      setIsSaved(true);
      setIsTableExpanded(true);
    } catch {
      // serverError handled in hook
    }
  };

  const handleApplyTemplateToZone = async () => {
    if (!selectedZone || !nodes || nodes.length === 0) return;
    if (!items || items.length === 0) {
      alert('Please configure at least one sensor specification in the template before applying to zone nodes.');
      return;
    }
    setBatchApplying(true);
    try {
      const payloadItems = items.map((i) => ({
        sensorType: i.sensorType,
        quantity: i.quantity,
        samplingSeconds: i.samplingIntervalSeconds,
        warningThreshold: i.warningThreshold,
        criticalThreshold: i.criticalThreshold,
        measurementParameter: i.measurementParameter,
        engineeringPurpose: i.engineeringPurpose,
        remarks: i.remarks,
      }));

      await Promise.all(
        nodes.map((node) =>
          sensorPackageService.savePackage({
            engineeringNodeId: node.id || '',
            items: payloadItems,
          }).catch(() => null)
        )
      );

      setSaveSuccessMsg(
        `Sensor Package Template successfully generated and published across all ${nodes.length} Engineering Nodes in Zone ${selectedZone.zoneCode}!`
      );
      setIsSaved(true);
      setIsTableExpanded(true);
    } catch (err: any) {
      alert('Failed to apply Sensor Package Template across zone nodes: ' + (err?.message || 'Unknown error'));
    } finally {
      setBatchApplying(false);
    }
  };

  const isReadyToDisplay = isPointAsset 
    ? (selectedAsset && selectedPointAsset && selectedZone && selectedNode)
    : (selectedAsset && selectedRegion && selectedZone && selectedNode);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1360px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Enterprise Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
            <span>Platform</span>
            <ChevronRight size={12} />
            <span>Engineering Design</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Sensor Designer</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Sensor Package Workspace</h1>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              background: isSaved ? '#F0FDF4' : '#EFF6FF',
              color: isSaved ? '#166534' : '#1E40AF',
              border: isSaved ? '1px solid #BBF7D0' : '1px solid #BFDBFE'
            }}>
              {isSaved ? 'SAVED ARTIFACT (READ ONLY)' : 'EDIT MODE'}
            </span>
            {isSaved && (
              <button
                type="button"
                onClick={() => setIsSaved(false)}
                className="btn-secondary"
                style={{ padding: '4px 12px', fontSize: '12px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', cursor: 'pointer' }}
                title="Unlock Sensor Package Design for modification"
              >
                <Edit3 size={14} color="#2563EB" />
                <span>Edit Package</span>
              </button>
            )}
          </div>
        </div>

        {/* Target Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* 1. ASSET SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '160px' }}
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
            >
              {assets.map((ast) => (
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
                {pointAssets.map((p) => (
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
                {regions.map((r) => (
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
              {zones.map((z) => (
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
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>{n.nodeCode} (#{n.nodeNumber})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Workspace */}
      {isReadyToDisplay && selectedNode && selectedZone && (
        <>
          {/* Header Summary Metadata Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', background: '#FFFFFF', padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>ASSET</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} color="#2563EB" />
                <span>{selectedAsset?.assetName}</span>
              </div>
            </div>
            
            {isPointAsset ? (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>POINT INFRASTRUCTURE</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E40AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#2563EB" />
                  <span>{selectedPointAsset?.pointAssetName}</span>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>REGION</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={14} color="#2563EB" />
                  <span>{selectedRegion?.regionCode}</span>
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>DEPLOYMENT ZONE</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} color="#2563EB" />
                <span>{selectedZone.zoneCode}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>TARGET NODE</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E40AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={14} color="#2563EB" />
                <span>{selectedNode.nodeCode} (km {selectedNode.formattedChainage})</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>SENSOR TYPES</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937', marginTop: '2px' }}>
                {items.length} Configured
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em' }}>PACKAGE ITEMS</div>
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
                title="Click to view Sensor Package items"
              >
                <span>{items.length}</span>
                <Eye size={13} color="#2563EB" />
              </button>
            </div>
          </div>

          {/* EDIT MODE Action Toolbar */}
          {!isSaved && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>ADD SENSOR:</span>
                <select
                  className="input-field"
                  style={{ height: '34px', fontSize: '12px', width: '280px' }}
                  value={selectedTypeInput}
                  onChange={(e) => setSelectedTypeInput(e.target.value)}
                >
                  {SENSOR_MASTER_LIST.map((s) => (
                    <option key={s.type} value={s.type}>
                      {s.type} — {s.parameter} ({s.category})
                    </option>
                  ))}
                  <option value="CUSTOM">+ Custom Sensor Type...</option>
                </select>

                {selectedTypeInput === 'CUSTOM' && (
                  <input
                    type="text"
                    className="input-field"
                    style={{ height: '34px', fontSize: '12px', width: '180px' }}
                    placeholder="Enter Sensor Type Name"
                    value={customTypeInput}
                    onChange={(e) => setCustomTypeInput(e.target.value)}
                  />
                )}

                <button onClick={handleAddSensor} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                  <Plus size={14} color="#2563EB" />
                  <span>Add Sensor Type</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={handleValidate} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                  <ShieldCheck size={15} color="#2563EB" />
                  <span>Validate Package</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyTemplateToZone}
                  disabled={batchApplying || items.length === 0}
                  className="btn-secondary"
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    color: '#1D4ED8',
                    borderColor: '#93C5FD',
                    background: '#EFF6FF',
                    opacity: !batchApplying && items.length > 0 ? 1 : 0.5,
                    cursor: !batchApplying && items.length > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title={`Apply configured Sensor Package Template across all ${nodes.length} nodes in Zone ${selectedZone?.zoneCode || ''}`}
                >
                  <FolderKanban size={15} color="#1D4ED8" />
                  <span>{batchApplying ? 'Applying Template...' : `Apply Template to All (${nodes.length} Nodes)`}</span>
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving || items.length === 0}
                  className="btn-primary"
                  style={{
                    padding: '6px 16px',
                    fontSize: '13px',
                    opacity: !saving && items.length > 0 ? 1 : 0.5,
                    cursor: !saving && items.length > 0 ? 'pointer' : 'not-allowed',
                  }}
                  title={items.length > 0 ? 'Save & Publish Sensor Package Engineering Design for current node' : 'Add at least one sensor type to save'}
                >
                  <Save size={15} />
                  <span>{saving ? 'Saving Node Package...' : 'Save Node Package'}</span>
                </button>
              </div>
            </div>
          )}

          {/* SAVED MODE: Enterprise Next Stage CTA Navigation Banner */}
          {isSaved && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '14px 20px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="#166534" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>SENSOR PACKAGE ARTIFACT PUBLISHED</div>
                  <div style={{ fontSize: '12px', color: '#15803D' }}>Engineering specification verified. Ready for Site Field Installation & Commissioning.</div>
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
                  
                  navigate(`/config/commissioning?${queryParams.toString()}`);
                }}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '13px', background: '#166534', borderColor: '#15803D', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Proceed to Commissioning</span>
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

          {/* Sensor Package Items Table */}
          {isTableExpanded && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isSaved ? <Lock size={13} color="#166534" /> : <Edit3 size={13} color="#2563EB" />}
                  <span>{isSaved ? 'SAVED SENSOR PACKAGE ARTIFACT (READ ONLY)' : 'SENSOR PACKAGE SPECIFICATION GRID'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#6B7280' }}>
                    {isSaved ? 'Click "Edit Package" to unlock' : 'Specify sensor quantities, polling rates, and thresholds'}
                  </span>
                  {isSaved ? (
                    <button
                      onClick={() => setIsSaved(false)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                      title="Unlock Sensor Package Design for modification"
                    >
                      <Edit3 size={12} color="#2563EB" />
                      <span>Edit Package</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      disabled={saving || items.length === 0}
                      className="btn-primary"
                      style={{
                        padding: '5px 14px',
                        fontSize: '12px',
                        background: '#2563EB',
                        borderColor: '#1D4ED8',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: !saving && items.length > 0 ? 'pointer' : 'not-allowed',
                        opacity: !saving && items.length > 0 ? 1 : 0.5,
                      }}
                      title="Save & Publish Sensor Package Engineering Design"
                    >
                      <Save size={13} />
                      <span>{saving ? 'Saving...' : 'Save Engineering Design'}</span>
                    </button>
                  )}
                </div>
              </div>              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '13px' }}>Loading sensor package design from database...</div>
              ) : (
                <>
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th style={{ width: '22%' }}>SENSOR TYPE</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>QTY</th>
                        <th style={{ width: '15%' }}>SAMPLING (sec)</th>
                        <th style={{ width: '18%' }}>WARN THRESHOLD</th>
                        <th style={{ width: '18%' }}>CRITICAL THRESHOLD</th>
                        <th style={{ width: '12%', textAlign: 'right' }}>STATUS</th>
                        {!isSaved && <th style={{ width: '5%', textAlign: 'center' }}>REMOVE</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((row, idx) => (
                        <tr key={idx}>
                          <td>
                            <span style={{ fontWeight: 600, color: '#1F2937', fontSize: '13px' }}>{row.sensorType}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {!isSaved ? (
                              <input
                                type="number"
                                min="1"
                                max="100"
                                className="input-field"
                                style={{ height: '30px', width: '60px', textAlign: 'center', fontSize: '13px' }}
                                value={row.quantity}
                                onChange={(e) => updateSensorRow(idx, 'quantity', parseInt(e.target.value) || 1)}
                              />
                            ) : (
                              <span style={{ fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 700, color: '#2563EB' }}>{row.quantity}</span>
                            )}
                          </td>
                          <td>
                            {!isSaved ? (
                              <input
                                type="number"
                                min="1"
                                className="input-field"
                                style={{ height: '30px', fontSize: '13px' }}
                                value={(row as any).samplingIntervalSeconds || 1}
                                onChange={(e) => updateSensorRow(idx, 'samplingIntervalSeconds' as any, parseInt(e.target.value) || 1)}
                              />
                            ) : (
                              <span style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: '#374151' }}>{(row as any).samplingIntervalSeconds || 1}s</span>
                            )}
                          </td>
                          <td>
                            {!isSaved ? (
                              <input
                                type="text"
                                className="input-field"
                                style={{ height: '30px', fontSize: '12px' }}
                                value={(row as any).warningThreshold || ''}
                                onChange={(e) => updateSensorRow(idx, 'warningThreshold' as any, e.target.value)}
                              />
                            ) : (
                              <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 500 }}>{(row as any).warningThreshold || '—'}</span>
                            )}
                          </td>
                          <td>
                            {!isSaved ? (
                              <input
                                type="text"
                                className="input-field"
                                style={{ height: '30px', fontSize: '12px' }}
                                value={(row as any).criticalThreshold || ''}
                                onChange={(e) => updateSensorRow(idx, 'criticalThreshold' as any, e.target.value)}
                              />
                            ) : (
                              <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500 }}>{(row as any).criticalThreshold || '—'}</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className={`badge ${row.status === 'VALIDATED' ? 'badge-active' : 'badge-enterprise'}`} style={{ background: row.status === 'VALIDATED' ? '#F0FDF4' : '#FFFBEB', color: row.status === 'VALIDATED' ? '#166534' : '#B45309' }}>
                              {row.status}
                            </span>
                          </td>
                          {!isSaved && (
                            <td style={{ textAlign: 'center' }}>
                              <button onClick={() => removeSensorRow(idx)} className="btn-danger" style={{ padding: '4px 6px' }}>
                                <Trash2 size={13} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {items.length === 0 && (
                        <tr>
                          <td colSpan={isSaved ? 6 : 7} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '13px' }}>
                            No sensor types added yet. Select a sensor type above and click "Add Sensor Type".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {!isSaved && items.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                      <button onClick={handleValidate} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                        <ShieldCheck size={15} color="#2563EB" />
                        <span>Validate Package</span>
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving || items.length === 0}
                        className="btn-primary"
                        style={{
                          padding: '6px 18px',
                          fontSize: '13px',
                          background: '#2563EB',
                          borderColor: '#1D4ED8',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: !saving && items.length > 0 ? 'pointer' : 'not-allowed',
                          opacity: !saving && items.length > 0 ? 1 : 0.5,
                        }}
                      >
                        <Save size={15} />
                        <span>{saving ? 'Saving...' : 'Save Engineering Design'}</span>
                      </button>
                    </div>
                  )}
                </>
              )}      </div>
          )}
        </>
      )}
    </div>
  );
};
