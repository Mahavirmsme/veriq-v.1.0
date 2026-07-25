import React from 'react';
import { Layers } from 'lucide-react';

interface HeroHeaderProps {
  objectType?: string;
  objectName?: string;
  parentObject?: string;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  objectType = 'ASSET',
  objectName = 'Kosi Left Flood Embankment',
  parentObject = 'Kosi Embankment Protection Project'
}) => {
  return (
    <div className="veriq-hero-section" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
      <div className="veriq-hero-section-title">
        <span style={{ color: '#475569', fontWeight: 700 }}>Engineering Object Identity</span>
        <span style={{ fontSize: '10px', color: '#2563EB', fontFamily: 'monospace', fontWeight: 600 }}>
          [ Object Identity Placeholder ]
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
        {/* Left: Icon, Type, Name & Parent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563EB'
          }}>
            <Layers size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '1px 6px', borderRadius: '4px', border: '1px solid #DBEAFE' }}>
                {objectType}
              </span>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Parent: {parentObject}
              </span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '4px 0 0', letterSpacing: '-0.01em' }}>
              {objectName}
            </h1>
          </div>
        </div>

        {/* Right: Current Status & Last Updated */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#475569', fontFamily: 'monospace' }}>
            Status: <span style={{ color: '#2563EB' }}>[ Current Status Placeholder ]</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
            Last Updated: [ Timestamp Placeholder ]
          </div>
        </div>
      </div>
    </div>
  );
};
