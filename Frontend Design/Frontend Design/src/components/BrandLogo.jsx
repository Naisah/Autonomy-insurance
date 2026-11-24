import React from 'react';

export function BrandLogo() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="corpLogoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D91E2A" />
            <stop offset="55%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="15" fill="url(#corpLogoGrad)" />
        <path
          d="M11 21.5L16 9.5L21 21.5M12.8 18H19.2"
          stroke="#FFFFFF"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.02em', color: '#D91E2A' }}>
          AUTONOMY
        </span>
        <span style={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', color: '#D97706' }}>
          INSURANCES
        </span>
      </div>
    </div>
  );
}
