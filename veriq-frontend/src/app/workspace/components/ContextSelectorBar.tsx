import React from 'react';
import { useEngineeringContext } from '../context/useEngineeringContext';

/**
 * Enterprise Context Selector Bar enforcing the Frozen VERIQ Domain Model:
 * 
 * - LINEAR ASSET: ASSET -> REGION -> DEPLOYMENT ZONE
 *   Example: Samruddhi Mahamarg -> Region 1 (R-01) -> Deployment Zone 1
 * 
 * - POINT ASSET:  ASSET -> POINT ASSET -> DEPLOYMENT ZONE
 *   Example: Samruddhi Mahamarg / Kosi Water Project -> Bridge 27 / Dam 02 -> Deck & Pier Zone
 */
export const ContextSelectorBar: React.FC = () => {
  const {
    selectedAsset,
    selectedRegion,
    selectedPointAsset,
    selectedZone,
    assets,
    regions,
    pointAssets,
    zones,
    setContextFromAsset,
    setContextFromRegion,
    setContextFromPointAsset,
    setContextFromZone
  } = useEngineeringContext();

  const isPointAsset = selectedAsset?.assetNature?.toUpperCase() === 'POINT' || (pointAssets && pointAssets.length > 0);

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assetId = e.target.value;
    setContextFromAsset(assetId);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value;
    setContextFromRegion(regionId);
  };

  const handlePointAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pointAssetId = e.target.value;
    setContextFromPointAsset(pointAssetId);
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zoneId = e.target.value;
    setContextFromZone(zoneId);
  };

  const selectStyle: React.CSSProperties = {
    height: '28px',
    padding: '0 12px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#0F172A',
    background: '#F8FAFC',
    border: '1px solid #CBD5E1',
    borderRadius: '4px',
    outline: 'none',
    cursor: 'pointer'
  };

  return (
    <div style={{
      width: '100%',
      height: '38px',
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px',
      gap: '32px',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* 1. ASSET SELECTOR (Top-Level Assets Only) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>ASSET:</span>
        <select
          value={selectedAsset?.id || (assets[0]?.id || '')}
          onChange={handleAssetChange}
          style={{ ...selectStyle, fontWeight: 700 }}
        >
          {assets.length > 0 ? (
            assets.map((a: any) => (
              <option key={a.id || a.assetCode} value={a.id || a.assetCode}>
                {a.assetCode} — {a.assetName}
              </option>
            ))
          ) : (
            <option value="">Loading Assets...</option>
          )}
        </select>
      </div>

      {/* 2. DYNAMIC SECONDARY SELECTOR: REGION (Linear) vs POINT ASSET (Point) */}
      {isPointAsset ? (
        /* POINT ASSET SELECTOR (Bridge 27, Bridge 41, Dam 02, Pump Station 11, etc.) */
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>POINT ASSET:</span>
          <select
            value={selectedPointAsset?.id || (pointAssets[0]?.id || '')}
            onChange={handlePointAssetChange}
            style={selectStyle}
          >
            {pointAssets.length > 0 ? (
              pointAssets.map((p: any) => (
                <option key={p.id || p.pointAssetCode} value={p.id || p.pointAssetCode}>
                  {p.pointAssetCode} — {p.pointAssetName} ({p.pointAssetType})
                </option>
              ))
            ) : (
              <option value="">No Point Assets Defined</option>
            )}
          </select>
        </div>
      ) : (
        /* REGION SELECTOR (Linear Assets) */
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>REGION:</span>
          <select
            value={selectedRegion?.id || (regions[0]?.id || '')}
            onChange={handleRegionChange}
            style={selectStyle}
          >
            {regions.length > 0 ? (
              regions.map((r: any) => (
                <option key={r.id || r.regionCode} value={r.id || r.regionCode}>
                  {r.regionCode} — {r.regionName}
                </option>
              ))
            ) : (
              <option value="">No Regions for Selected Asset</option>
            )}
          </select>
        </div>
      )}

      {/* 3. DEPLOYMENT ZONE SELECTOR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>ZONE:</span>
        <select
          value={selectedZone?.id || (zones[0]?.id || '')}
          onChange={handleZoneChange}
          style={selectStyle}
        >
          {zones.length > 0 ? (
            zones.map((z: any) => (
              <option key={z.id || z.zoneCode} value={z.id || z.zoneCode}>
                {z.zoneCode} — {z.zoneName}
              </option>
            ))
          ) : (
            <option value="">No Zones Available</option>
          )}
        </select>
      </div>

      {/* 4. LIVE RUNTIME INDICATOR BADGE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        borderRadius: '4px',
        background: '#F0FDF4',
        border: '1px solid #86EFAC',
        color: '#16A34A',
        fontSize: '10px',
        fontWeight: 800,
        fontFamily: 'monospace',
        letterSpacing: '0.04em'
      }}>
        <span>●</span>
        <span>LIVE</span>
      </div>
    </div>
  );
};

