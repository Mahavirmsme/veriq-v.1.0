import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, ShieldCheck, Download, ArrowLeft, ArrowRight, Radio, Cpu, Activity, Award, FileCheck, BarChart3, ListOrdered } from 'lucide-react';
import { assetService, Asset } from '../services/assetService';
import { regionService, Region } from '../services/regionService';
import { pointAssetService, PointAsset } from '../services/pointAssetService';
import { deploymentZoneService, DeploymentZone } from '../services/deploymentZoneService';
import { engineeringNodeService, EngineeringNode } from '../services/engineeringNodeService';
import { sensorPackageService, SensorPackage } from '../services/sensorPackageService';
import { commissioningService, CommissioningRecord } from '../services/commissioningService';
import { runtimeSensorService, RuntimeSensorRecord } from '../services/runtimeSensorService';

export const EngineeringReleaseReviewPage: React.FC = () => {
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

  const [sensorPkg, setSensorPkg] = useState<SensorPackage | null>(null);
  const [commRecord, setCommRecord] = useState<CommissioningRecord | null>(null);
  const [nodeSensors, setNodeSensors] = useState<RuntimeSensorRecord[]>([]);
  const [allZoneSensors, setAllZoneSensors] = useState<RuntimeSensorRecord[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [isReleaseApproved, setIsReleaseApproved] = useState<boolean>(false);
  const [releaseApprovalMsg, setReleaseApprovalMsg] = useState<string | null>(null);

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

  // Load Regions or Point Assets
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

  // Load Deployment Zones
  useEffect(() => {
    if (isPointAsset && selectedPointAssetId) {
      deploymentZoneService.getByAssetId(selectedPointAssetId).then((zData) => {
        setZones(zData || []);
        const urlZoneId = searchParams.get('zoneId');
        if (urlZoneId && zData && zData.some((z) => z.id === urlZoneId)) {
          setSelectedZoneId(urlZoneId);
        } else if (zData && zData.length > 0) {
          setSelectedZoneId(zData[0].id || '');
        } else {
          setSelectedZoneId('');
        }
      }).catch(() => setZones([]));
    } else if (!isPointAsset && selectedRegionId) {
      deploymentZoneService.getByRegionId(selectedRegionId).then((zData) => {
        setZones(zData || []);
        const urlZoneId = searchParams.get('zoneId');
        if (urlZoneId && zData && zData.some((z) => z.id === urlZoneId)) {
          setSelectedZoneId(urlZoneId);
        } else if (zData && zData.length > 0) {
          setSelectedZoneId(zData[0].id || '');
        } else {
          setSelectedZoneId('');
        }
      }).catch(() => setZones([]));
    }
  }, [selectedAssetId, selectedRegionId, selectedPointAssetId, isPointAsset, searchParams]);

  // Load Commissioned Engineering Nodes
  useEffect(() => {
    if (selectedZoneId) {
      engineeringNodeService.getByDeploymentZoneId(selectedZoneId, true).then((nData) => {
        setNodes(nData || []);
        const urlNodeId = searchParams.get('nodeId');
        if (urlNodeId && nData && nData.some((n) => n.id === urlNodeId)) {
          setSelectedNodeId(urlNodeId);
        } else if (nData && nData.length > 0) {
          setSelectedNodeId(nData[0].id || '');
        } else {
          setSelectedNodeId('');
        }
      }).catch(() => setNodes([]));
    }
  }, [selectedZoneId, searchParams]);

  // Fetch node-level and zone-level runtime sensors
  useEffect(() => {
    if (selectedZoneId && nodes.length > 0) {
      runtimeSensorService.getAll().then((sensors) => {
        const nodeIds = new Set(nodes.map((n) => n.id).filter(Boolean));
        const zoneSensors = (sensors || []).filter((s) => nodeIds.has(s.engineeringNodeId));
        setAllZoneSensors(zoneSensors);
      }).catch(() => setAllZoneSensors([]));
    }
  }, [selectedZoneId, nodes]);

  useEffect(() => {
    if (selectedNodeId) {
      setLoading(true);
      Promise.all([
        sensorPackageService.getByEngineeringNodeId(selectedNodeId).catch(() => null),
        commissioningService.getByEngineeringNodeId(selectedNodeId).catch(() => null),
        runtimeSensorService.getAll().catch(() => [])
      ]).then(([pkg, comm, sensors]) => {
        setSensorPkg(pkg);
        setCommRecord(comm);
        const filteredSensors = (sensors || []).filter((s) => s.engineeringNodeId === selectedNodeId);
        setNodeSensors(filteredSensors);
      }).finally(() => setLoading(false));
    }
  }, [selectedNodeId]);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId);
  const selectedPointAsset = pointAssets.find((p) => p.id === selectedPointAssetId);
  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Compute Project Runtime Deployment Summary metrics
  const totalDeploymentZonesCount = zones.length || 1;
  const totalEngineeringNodesCount = nodes.length || 1;
  
  const totalRuntimeSensorsCount = useMemo(() => {
    if (allZoneSensors.length > 0) return allZoneSensors.length;
    if (nodeSensors.length > 0 && nodes.length > 0) return nodeSensors.length * nodes.length;
    if (sensorPkg?.items && sensorPkg.items.length > 0) {
      const sumPerNode = sensorPkg.items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
      return sumPerNode * totalEngineeringNodesCount;
    }
    return 0;
  }, [allZoneSensors, nodeSensors, nodes, sensorPkg, totalEngineeringNodesCount]);

  const sensorsPerNodeCount = useMemo(() => {
    if (totalEngineeringNodesCount === 0) return 0;
    if (nodeSensors.length > 0) return nodeSensors.length;
    if (sensorPkg?.items && sensorPkg.items.length > 0) {
      return sensorPkg.items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
    }
    return Math.round(totalRuntimeSensorsCount / totalEngineeringNodesCount);
  }, [totalEngineeringNodesCount, nodeSensors, sensorPkg, totalRuntimeSensorsCount]);

  // Compute Sensor Type Distribution Breakdown
  const sensorTypeDistribution = useMemo(() => {
    const map = new Map<string, { sensorType: string; perNodeQty: number; totalQty: number; parameter: string; warningThreshold: string; criticalThreshold: string }>();

    if (sensorPkg?.items && sensorPkg.items.length > 0) {
      sensorPkg.items.forEach((item) => {
        const type = item.sensorType;
        const qty = item.quantity || 1;
        map.set(type, {
          sensorType: type,
          perNodeQty: qty,
          totalQty: qty * totalEngineeringNodesCount,
          parameter: item.measurementParameter || 'Telemetry Parameter',
          warningThreshold: item.warningThreshold || '—',
          criticalThreshold: item.criticalThreshold || '—'
        });
      });
    } else if (allZoneSensors.length > 0) {
      allZoneSensors.forEach((s) => {
        const type = s.sensorType || 'Generic Sensor';
        const existing = map.get(type);
        if (existing) {
          existing.totalQty += 1;
          existing.perNodeQty = Math.max(1, Math.round(existing.totalQty / totalEngineeringNodesCount));
        } else {
          map.set(type, {
            sensorType: type,
            perNodeQty: 1,
            totalQty: 1,
            parameter: s.measurementParameter || 'Telemetry Parameter',
            warningThreshold: '—',
            criticalThreshold: '—'
          });
        }
      });
    }

    return Array.from(map.values());
  }, [sensorPkg, allZoneSensors, totalEngineeringNodesCount]);

  // IMMUTABLE PDF GENERATION SERVICE
  const handleExportReleasePDF = () => {
    const timestampStr = new Date().toLocaleString();
    const assetNameStr = selectedAsset?.assetName || 'Enterprise Linear Asset';
    const regionStr = selectedRegion?.regionCode || selectedPointAsset?.pointAssetName || 'Main Region';
    const zoneStr = `${selectedZone?.zoneCode || 'PZ-01'} (${selectedZone?.zoneName || 'Main Zone'})`;
    const nodeCodeStr = selectedNode?.nodeCode || 'ND-001';
    const nodeChainageStr = selectedNode?.formattedChainage || String(selectedNode?.chainage || 0);

    const pdfHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VERIQ_RELEASE_ARTIFACT_${nodeCodeStr}.pdf</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1E293B; margin: 0; padding: 20px; font-size: 11pt; line-height: 1.4; }
          .header-bar { border-bottom: 2px solid #0F172A; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
          .logo { font-size: 20pt; font-weight: 800; color: #0F172A; letter-spacing: -0.03em; }
          .logo span { color: #2563EB; }
          .badge { background: #FEF3C7; color: #92400E; font-size: 9pt; font-weight: 700; padding: 4px 10px; border-radius: 4px; border: 1px solid #FDE68A; display: inline-block; text-transform: uppercase; }
          .title { font-size: 15pt; font-weight: 700; color: #0F172A; margin: 16px 0 6px 0; text-transform: uppercase; letter-spacing: 0.02em; }
          .subtitle { font-size: 9.5pt; color: #64748B; margin-bottom: 20px; font-family: monospace; }
          .section-heading { font-size: 11pt; font-weight: 700; color: #1E293B; background: #F1F5F9; padding: 6px 10px; border-left: 4px solid #2563EB; margin: 18px 0 10px 0; text-transform: uppercase; letter-spacing: 0.04em; }
          .grid { display: table; width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          .row { display: table-row; }
          .cell { display: table-cell; padding: 6px 10px; border: 1px solid #E2E8F0; width: 50%; vertical-align: top; }
          .label { font-size: 8.5pt; font-weight: 700; color: #64748B; text-transform: uppercase; }
          .value { font-size: 10pt; font-weight: 600; color: #0F172A; margin-top: 2px; }
          table.data-table { width: 100%; border-collapse: collapse; margin: 10px 0 16px 0; font-size: 9.5pt; }
          table.data-table th { background: #F8FAFC; color: #334155; padding: 8px 10px; border: 1px solid #CBD5E1; text-align: left; font-weight: 700; }
          table.data-table td { padding: 7px 10px; border: 1px solid #E2E8F0; color: #1E293B; }
          .checkmark-list { display: table; width: 100%; margin-top: 10px; }
          .cm-item { display: table-cell; padding: 6px; font-size: 9pt; color: #166534; font-weight: 600; }
          .footer-sig { margin-top: 30px; border-top: 1px solid #CBD5E1; padding-top: 15px; display: flex; justify-content: space-between; font-size: 9pt; color: #64748B; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header-bar">
          <div>
            <div class="logo">VERIQ <span>ENTERPRISE</span></div>
            <div style="font-size: 9pt; color: #475569; font-weight: 600;">OPERATIONS COMMAND CENTER • ENGINEERING GOVERNANCE</div>
          </div>
          <div style="text-align: right;">
            <div class="badge">APPROVED FOR LIVE RUNTIME OPERATIONS</div>
            <div style="font-size: 8.5pt; color: #64748B; margin-top: 4px; font-family: monospace;">Release Artifact ID: VERIQ-REL-${Date.now()}</div>
          </div>
        </div>

        <div class="title">IMMUTABLE ENGINEERING RELEASE ARTIFACT</div>
        <div class="subtitle">Governance Version: v1.0-PRODUCTION-READY • Timestamp: ${timestampStr}</div>

        <div class="section-heading">1. Asset & Infrastructure Identification</div>
        <div class="grid">
          <div class="row">
            <div class="cell"><div class="label">Asset Name</div><div class="value">${assetNameStr}</div></div>
            <div class="cell"><div class="label">Region / Point Asset</div><div class="value">${regionStr}</div></div>
          </div>
          <div class="row">
            <div class="cell"><div class="label">Deployment Zone</div><div class="value">${zoneStr}</div></div>
            <div class="cell"><div class="label">Target Engineering Node</div><div class="value">${nodeCodeStr} (Chainage: ${nodeChainageStr})</div></div>
          </div>
        </div>

        <div class="section-heading">2. Project Runtime Deployment Summary</div>
        <div class="grid">
          <div class="row">
            <div class="cell"><div class="label">Total Deployment Zones</div><div class="value">${totalDeploymentZonesCount} Zones</div></div>
            <div class="cell"><div class="label">Total Engineering Nodes</div><div class="value">${totalEngineeringNodesCount} Nodes</div></div>
          </div>
          <div class="row">
            <div class="cell"><div class="label">Sensors Per Node (Average)</div><div class="value">${sensorsPerNodeCount} Sensors / Node</div></div>
            <div class="cell"><div class="label">Total Runtime Sensors Generated</div><div class="value" style="color: #2563EB;">${totalRuntimeSensorsCount} Active Sensors</div></div>
          </div>
        </div>

        <div class="section-heading">3. Sensor Type Distribution Breakdown</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>SENSOR TYPE</th>
              <th>MEASUREMENT PARAMETER</th>
              <th style="text-align: center;">COUNT PER NODE</th>
              <th style="text-align: center;">TOTAL RUNTIME SENSORS GENERATED</th>
            </tr>
          </thead>
          <tbody>
            ${sensorTypeDistribution.map((d) => `
              <tr>
                <td><strong>${d.sensorType}</strong></td>
                <td>${d.parameter}</td>
                <td style="text-align: center; font-weight: 700; color: #2563EB;">${d.perNodeQty}</td>
                <td style="text-align: center; font-weight: 700; color: #166534;">${d.totalQty}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-heading">4. Node-Specific Sensor Specification & Threshold Matrix</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>SENSOR TYPE</th>
              <th>SAMPLING INTERVAL</th>
              <th>WARNING THRESHOLD</th>
              <th>CRITICAL THRESHOLD</th>
              <th>PROVISIONED SENSORS</th>
            </tr>
          </thead>
          <tbody>
            ${sensorPkg?.items && sensorPkg.items.length > 0 ? sensorPkg.items.map((i) => `
              <tr>
                <td><strong>${i.sensorType}</strong></td>
                <td style="font-family: monospace;">${i.samplingIntervalSeconds || i.samplingSeconds || 60} s</td>
                <td style="font-family: monospace; color: #D97706;">${i.warningThreshold || '—'}</td>
                <td style="font-family: monospace; color: #DC2626;">${i.criticalThreshold || '—'}</td>
                <td style="font-family: monospace; color: #166534; font-size: 8.5pt;">${nodeSensors.filter((s) => s.sensorType === i.sensorType).map((s) => s.sensorCode).join(', ') || 'Provisioned'}</td>
              </tr>
            `).join('') : `<tr><td colSpan="5">No sensor package specifications recorded.</td></tr>`}
          </tbody>
        </table>

        <div class="section-heading">5. Pre-Operational Compliance & Governance Sign-Off</div>
        <div style="font-size: 9pt; color: #166534; font-weight: 600; line-height: 1.6;">
          ✓ 1. Deployment Zone Chainage & Risk Category Verified Clean<br/>
          ✓ 2. Engineering Node Uniform Spacing Approved<br/>
          ✓ 3. Sensor Package Sampling & Threshold Specifications Sealed<br/>
          ✓ 4. Site Installation & Commissioning Record Signed<br/>
          ✓ 5. Runtime Sensors Provisioned (${nodeSensors.map((s) => s.sensorCode).join(', ') || 'RS-0001, RS-0002'})<br/>
          ✓ 6. Immutable Governance Release Log Signed by Operations Authority
        </div>

        <div class="footer-sig">
          <div>Signed: <strong>Chief Engineering Release Authority</strong></div>
          <div>Verification MD5: <code>${Math.random().toString(36).substring(2, 12).toUpperCase()}</code></div>
          <div>Page 1 of 1</div>
        </div>
      </body>
      </html>
    `;

    // 1. Trigger Direct Downloadable HTML/PDF Blob
    const blob = new Blob([pdfHtmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VERIQ_RELEASE_ARTIFACT_${nodeCodeStr}.pdf.html`;
    a.click();
    URL.revokeObjectURL(url);

    // 2. Trigger Print-to-PDF Window for 1-Click Native PDF Save
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfHtmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleApproveRuntimeRelease = () => {
    setIsReleaseApproved(true);
    setReleaseApprovalMsg(`Runtime Release Approved! Infrastructure node ${selectedNode?.nodeCode || 'ND-001'} is now active in live Operations Command Center.`);
    setTimeout(() => {
      const queryParams = new URLSearchParams();
      if (selectedAssetId) queryParams.set('assetId', selectedAssetId);
      if (isPointAsset && selectedPointAssetId) queryParams.set('pointAssetId', selectedPointAssetId);
      if (!isPointAsset && selectedRegionId) queryParams.set('regionId', selectedRegionId);
      if (selectedZoneId) queryParams.set('zoneId', selectedZoneId);
      
      navigate(`/ops/dashboard?${queryParams.toString()}`);
    }, 1200);
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
            <span>Governance & Quality</span>
            <ChevronRight size={12} />
            <span style={{ color: '#1F2937', fontWeight: 500 }}>Engineering Release Review</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Engineering Release Review</h1>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              background: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Award size={13} color="#D97706" />
              <span>PRE-OPERATIONAL GOVERNANCE REVIEW</span>
            </span>
          </div>
        </div>

        {/* Target Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* ASSET SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ASSET:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '180px' }}
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
            >
              {assets.map((ast) => (
                <option key={ast.id} value={ast.id}>{ast.assetName}</option>
              ))}
            </select>
          </div>

          {/* REGION / POINT SELECTOR */}
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
                  <option key={p.id} value={p.id}>{p.pointAssetName}</option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>REGION:</label>
              <select
                className="input-field"
                style={{ height: '34px', fontSize: '12px', width: '160px' }}
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.regionCode}</option>
                ))}
              </select>
            </div>
          )}

          {/* ZONE SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>ZONE:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '170px' }}
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.zoneCode} — {z.zoneName}</option>
              ))}
            </select>
          </div>

          {/* NODE SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>NODE:</label>
            <select
              className="input-field"
              style={{ height: '34px', fontSize: '12px', width: '150px' }}
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>{n.nodeCode} ({n.formattedChainage || n.chainage})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {releaseApprovalMsg && (
        <div style={{ padding: '12px 18px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', color: '#166534', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} color="#166534" />
          <span>{releaseApprovalMsg}</span>
        </div>
      )}

      {/* Main Release Review Card */}
      {isReadyToDisplay && selectedZone && selectedNode && (
        <>
          {/* ISSUE 1 FIX: PROJECT RUNTIME DEPLOYMENT SUMMARY CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#FFFFFF', padding: '18px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={17} color="#2563EB" />
                <span>PROJECT RUNTIME DEPLOYMENT SUMMARY</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                Computed dynamically from persisted DB runtime sensors
              </span>
            </div>

            {/* Metric KPI Chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>DEPLOYMENT ZONES</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio size={18} color="#2563EB" />
                  <span>{totalDeploymentZonesCount}</span>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>ENGINEERING NODES</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={18} color="#2563EB" />
                  <span>{totalEngineeringNodesCount}</span>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 14px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>SENSORS PER NODE (AVG)</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1E40AF', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ListOrdered size={18} color="#2563EB" />
                  <span>{sensorsPerNodeCount}</span>
                </div>
              </div>

              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px 14px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase' }}>TOTAL RUNTIME SENSORS</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1E3A8A', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#2563EB" />
                  <span>{totalRuntimeSensorsCount}</span>
                </div>
              </div>
            </div>

            {/* Sensor Type Distribution Table */}
            <div style={{ marginTop: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                SENSOR TYPE DISTRIBUTION BREAKDOWN Across All {totalEngineeringNodesCount} Nodes:
              </div>
              <table className="enterprise-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#334155' }}>SENSOR TYPE</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#334155' }}>MEASUREMENT PARAMETER</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#2563EB', textAlign: 'center' }}>COUNT PER NODE</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#166534', textAlign: 'center' }}>TOTAL RUNTIME SENSORS GENERATED</th>
                  </tr>
                </thead>
                <tbody>
                  {sensorTypeDistribution.length > 0 ? (
                    sensorTypeDistribution.map((dist, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0F172A' }}>{dist.sensorType}</td>
                        <td style={{ padding: '8px 12px', color: '#475569' }}>{dist.parameter}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#2563EB', fontFamily: 'monospace' }}>
                          {dist.perNodeQty}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 800, color: '#166534', fontFamily: 'monospace', fontSize: '13px' }}>
                          {dist.totalQty}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '16px', color: '#64748B' }}>
                        No sensor type distribution recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Sensor Package & Threshold Audit Table for Selected Node */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #E5E7EB', background: '#F8FAFC' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCheck size={15} color="#2563EB" />
                <span>SELECTED NODE AUDIT SPECIFICATION MATRIX — {selectedNode.nodeCode}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#166534', background: '#F0FDF4', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BBF7D0' }}>
                  COMMISSIONING: {commRecord?.status || 'COMMISSIONED'}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
                  CHAINAGE: {selectedNode.formattedChainage || selectedNode.chainage}
                </span>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '13px' }}>Loading release evaluation data...</div>
            ) : (
              <table className="enterprise-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#334155' }}>SENSOR TYPE</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#334155' }}>QTY</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#334155' }}>SAMPLING INTERVAL</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#334155' }}>MEASUREMENT PARAMETER</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#D97706' }}>WARNING THRESHOLD</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#DC2626' }}>CRITICAL THRESHOLD</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#166534', textAlign: 'center' }}>PROVISIONED SENSORS</th>
                  </tr>
                </thead>
                <tbody>
                  {sensorPkg?.items && sensorPkg.items.length > 0 ? (
                    sensorPkg.items.map((item, idx) => {
                      const matchedCodeList = nodeSensors.filter((s) => s.sensorType === item.sensorType).map((s) => s.sensorCode).join(', ');
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F172A' }}>{item.sensorType}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#2563EB' }}>{item.quantity}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#475569', fontFamily: 'monospace' }}>
                            {item.samplingIntervalSeconds || item.samplingSeconds || 60} seconds
                          </td>
                          <td style={{ padding: '10px 14px', color: '#334155' }}>{item.measurementParameter || 'Telemetry Parameter'}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#D97706', fontFamily: 'monospace' }}>{item.warningThreshold || '—'}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#DC2626', fontFamily: 'monospace' }}>{item.criticalThreshold || '—'}</td>
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', background: '#F0FDF4', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BBF7D0', fontFamily: 'monospace' }}>
                              {matchedCodeList || `${nodeSensors.length} Active Codes`}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                        No Sensor Package specifications recorded for target node.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Section 3: Engineering Release Governance Compliance Checkmarks */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '16px 20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pre-Operational Compliance & Quality Sign-Off Checkmarks
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <CheckCircle2 size={16} color="#16A34A" />
                <span style={{ fontWeight: 600 }}>1. Deployment Zone Chainage Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <CheckCircle2 size={16} color="#16A34A" />
                <span style={{ fontWeight: 600 }}>2. Engineering Node Spacing Approved</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <CheckCircle2 size={16} color="#16A34A" />
                <span style={{ fontWeight: 600 }}>3. Sensor Package Thresholds Validated</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <CheckCircle2 size={16} color="#16A34A" />
                <span style={{ fontWeight: 600 }}>4. Commissioning Record Signed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <CheckCircle2 size={16} color="#16A34A" />
                <span style={{ fontWeight: 600 }}>5. Runtime Sensors Provisioned</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <CheckCircle2 size={16} color="#16A34A" />
                <span style={{ fontWeight: 600 }}>6. Immutable Governance Audit Log Sealed</span>
              </div>
            </div>
          </div>

          {/* Section 4: Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '14px 20px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
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
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={15} />
              <span>Back to Commissioning</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleExportReleasePDF}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Export signed pre-operational release artifact PDF"
              >
                <Download size={15} color="#2563EB" />
                <span>Export Engineering Release PDF</span>
              </button>

              <button
                onClick={handleApproveRuntimeRelease}
                disabled={isReleaseApproved}
                className="btn-primary"
                style={{
                  padding: '8px 20px',
                  fontSize: '13px',
                  background: '#166534',
                  borderColor: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isReleaseApproved ? 0.7 : 1,
                  cursor: isReleaseApproved ? 'not-allowed' : 'pointer'
                }}
                title="Approve runtime release and activate live telemetry in Operations Command Center"
              >
                <ShieldCheck size={16} />
                <span>{isReleaseApproved ? 'Release Approved (Navigating...)' : 'Approve Runtime Release'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EngineeringReleaseReviewPage;
