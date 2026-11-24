import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Plus,
  Minus,
} from 'lucide-react';
import { SidebarLayout } from './SidebarLayout';
import { calculatePolicyEstimate } from '../utils/premiumCalculator';
import { AI_KNOWLEDGE_BASE } from '../data/mockData';

export function ClientPortal({
  user,
  assignedAgent,
  estimates,
  policies,
  claims,
  chat,
  policySettings,
  onSendMessage,
  onCreateEstimate,
  onSubmitClaim,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('overview');

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [handoffBanner, setHandoffBanner] = useState('');

  // Estimator state
  const [planName, setPlanName] = useState('Autonomy Horizon Term');
  const [age, setAge] = useState(user.age || 29);
  const [coverageAmount, setCoverageAmount] = useState(250000);
  const [termYears, setTermYears] = useState(20);
  const [healthTier, setHealthTier] = useState('Preferred');
  const [smoker, setSmoker] = useState(false);
  const [frequency, setFrequency] = useState('Monthly');
  const [estimateNotice, setEstimateNotice] = useState('');

  // Claim form state
  const [claimPolicyId, setClaimPolicyId] = useState(policies[0]?.id || '');
  const [claimType, setClaimType] = useState('Hospitalization Benefit Rider');
  const [incidentDate, setIncidentDate] = useState('2026-11-20');
  const [requestedAmount, setRequestedAmount] = useState(1200);
  const [claimDesc, setClaimDesc] = useState('');
  const [claimAttachment, setClaimAttachment] = useState('');
  const [claimNotice, setClaimNotice] = useState('');

  // AI Chatbot state
  const [aiMessages, setAiMessages] = useState([
    {
      id: 'ai-0',
      sender: 'bot',
      text: `Hello ${user.name.split(' ')[0]}. I answer general questions on policy estimates, Rewards premium extensions, and filing claims. For personal advice, hand off directly to ${assignedAgent?.name || 'your advisor'}.`,
      category: 'Orientation',
    },
  ]);
  const [aiInput, setAiInput] = useState('');

  const liveCalc = calculatePolicyEstimate({
    age,
    coverageAmount,
    termYears,
    healthTier,
    smoker,
    frequency,
    settings: policySettings,
  });

  const totalCoverage = policies.reduce((sum, p) => sum + p.coverageAmount, 0);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'chat', label: 'Chat with Agent', badge: chat?.messages?.length || 0 },
    { id: 'estimator', label: 'Policy Estimator' },
    { id: 'policies', label: 'Policies & Schedule', badge: policies.length },
    { id: 'claims', label: 'Claims Ledger', badge: claims.length },
    { id: 'ai', label: 'AI Assistant' },
  ];

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim() && !attachmentName) return;
    onSendMessage({
      chatId: chat.id,
      text: chatInput.trim(),
      attachmentName: attachmentName || undefined,
    });
    setChatInput('');
    setAttachmentName('');
    setHandoffBanner('');
  };

  const handleSaveEstimate = (submitForReview) => {
    onCreateEstimate({
      planName,
      age,
      coverageAmount,
      termYears,
      healthTier,
      smoker,
      frequency,
      monthlyPremium: liveCalc.monthlyPremium,
      annualPremium: liveCalc.annualPremium,
      status: submitForReview ? 'Pending Agent Review' : 'Draft',
    });
    setEstimateNotice(
      submitForReview
        ? `Submitted to ${assignedAgent?.name || 'your advisor'} for policy approval.`
        : 'Saved to your estimates ledger as Draft.'
    );
    setTimeout(() => setEstimateNotice(''), 4000);
  };

  const handleFileClaim = (e) => {
    e.preventDefault();
    if (!claimPolicyId || !claimDesc.trim()) return;
    onSubmitClaim({
      policyId: claimPolicyId,
      claimType,
      incidentDate,
      requestedAmount: Number(requestedAmount) || 500,
      description: claimDesc.trim(),
      attachmentName: claimAttachment || 'supporting_document.pdf',
    });
    setClaimDesc('');
    setClaimAttachment('');
    setClaimNotice('Claim recorded and routed to your assigned advisor.');
    setTimeout(() => setClaimNotice(''), 4000);
  };

  const handleAskAI = (questionText) => {
    const query = (questionText ?? aiInput).trim();
    if (!query) return;
    const lower = query.toLowerCase();
    const match = AI_KNOWLEDGE_BASE.find((entry) => entry.keywords.some((kw) => lower.includes(kw)));

    const botReply = match
      ? { text: match.answer, category: match.category }
      : {
          text: `Regarding "${query}", I cover general policy, estimate, and claim guidelines. ${
            assignedAgent?.name || 'Your assigned advisor'
          } can provide tailored recommendations—use "Hand off to Advisor" above to transfer this context.`,
          category: 'General Guidance',
        };

    setAiMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: query },
      { id: `b-${Date.now() + 1}`, sender: 'bot', text: botReply.text, category: botReply.category },
    ]);
    setAiInput('');
  };

  const handleHandoffToAgent = () => {
    const lastUserQ = [...aiMessages].reverse().find((m) => m.sender === 'user')?.text;
    const summary = lastUserQ
      ? `[AI Handoff] I was asking the AI Assistant about: "${lastUserQ}" — could you help me with this?`
      : '[AI Handoff] Hello, I would like to discuss my policy options directly.';
    setChatInput(summary);
    setHandoffBanner('Context transferred from AI Assistant. Review and send to your advisor.');
    setActiveTab('chat');
  };

  const pageMeta = {
    overview: { title: 'Client Dossier', subtitle: `Policyholder summary for ${user.name}` },
    chat: { title: 'Advisor Correspondence', subtitle: `Private real-time channel with ${assignedAgent?.name || 'Assigned Advisor'}` },
    estimator: { title: 'Policy Estimator', subtitle: 'Model coverage terms and submit for advisor approval' },
    policies: { title: 'Policies & Schedule', subtitle: 'Active life contracts and simulated installment ledger' },
    claims: { title: 'Claims Ledger', subtitle: 'Submit benefit claims and monitor review status' },
    ai: { title: 'AI Policy Assistant', subtitle: 'Pre-purchase, in-policy, and claims guidance' },
  }[activeTab];

  return (
    <SidebarLayout
      user={user}
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onLogout={onLogout}
      pageTitle={pageMeta.title}
      pageSubtitle={pageMeta.subtitle}
    >
      {/* 01 OVERVIEW — Asymmetric Editorial Spread */}
      {activeTab === 'overview' && (
        <div className="split-asymmetric">
          {/* Left 60%: Primary Figures & Ledgers */}
          <div style={{ display: 'grid', gap: 28 }}>
            <div style={{ borderBottom: '1px solid var(--rule-strong)', paddingBottom: 22 }}>
              <div className="micro-label" style={{ color: 'var(--vermilion)' }}>
                Total Active Life Coverage
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, flexWrap: 'wrap', marginTop: 6 }}>
                <div className="font-display" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.1rem)', lineHeight: 0.95, color: 'var(--ink)' }}>
                  ${totalCoverage.toLocaleString()}
                </div>
                <span className="tag tag-ok">{policies.length} Active Contract</span>
              </div>
              <div style={{ display: 'flex', gap: 28, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--rule)' }}>
                <div>
                  <div className="micro-label">Saved Estimates</div>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem', marginTop: 2 }}>{estimates.length}</div>
                </div>
                <div>
                  <div className="micro-label">Pending Review</div>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--vermilion)', marginTop: 2 }}>
                    {estimates.filter((e) => e.status === 'Pending Agent Review').length}
                  </div>
                </div>
                <div>
                  <div className="micro-label">Open Claims</div>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem', marginTop: 2 }}>{claims.length}</div>
                </div>
              </div>
            </div>

            {/* Recent Estimates Ledger */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span className="micro-label" style={{ color: 'var(--ink)' }}>Recent Policy Estimates</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setActiveTab('estimator')}>
                  New Estimate <ArrowUpRight size={13} />
                </button>
              </div>
              <div className="table-wrap">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Plan</th>
                      <th>Benefit</th>
                      <th>Monthly</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimates.slice(0, 4).map((est) => (
                      <tr key={est.id}>
                        <td className="font-mono" style={{ fontSize: '0.76rem' }}>{est.id}</td>
                        <td style={{ fontWeight: 600 }}>{est.planName}</td>
                        <td>${est.coverageAmount.toLocaleString()}</td>
                        <td>${est.monthlyPremium.toFixed(2)}</td>
                        <td>
                          <span
                            className={`tag ${
                              est.status.includes('Approved')
                                ? 'tag-ok'
                                : est.status.includes('Pending')
                                ? 'tag-orange'
                                : 'tag-neutral'
                            }`}
                          >
                            {est.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right 40%: Oxblood Advisor Dossier + Gold Rewards Strip */}
          <div style={{ display: 'grid', gap: 18 }}>
            <div className="panel-dark" style={{ padding: 24 }}>
              <div className="micro-label" style={{ color: 'var(--gold-bright)' }}>Assigned Life Advisor</div>
              <div className="font-display" style={{ fontSize: '2rem', lineHeight: 1.05, marginTop: 8 }}>
                {assignedAgent?.name || 'Elena Vance'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(246, 241, 235, 0.72)', marginTop: 4 }}>
                {assignedAgent?.title || 'Senior Life Advisor'} · {assignedAgent?.email}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'rgba(246, 241, 235, 0.78)', marginTop: 14, lineHeight: 1.55 }}>
                Your advisor reviews every submitted policy estimate before activation and handles benefit claims in real time.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className="btn"
                style={{
                  marginTop: 18,
                  width: '100%',
                  background: 'var(--gold-bright)',
                  color: '#1A1614',
                  justifyContent: 'space-between',
                }}
              >
                <span>Open Correspondence</span>
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="panel-gold" style={{ padding: 20 }}>
              <div className="micro-label" style={{ color: '#825A0E' }}>Mobile Rewards SSO Sync</div>
              <div className="font-display" style={{ fontSize: '1.55rem', color: 'var(--ink)', marginTop: 4 }}>
                +9 Days Collection Extension
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: 6, lineHeight: 1.5 }}>
                Step-based health scores from the Flutter Rewards app extend your premium due window. Agents cannot view your private Rewards status.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: 12 }}
                onClick={() => setActiveTab('policies')}
              >
                Inspect Payment Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 02 CHAT WITH AGENT */}
      {activeTab === 'chat' && (
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 165px)', minHeight: 460 }}>
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--rule)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--stone-100)',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>{assignedAgent?.name || 'Elena Vance'}</div>
              <div className="micro-label" style={{ color: 'var(--ok-ink)', marginTop: 2 }}>
                Direct Private Channel · Online
              </div>
            </div>
            {chat?.escalated && <span className="tag tag-orange">Escalated to Manager</span>}
          </div>

          {handoffBanner && (
            <div
              style={{
                padding: '9px 20px',
                background: 'var(--gold-tint)',
                borderBottom: '1px solid rgba(194,139,34,0.3)',
                color: '#825A0E',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {handoffBanner}
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(chat?.messages || []).map((msg) => {
              const isMe = msg.senderId === user.id;
              return (
                <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '72%' }}>
                  <div className="micro-label" style={{ marginBottom: 4, textAlign: isMe ? 'right' : 'left' }}>
                    {msg.senderName} · {msg.timestamp}
                  </div>
                  <div
                    style={{
                      padding: '11px 15px',
                      background: isMe ? 'var(--oxblood)' : 'var(--stone-100)',
                      color: isMe ? 'var(--stone-100)' : 'var(--ink)',
                      border: isMe ? 'none' : '1px solid var(--rule)',
                      fontSize: '0.88rem',
                      lineHeight: 1.55,
                    }}
                  >
                    {msg.text}
                    {msg.attachmentName && (
                      <div
                        className="font-mono"
                        style={{
                          marginTop: 8,
                          fontSize: '0.72rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          opacity: 0.85,
                        }}
                      >
                        <Paperclip size={12} /> {msg.attachmentName}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleChatSend}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--rule)',
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              background: '#fff',
            }}
          >
            <label className="btn btn-secondary btn-sm" title="Attach file" style={{ cursor: 'pointer' }}>
              <Paperclip size={14} />
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || '')}
              />
            </label>
            <input
              className="input-field"
              placeholder={attachmentName ? `Attached: ${attachmentName} — add message...` : 'Write to your assigned advisor...'}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Send <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* 03 POLICY ESTIMATOR */}
      {activeTab === 'estimator' && (
        <div style={{ display: 'grid', gap: 26 }}>
          {estimateNotice && (
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--ok-bg)',
                color: 'var(--ok-ink)',
                fontWeight: 600,
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <CheckCircle2 size={15} /> {estimateNotice}
            </div>
          )}

          <div className="split-asymmetric">
            {/* Controls */}
            <div className="panel" style={{ padding: 24, display: 'grid', gap: 20 }}>
              <div>
                <label className="label">Policy Plan</label>
                <select className="select-field" value={planName} onChange={(e) => setPlanName(e.target.value)}>
                  <option>Autonomy Horizon Term</option>
                  <option>Autonomy Shield 15</option>
                  <option>Autonomy Legacy 30</option>
                  <option>Autonomy Core 10</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--rule)' }}>
                <label className="label" style={{ marginBottom: 0 }}>Applicant Age</label>
                <div className="stepper">
                  <button type="button" className="stepper-btn" onClick={() => setAge((a) => Math.max(18, a - 1))}>
                    <Minus size={13} />
                  </button>
                  <span className="stepper-val">{age}</span>
                  <button type="button" className="stepper-btn" onClick={() => setAge((a) => Math.min(70, a + 1))}>
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label className="label" style={{ marginBottom: 0 }}>Coverage Benefit</label>
                  <span className="font-mono" style={{ fontWeight: 600, color: 'var(--vermilion)' }}>
                    ${coverageAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={policySettings.minCoverage}
                  max={policySettings.maxCoverage}
                  step={25000}
                  value={coverageAmount}
                  onChange={(e) => setCoverageAmount(Number(e.target.value))}
                  className="editorial-slider"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label className="label" style={{ marginBottom: 0 }}>Term Duration</label>
                  <span className="font-mono" style={{ fontWeight: 600, color: 'var(--ink)' }}>{termYears} Years</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={30}
                  step={5}
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="editorial-slider"
                />
              </div>

              <div>
                <label className="label">Health Tier</label>
                <div className="seg-group">
                  {['Preferred', 'Select', 'Standard'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      className={`seg-btn ${healthTier === tier ? 'active' : ''}`}
                      onClick={() => setHealthTier(tier)}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Billing Frequency</label>
                <div className="seg-group">
                  {['Monthly', 'Quarterly', 'Annual'].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      className={`seg-btn ${frequency === freq ? 'active' : ''}`}
                      onClick={() => setFrequency(freq)}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.84rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={smoker} onChange={(e) => setSmoker(e.target.checked)} />
                <span>Apply tobacco / smoker underwriting multiplier</span>
              </label>
            </div>

            {/* Oxblood Quote Sheet */}
            <div className="panel-dark" style={{ padding: 26, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="micro-label" style={{ color: 'var(--gold-bright)' }}>
                  Computed {frequency} Premium
                </div>
                <div className="font-display" style={{ fontSize: '3.6rem', lineHeight: 0.95, color: '#fff', marginTop: 8 }}>
                  ${liveCalc.billedAmount.toFixed(2)}
                </div>
                <div className="font-mono" style={{ fontSize: '0.74rem', color: 'rgba(246, 241, 235, 0.7)', marginTop: 8 }}>
                  MONTHLY EQ: ${liveCalc.monthlyPremium.toFixed(2)} · ANNUAL EQ: ${liveCalc.annualPremium.toFixed(2)}
                </div>

                <div style={{ marginTop: 24, borderTop: '1px solid rgba(246,241,235,0.2)', paddingTop: 16, display: 'grid', gap: 10, fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(246,241,235,0.68)' }}>Benefit Amount</span>
                    <strong>${coverageAmount.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(246,241,235,0.68)' }}>Term</span>
                    <strong>{termYears} Years</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(246,241,235,0.68)' }}>Underwriting Tier</span>
                    <strong>{healthTier}{smoker ? ' (Smoker)' : ''}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(246,241,235,0.68)' }}>Rewards Grace</span>
                    <strong style={{ color: 'var(--gold-bright)' }}>Up to +{policySettings.rewardMaxExtensionDays} days</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 28 }}>
                <button
                  type="button"
                  onClick={() => handleSaveEstimate(false)}
                  className="btn"
                  style={{ border: '1px solid rgba(246,241,235,0.35)', color: '#fff' }}
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveEstimate(true)}
                  className="btn"
                  style={{ background: 'var(--gold-bright)', color: '#1A1614' }}
                >
                  Submit to Advisor
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="micro-label" style={{ color: 'var(--ink)', marginBottom: 10 }}>Saved Estimates Ledger</div>
            <div className="table-wrap panel">
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th>Estimate ID</th>
                    <th>Plan</th>
                    <th>Coverage</th>
                    <th>Term</th>
                    <th>Monthly</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {estimates.map((est) => (
                    <tr key={est.id}>
                      <td className="font-mono" style={{ fontSize: '0.78rem' }}>{est.id}</td>
                      <td style={{ fontWeight: 600 }}>{est.planName}</td>
                      <td>${est.coverageAmount.toLocaleString()}</td>
                      <td>{est.termYears} yrs</td>
                      <td>${est.monthlyPremium.toFixed(2)}</td>
                      <td>
                        <span
                          className={`tag ${
                            est.status.includes('Approved')
                              ? 'tag-ok'
                              : est.status.includes('Pending')
                              ? 'tag-orange'
                              : 'tag-neutral'
                          }`}
                        >
                          {est.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 04 POLICIES & SCHEDULE */}
      {activeTab === 'policies' && (
        <div style={{ display: 'grid', gap: 22 }}>
          {policies.map((pol) => (
            <div key={pol.id} className="panel" style={{ padding: 24 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingBottom: 16,
                  marginBottom: 18,
                  borderBottom: '1px solid var(--rule)',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h2 className="font-display" style={{ fontSize: '1.65rem' }}>{pol.planName}</h2>
                    <span className="tag tag-ok">{pol.status}</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--ink-faint)', marginTop: 4 }}>
                    CONTRACT #{pol.id} · EFFECTIVE {pol.startDate}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="micro-label">Coverage Benefit</div>
                  <div className="font-display" style={{ fontSize: '1.9rem', color: 'var(--vermilion)' }}>
                    ${pol.coverageAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="table-wrap">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th>Installment</th>
                      <th>Due Date</th>
                      <th>Simulated Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pol.schedule.map((row) => (
                      <tr key={row.installment}>
                        <td style={{ fontWeight: 600 }}>{row.installment}</td>
                        <td className="font-mono" style={{ fontSize: '0.78rem' }}>{row.dueDate}</td>
                        <td>${row.amount.toFixed(2)}</td>
                        <td>
                          <span
                            className={`tag ${
                              row.status.includes('Paid')
                                ? 'tag-ok'
                                : row.status.includes('Extended')
                                ? 'tag-gold'
                                : 'tag-neutral'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 05 CLAIMS LEDGER */}
      {activeTab === 'claims' && (
        <div className="split-asymmetric">
          <div className="panel" style={{ padding: 24 }}>
            <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: 14 }}>File Benefit Claim</h2>
            {claimNotice && (
              <div style={{ padding: '9px 12px', background: 'var(--ok-bg)', color: 'var(--ok-ink)', fontSize: '0.82rem', fontWeight: 600, marginBottom: 14 }}>
                {claimNotice}
              </div>
            )}
            <form onSubmit={handleFileClaim} style={{ display: 'grid', gap: 14 }}>
              <div>
                <label className="label">Policy Contract</label>
                <select className="select-field" value={claimPolicyId} onChange={(e) => setClaimPolicyId(e.target.value)}>
                  {policies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.planName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid-2" style={{ gap: 12 }}>
                <div>
                  <label className="label">Claim Type</label>
                  <select className="select-field" value={claimType} onChange={(e) => setClaimType(e.target.value)}>
                    <option>Hospitalization Benefit Rider</option>
                    <option>Diagnostic Wellness Benefit</option>
                    <option>Accidental Injury Benefit</option>
                  </select>
                </div>
                <div>
                  <label className="label">Incident Date</label>
                  <input type="date" className="input-field" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Requested Amount ($)</label>
                <input
                  type="number"
                  min={100}
                  className="input-field"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Incident Summary</label>
                <textarea
                  rows={3}
                  className="textarea-field"
                  placeholder="Describe the medical event or benefit claim..."
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Supporting Document</label>
                <input
                  type="file"
                  className="input-field"
                  onChange={(e) => setClaimAttachment(e.target.files?.[0]?.name || '')}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Claim to Advisor
              </button>
            </form>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <div className="micro-label" style={{ color: 'var(--ink)' }}>Submitted Claims</div>
            {claims.map((clm) => (
              <div key={clm.id} className="panel" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className="font-mono" style={{ fontSize: '0.76rem', color: 'var(--vermilion)' }}>
                    {clm.id} · {clm.policyId}
                  </span>
                  <span
                    className={`tag ${
                      clm.status === 'Approved'
                        ? 'tag-ok'
                        : clm.status === 'Declined'
                        ? 'tag-red'
                        : 'tag-orange'
                    }`}
                  >
                    {clm.status}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{clm.claimType}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', marginTop: 4 }}>{clm.description}</div>
                <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-faint)', marginTop: 10 }}>
                  AMOUNT: ${clm.requestedAmount.toLocaleString()} · FILED {clm.submittedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 06 AI ASSISTANT */}
      {activeTab === 'ai' && (
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 165px)', minHeight: 460 }}>
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--rule)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              background: 'var(--stone-100)',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>Autonomy AI Policy Assistant</div>
              <div className="micro-label" style={{ marginTop: 2 }}>Pre-purchase, in-policy &amp; claims knowledge base</div>
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleHandoffToAgent}>
              Hand off to Advisor <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--rule)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              'How do policy estimates work?',
              'How do Rewards extend my premium?',
              'How do I file a claim?',
            ].map((prompt) => (
              <button key={prompt} type="button" className="btn btn-secondary btn-sm" onClick={() => handleAskAI(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {aiMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '76%' }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      background: isUser ? 'var(--oxblood)' : 'var(--stone-100)',
                      color: isUser ? '#fff' : 'var(--ink)',
                      border: isUser ? 'none' : '1px solid var(--rule)',
                      fontSize: '0.88rem',
                      lineHeight: 1.55,
                    }}
                  >
                    {!isUser && msg.category && (
                      <div style={{ marginBottom: 6 }}>
                        <span className="tag tag-gold">{msg.category}</span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAI();
            }}
            style={{ padding: '12px 16px', borderTop: '1px solid var(--rule)', display: 'flex', gap: 10 }}
          >
            <input
              className="input-field"
              placeholder="Ask a question about life policies, estimates, or claims..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />
            <button type="submit" className="btn btn-gold">
              Ask AI
            </button>
          </form>
        </div>
      )}
    </SidebarLayout>
  );
}
