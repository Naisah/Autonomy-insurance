import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function SidebarLayout({ user, navItems, activeTab, onSelectTab, onLogout, pageTitle, pageSubtitle, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleTagClass =
    user.role === 'Admin'
      ? 'tag-red'
      : user.role === 'Manager'
      ? 'tag-orange'
      : user.role === 'Agent'
      ? 'tag-gold'
      : 'tag-ok';

  return (
    <div className="app-shell">
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17, 24, 39, 0.45)',
            zIndex: 40,
          }}
        />
      )}

      <aside className={`rail ${mobileOpen ? 'open' : ''}`}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 14,
            marginBottom: 14,
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <BrandLogo />
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '10px 12px', background: 'var(--bg-soft)', borderRadius: 8, marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--ink-900)' }}>{user.name}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--ink-500)', marginTop: 2 }}>{user.title}</div>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`rail-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileOpen(false);
                }}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '1px 7px',
                      borderRadius: 999,
                      background: isActive ? 'rgba(255,255,255,0.22)' : '#FEF3C7',
                      color: isActive ? '#fff' : '#B45309',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
          <button
            type="button"
            onClick={onLogout}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="masthead">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={16} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink-900)' }}>{pageTitle}</h1>
              {pageSubtitle && <p style={{ fontSize: '0.78rem', color: 'var(--ink-500)' }}>{pageSubtitle}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`tag ${roleTagClass}`}>{user.role}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--ink-500)' }}>{user.email}</span>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
