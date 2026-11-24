import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Gift,
  Send,
  Calculator,
  Heart,
  ShieldPlus,
  MessageSquare,
  FileText,
  Sparkles,
  FileCheck2,
  CreditCard,
  X,
  Users,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function AuthScreen({ users, onLogin, onRegisterClient }) {
  const [helpTab, setHelpTab] = useState('existing'); // 'existing' | 'new' | 'staff'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('dwyane.client@autonomy.insure');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('');
  const [age, setAge] = useState(29);
  const [error, setError] = useState('');

  const clientDemo = users.find((u) => u.role === 'Client');
  const agentDemo = users.find((u) => u.role === 'Agent');
  const managerDemo = users.find((u) => u.role === 'Manager');
  const adminDemo = users.find((u) => u.role === 'Admin');

  const openLoginModal = (prefillUser) => {
    if (prefillUser) setEmail(prefillUser.email);
    setAuthMode('login');
    setError('');
    setShowAuthModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (authMode === 'login') {
      const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) {
        setError('Account not found. Try a demo account or register as a Client.');
        return;
      }
      onLogin(found);
    } else {
      if (!name.trim() || !email.trim()) {
        setError('Please enter your full name and email.');
        return;
      }
      const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (exists) {
        setError('An account with this email already exists.');
        return;
      }
      onRegisterClient({ name: name.trim(), email: email.trim(), age: Number(age) || 29 });
    }
  };

  const existingTiles = [
    { title: 'Manage your policy online', icon: FileText, action: () => onLogin(clientDemo) },
    { title: 'View payment schedule & Rewards', icon: CreditCard, action: () => onLogin(clientDemo) },
    { title: 'File a benefit claim', icon: FileCheck2, action: () => onLogin(clientDemo) },
    { title: 'Get answers from AI Assistant', icon: Sparkles, action: () => onLogin(clientDemo) },
  ];

  const newTiles = [
    { title: 'Calculate a policy estimate', icon: Calculator, action: () => onLogin(clientDemo) },
    { title: 'Talk to an assigned advisor', icon: MessageSquare, action: () => onLogin(clientDemo) },
    { title: 'Register a new Client account', icon: User, action: () => { setAuthMode('register'); setShowAuthModal(true); } },
    { title: 'Explore Rewards mobile SSO', icon: Gift, action: () => onLogin(clientDemo) },
  ];

  const staffTiles = [
    { title: `Client Portal — ${clientDemo?.name || 'Dwyane'}`, icon: User, action: () => onLogin(clientDemo), gold: false },
    { title: `Agent Desk — ${agentDemo?.name || 'Elena Vance'}`, icon: MessageSquare, action: () => onLogin(agentDemo), gold: true },
    { title: `Manager Portal — ${managerDemo?.name || 'Karla Mendoza'}`, icon: Users, action: () => onLogin(managerDemo), gold: false },
    { title: `Admin Console — ${adminDemo?.name || 'Prof. Sedilla'}`, icon: ShieldPlus, action: () => onLogin(adminDemo), gold: true },
  ];

  const activeTiles = helpTab === 'existing' ? existingTiles : helpTab === 'new' ? newTiles : staffTiles;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', position: 'relative' }}>
      {/* Two-Tier Corporate Header (PRU Life UK style) */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border-light)' }}>
        {/* Top Utility Row */}
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '10px 24px 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <BrandLogo />
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: '0.78rem', color: 'var(--ink-700)' }}>
            <button type="button" onClick={() => onLogin(clientDemo)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Gift size={14} color="#D91E2A" /> Rewards Hub
            </button>
            <button type="button" onClick={() => openLoginModal(clientDemo)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Send size={14} color="#EA580C" /> Contact Us
            </button>
            <button type="button" onClick={() => onLogin(clientDemo)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Calculator size={14} color="#D97706" /> Estimate Online
            </button>
          </div>
        </div>

        {/* Main Navigation Row */}
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '8px 24px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <nav style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: '0.86rem', fontWeight: 500, color: 'var(--ink-900)', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => onLogin(clientDemo)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Products <ChevronDown size={14} />
            </button>
            <button type="button" onClick={() => onLogin(clientDemo)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Services &amp; Claims <ChevronDown size={14} />
            </button>
            <button type="button" onClick={() => onLogin(clientDemo)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              AI Assistant <ChevronDown size={14} />
            </button>
            <button type="button" onClick={() => setHelpTab('staff')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Staff Portals <ChevronDown size={14} />
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={() => openLoginModal(clientDemo)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.86rem',
                fontWeight: 600,
                color: 'var(--ink-900)',
              }}
            >
              <User size={15} color="#D91E2A" /> Log In <ChevronDown size={14} />
            </button>
            <button
              type="button"
              onClick={() => openLoginModal(clientDemo)}
              aria-label="Search or Quick Access"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#FDF0F0',
                color: '#D91E2A',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Search size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Width Dark Lifestyle Hero Banner with Curved Red-Orange-Gold Ribbon */}
      <section
        style={{
          position: 'relative',
          minHeight: 370,
          backgroundColor: '#141110',
          backgroundImage:
            'linear-gradient(90deg, rgba(16,12,12,0.92) 0%, rgba(16,12,12,0.72) 48%, rgba(16,12,12,0.28) 100%), url("https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          color: '#FFFFFF',
          overflow: 'hidden',
          paddingBottom: 70,
        }}
      >
        {/* Signature Curved Red-Orange-Gold Ribbon */}
        <svg
          viewBox="0 0 1440 380"
          fill="none"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <defs>
            <linearGradient id="ribbonGrad" x1="0" y1="300" x2="900" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D91E2A" />
              <stop offset="55%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <path
            d="M-40 245 C 240 365, 580 285, 780 -20"
            stroke="url(#ribbonGrad)"
            strokeWidth="8"
            fill="none"
          />
        </svg>

        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '54px 24px 36px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 2.85rem)', fontWeight: 700, lineHeight: 1.12 }}>
            <span style={{ color: '#EF3340' }}>AUTONOMY</span>{' '}
            <span>Horizon 10</span>{' '}
            <span className="font-italic-serif" style={{ color: '#F59E0B', fontWeight: 500 }}>
              Elite
            </span>
          </h1>
          <p style={{ marginTop: 12, fontSize: '1rem', color: 'rgba(255,255,255,0.88)', maxWidth: 460 }}>
            Your future deserves the right partner to help your family grow.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 26, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onLogin(clientDemo)}
              className="pill-btn"
              style={{ background: '#D91E2A', color: '#FFFFFF' }}
            >
              Estimate Policy
            </button>
            <button
              type="button"
              onClick={() => openLoginModal(clientDemo)}
              className="pill-btn"
              style={{ background: 'transparent', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.75)' }}
            >
              Talk to an Agent
            </button>

            <div style={{ display: 'inline-flex', gap: 8, marginLeft: 12 }}>
              <button
                type="button"
                aria-label="Previous slide"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.45)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.45)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Overlapping Red-Orange-Gold "I am looking to..." Bar */}
      <div style={{ maxWidth: 1060, margin: '-54px auto 0', padding: '0 20px', position: 'relative', zIndex: 5 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.14)',
          }}
        >
          {/* Left Red-Orange Action Strip */}
          <div
            style={{
              background: 'linear-gradient(90deg, #D91E2A 0%, #EA580C 100%)',
              color: '#FFFFFF',
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>I am looking to...</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Protect my\nfamily', icon: Heart, action: () => onLogin(clientDemo) },
                { label: 'Talk to an\nagent', icon: MessageSquare, action: () => onLogin(clientDemo) },
                { label: 'File a\nclaim', icon: ShieldPlus, action: () => onLogin(clientDemo) },
                { label: 'Check my\npolicy', icon: Calculator, action: () => onLogin(clientDemo) },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      lineHeight: 1.25,
                      textAlign: 'center',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    <Icon size={20} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Dark Crimson Help Box */}
          <div
            style={{
              background: '#9E131C',
              color: '#FFFFFF',
              padding: '20px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
              minWidth: 230,
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>Need help with your policy?</div>
            <button
              type="button"
              onClick={() => openLoginModal(clientDemo)}
              className="pill-btn"
              style={{
                background: '#FFFFFF',
                color: '#9E131C',
                padding: '7px 18px',
                fontSize: '0.8rem',
              }}
            >
              <Send size={13} /> Get in touch
            </button>
          </div>
        </div>
      </div>

      {/* "How can we help?" Section */}
      <section style={{ maxWidth: 1060, margin: '44px auto 40px', padding: '0 20px' }}>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 300, color: 'var(--ink-900)', marginBottom: 16 }}>
          How can we <strong style={{ fontWeight: 700 }}>help?</strong>
        </h2>

        <div className="corp-tabs" style={{ marginBottom: 22 }}>
          <button
            type="button"
            className={`corp-tab ${helpTab === 'existing' ? 'active' : ''}`}
            onClick={() => setHelpTab('existing')}
          >
            Existing customers
          </button>
          <button
            type="button"
            className={`corp-tab ${helpTab === 'new' ? 'active' : ''}`}
            onClick={() => setHelpTab('new')}
          >
            New customers
          </button>
          <button
            type="button"
            className={`corp-tab ${helpTab === 'staff' ? 'active' : ''}`}
            onClick={() => setHelpTab('staff')}
          >
            Staff &amp; Role Preview (Client / Agent / Manager / Admin)
          </button>
        </div>

        <div className="grid-4">
          {activeTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.title}
                type="button"
                onClick={tile.action}
                className={`soft-tile ${tile.gold ? 'soft-tile-gold' : ''}`}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--ink-900)', lineHeight: 1.35 }}>
                  {tile.title}
                </span>
                <span className={`soft-icon-circle ${tile.gold ? 'soft-icon-circle-gold' : ''}`} aria-hidden="true">
                  <Icon size={17} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Policy Comparison & Trust Signals (per ui-ux-pro-max Insurance Platform pattern) */}
      <section style={{ background: 'var(--bg-gray)', borderTop: '1px solid var(--border-light)', padding: '44px 20px 84px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 22 }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--ink-900)' }}>
                Compare Protection Plans
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-500)', marginTop: 4 }}>
                Clear, rule-based estimates reviewed by your assigned advisor before activation.
              </p>
            </div>
            <span className="tag tag-gold">One Account · Web &amp; Flutter Mobile SSO</span>
          </div>

          <div className="grid-3">
            {[
              {
                name: 'Autonomy Core 10',
                term: '10-Year Term',
                coverage: '$50,000 – $250,000',
                accent: 'var(--red-primary)',
                note: 'Essential term protection with direct advisor chat & AI support.',
              },
              {
                name: 'Autonomy Shield 15',
                term: '15-Year Term',
                coverage: '$150,000 – $500,000',
                accent: 'var(--orange-primary)',
                note: 'Balanced family coverage eligible for Rewards premium period extensions.',
              },
              {
                name: 'Autonomy Horizon Elite',
                term: '20–30 Year Term',
                coverage: '$250,000 – $1,000,000',
                accent: 'var(--gold-primary)',
                note: 'Comprehensive long-term protection with priority claims & manager escalation.',
              },
            ].map((plan) => (
              <div key={plan.name} className="card" style={{ padding: 22, borderTop: `4px solid ${plan.accent}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
                <div>
                  <span className="tag tag-neutral" style={{ marginBottom: 10 }}>{plan.term}</span>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--ink-900)' }}>{plan.name}</h3>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: plan.accent, marginTop: 6 }}>{plan.coverage}</div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--ink-500)', marginTop: 8, lineHeight: 1.5 }}>{plan.note}</p>
                </div>
                <button type="button" onClick={() => onLogin(clientDemo)} className="btn btn-secondary" style={{ width: '100%' }}>
                  Estimate This Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Bottom-Right "Contact us" Pill */}
      <button
        type="button"
        onClick={() => openLoginModal(clientDemo)}
        className="pill-btn"
        style={{
          position: 'fixed',
          bottom: 22,
          right: 24,
          background: '#6D0D13',
          color: '#FFFFFF',
          boxShadow: '0 6px 20px rgba(0,0,0,0.22)',
          zIndex: 30,
        }}
      >
        <Send size={14} /> Contact us
      </button>

      {/* Login / Register Modal */}
      {showAuthModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17, 24, 39, 0.55)',
            display: 'grid',
            placeItems: 'center',
            padding: 16,
            zIndex: 60,
          }}
        >
          <div className="card" style={{ width: '100%', maxWidth: 440, padding: 24, position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close modal"
              style={{ position: 'absolute', top: 16, right: 16, color: 'var(--ink-500)' }}
            >
              <X size={18} />
            </button>

            <div className="corp-tabs" style={{ marginBottom: 18 }}>
              <button
                type="button"
                className={`corp-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthMode('login'); setError(''); }}
              >
                Log In
              </button>
              <button
                type="button"
                className={`corp-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthMode('register'); setEmail(''); setError(''); }}
              >
                Client Register
              </button>
            </div>

            {error && (
              <div style={{ padding: '8px 12px', background: '#FEE2E2', color: '#991B1B', borderRadius: 6, fontSize: '0.8rem', marginBottom: 12 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
              {authMode === 'register' && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                  <div>
                    <label className="label">Full Name</label>
                    <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Age</label>
                    <input type="number" min={18} max={80} className="input-field" value={age} onChange={(e) => setAge(e.target.value)} required />
                  </div>
                </div>
              )}

              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label className="label">Password</label>
                <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px 18px' }}>
                {authMode === 'login' ? 'Sign In' : 'Create Client Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
