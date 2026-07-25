import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Layers, Activity, ArrowRight, CheckCircle2, Server, Database } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '60px 20px 40px',
        background: 'var(--gradient-glow)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        position: 'relative'
      }}>
        <div className="badge badge-enterprise" style={{ marginBottom: '16px' }}>
          VERIQ 1.0 • Enterprise Engineering Decision Intelligence
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-1px',
          color: '#ffffff',
          marginBottom: '20px'
        }}>
          High-Reliability Decision Intelligence for <br />
          <span style={{
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Complex Engineering Systems
          </span>
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          maxWidth: '780px',
          margin: '0 auto 32px',
          lineHeight: 1.6
        }}>
          VERIQ integrates enterprise organizational structures, deployment topology strategy, physical sensor design, and real-time operational telemetry into unified decision matrices.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link to="/organizations" className="btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
            <span>Launch Organization Module</span>
            <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '16px' }}>
            <span>System Sign In</span>
          </Link>
        </div>
      </section>

      {/* Platform Architecture Highlights */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {[
          { title: 'Layered Architecture', value: '10-Tier Enforced', icon: Layers, desc: 'PostgreSQL to UI' },
          { title: 'Decision Matrix Model', value: 'Asset-Centric', icon: ShieldCheck, desc: 'Linear & Point Asset Workflows' },
          { title: 'Database Connectivity', value: 'PostgreSQL Engine', icon: Server, desc: 'Flyway schema migration' },
          { title: 'Data Governance', value: 'Zero Hardcoded Data', icon: Database, desc: 'Direct database persistence' },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{metric.title}</span>
                <Icon size={20} color="var(--accent-secondary)" />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>{metric.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{metric.desc}</div>
            </div>
          );
        })}
      </section>

      {/* Business & Engineering Modules */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff' }}>Platform Architecture & Modules</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)' }}>
                <ShieldCheck size={24} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>Organization Module</h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Manage top-level enterprise business units, contact details, addresses, and tenant configurations driven strictly by database persistence.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {['PostgreSQL Schema Migration (Flyway)', 'JPA Entity & Spring Repository', 'REST API Controller (/api/v1/organizations)', 'React State & Direct Database CRUD UI'].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="var(--accent-success)" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/organizations" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Open Organization Module
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)' }}>
                <Cpu size={24} color="var(--accent-secondary)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>Asset Management</h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Systematic engineering asset classification into Linear Assets and Point Assets for downstream deployment design.
            </p>
            <div className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-warning)' }}>
              Scheduled for Next Module
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)' }}>
                <Activity size={24} color="var(--accent-success)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>Decision Intelligence</h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Algorithmic decision matrices and automated engineering trade-off simulation engine.
            </p>
            <div className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-warning)' }}>
              Scheduled for Phase 8
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
