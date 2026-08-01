import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Cpu } from 'lucide-react';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = (user as any)?.role || (user?.roles && user.roles.length > 0 ? user.roles[0] : 'Lead Engineer');

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '56px',
      padding: '0 20px',
      background: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Cpu size={18} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '15px', color: '#1E293B', letterSpacing: '-0.02em' }}>
            VERIQ Platform
          </span>
        </Link>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>
          Infrastructure Intelligence
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAuthenticated ? (
          <>
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
                <span style={{ color: '#9CA3AF', marginLeft: '6px' }}>• {userRole}</span>
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
