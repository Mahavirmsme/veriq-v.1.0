import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: '56px',
      borderBottom: '1px solid #E5E7EB',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShieldCheck size={20} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: '#1F2937', lineHeight: 1.1 }}>VERIQ</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#6B7280', letterSpacing: '0.05em', marginTop: '1px' }}>DECISION PLATFORM</span>
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isAuthenticated ? (
          <>
            <button style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              cursor: 'pointer'
            }}>
              <Bell size={16} />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '6px'
            }}>
              <User size={14} color="#2563EB" />
              <div style={{ fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: '#1F2937' }}>{user?.name || 'Administrator'}</span>
                <span style={{ color: '#9CA3AF', marginLeft: '6px' }}>• {user?.role || 'Lead Engineer'}</span>
              </div>
            </div>

            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary" style={{ fontSize: '13px', padding: '6px 14px' }}>
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
