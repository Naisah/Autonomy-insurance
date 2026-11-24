import React, { useState } from 'react';
import { Send, AlertTriangle, CheckCircle2, Paperclip, ArrowUpRight } from 'lucide-react';
import { SidebarLayout } from './SidebarLayout';

export function AgentPortal({
  user,
  manager,
  assignedClients,
  estimates,
  claims,
  chats,
  onSendMessage,
  onEscalateChat,
  onApproveEstimate,
  onUpdateClaimStatus,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [escalateReason, setEscalateReason] = useState('');
  const [showEscalateBox, setShowEscalateBox] = useState(false);

  const pendingEstimates = estimates.filter((e) => e.status === 'Pending Agent Review');
  const openClaims = claims.filter((c) => c.status !== 'Approved' && c.status !== 'Declined');
  const activeChat = chats.find((c) => c.id === selectedChatId) || chats[0];
  const activeChatClient = assignedClients.find((c) => c.id === activeChat?.clientId);

  const navItems = [
    { id: 'dashboard', label: 'Advisor Overview' },
    { id: 'chats', label: 'Client Chats', badge: chats.length },
    { id: 'estimates', label: 'Estimate Reviews', badge: pendingEstimates.length },
    { id: 'claims', label: 'Claims Review', badge: openClaims.length },
    { id: 'clients', label: 'Assigned Roster', badge: assignedClients.length },
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat) return;
    onSendMessage({ chatId: activeChat.id, text: replyText.trim() });
    setReplyText('');
  };

  const handleEscalateSubmit = (e) => {
    e.preventDefault();
    if (!activeChat || !escalateReason.trim()) return;
    onEscalateChat(activeChat.id, escalateReason.trim());
    setEscalateReason('');
    setShowEscalateBox(false);
  };

  const pageMeta = {
    dashboard: { title: 'Advisor Desk', subtitle: `Reports to ${manager?.name || 'Branch Manager'}` },
    chats: { title: 'Client Correspondence', subtitle: 'Private real-time messaging with assigned clients' },
    estimates: { title: 'Estimate Underwriting', subtitle: 'Approve client-computed estimates into active policies' },
    claims: { title: 'Claims Review', subtitle: 'Inspect benefit claims and update review status' },
    clients: { title: 'Assigned Client Roster', subtitle: 'Ownership-scoped clients (Rewards status hidden)' },
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
      {activeTab === 'dashboard' && (
        <div className="split-asymmetric">
          <div style={{ display: 'grid', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, paddingBottom: 20, borderBottom: '1px solid var(--rule-strong)' }}>
              <div>
                <div className="micro-label">Assigned Clients</div>
                <div className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1, color: 'var(--ink)', marginTop: 6 }}>
                  {assignedClients.length}
                </div>
              </div>
              <div>
                <div className="micro-label">Pending Estimates</div>
                <div className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1, color: 'var(--vermilion)', marginTop: 6 }}>
                  {pendingEstimates.length}
                </div>
              </div>
              <div>
                <div className="micro-label">Open Claims</div>
                <div className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1, color: 'var(--gold)', marginTop: 6 }}>
                  {openClaims.length}
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span className="micro-label" style={{ color: 'var(--ink)' }}>Estimates Awaiting Approval</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setActiveTab('estimates')}>
                  All Estimates <ArrowUpRight size={13} />
                </button>
              </div>
              <div className="panel table-wrap">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Plan</th>
                      <th>Monthly</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingEstimates.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ color: 'var(--ink-faint)' }}>No pending estimates in your queue.</td>
                      </tr>
                    ) : (
                      pendingEstimates.map((est) => (
                        <tr key={est.id}>
                          <td style={{ fontWeight: 700 }}>{est.clientName}</td>
                          <td>{est.planName}</td>
                          <td>${est.monthlyPremium.toFixed(2)}</td>
                          <td>
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => onApproveEstimate(est.id)}>
                              Approve Policy
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span className="micro-label" style={{ color: 'var(--ink)' }}>Active Conversations</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setActiveTab('chats')}>
                Open Inbox
              </button>
            </div>
            <div style={{ display: 'grid' }}>
              {chats.map((c) => {
                const cli = assignedClients.find((u) => u.id === c.clientId);
                const lastMsg = c.messages[c.messages.length - 1];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedChatId(c.id);
                      setActiveTab('chats');
                    }}
                    style={{
                      padding: '12px 4px',
                      borderBottom: '1px solid var(--rule)',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <strong style={{ fontSize: '0.88rem' }}>{cli?.name || 'Client'}</strong>
                      {c.escalated && <span className="tag tag-orange">Escalated</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lastMsg?.text}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chats' && (
        <div
          className="panel"
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            height: 'calc(100vh - 165px)',
            minHeight: 460,
            overflow: 'hidden',
          }}
        >
          <div style={{ borderRight: '1px solid var(--rule)', background: 'var(--stone-100)', overflowY: 'auto' }}>
            <div className="micro-label" style={{ padding: '14px 16px', borderBottom: '1px solid var(--rule)' }}>
              Assigned Clients ({chats.length})
            </div>
            {chats.map((c) => {
              const cli = assignedClients.find((u) => u.id === c.clientId);
              const isSelected = activeChat?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedChatId(c.id);
                    setShowEscalateBox(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--rule)',
                    background: isSelected ? 'var(--surface)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--vermilion)' : '3px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{cli?.name}</span>
                    {c.escalated && <span className="tag tag-orange">Escalated</span>}
                  </div>
                  <div className="micro-label" style={{ marginTop: 3 }}>{c.messages.length} messages</div>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {activeChat ? (
              <>
                <div
                  style={{
                    padding: '13px 18px',
                    borderBottom: '1px solid var(--rule)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{activeChatClient?.name}</div>
                    <div className="micro-label">{activeChatClient?.email}</div>
                  </div>
                  {!activeChat.escalated ? (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowEscalateBox((v) => !v)}>
                      <AlertTriangle size={13} /> Escalate to Manager
                    </button>
                  ) : (
                    <span className="tag tag-orange">Escalated to {manager?.name || 'Manager'}</span>
                  )}
                </div>

                {showEscalateBox && (
                  <form
                    onSubmit={handleEscalateSubmit}
                    style={{ padding: 12, background: 'var(--gold-tint)', borderBottom: '1px solid var(--rule)', display: 'flex', gap: 10 }}
                  >
                    <input
                      className="input-field"
                      placeholder="Reason for escalating to manager..."
                      value={escalateReason}
                      onChange={(e) => setEscalateReason(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary btn-sm">Confirm</button>
                  </form>
                )}

                <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {activeChat.messages.map((msg) => {
                    const isMe = msg.senderId === user.id;
                    return (
                      <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                        <div className="micro-label" style={{ marginBottom: 3, textAlign: isMe ? 'right' : 'left' }}>
                          {msg.senderName} · {msg.timestamp}
                        </div>
                        <div
                          style={{
                            padding: '10px 14px',
                            background: isMe ? 'var(--oxblood)' : 'var(--stone-100)',
                            color: isMe ? '#fff' : 'var(--ink)',
                            border: isMe ? 'none' : '1px solid var(--rule)',
                            fontSize: '0.86rem',
                          }}
                        >
                          {msg.text}
                          {msg.attachmentName && (
                            <div className="font-mono" style={{ marginTop: 6, fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Paperclip size={12} /> {msg.attachmentName}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid var(--rule)', display: 'flex', gap: 10 }}>
                  <input
                    className="input-field"
                    placeholder={`Reply to ${activeChatClient?.name || 'client'}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    Send <Send size={14} />
                  </button>
                </form>
              </>
            ) : (
              <div style={{ padding: 28, color: 'var(--ink-faint)' }}>Select a client conversation.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'estimates' && (
        <div className="panel table-wrap">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Plan</th>
                <th>Coverage &amp; Term</th>
                <th>Monthly</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((est) => (
                <tr key={est.id}>
                  <td className="font-mono" style={{ fontSize: '0.76rem' }}>{est.id}</td>
                  <td style={{ fontWeight: 700 }}>{est.clientName}</td>
                  <td>{est.planName}</td>
                  <td>${est.coverageAmount.toLocaleString()} · {est.termYears} yrs</td>
                  <td>${est.monthlyPremium.toFixed(2)}</td>
                  <td>
                    <span className={`tag ${est.status.includes('Approved') ? 'tag-ok' : est.status.includes('Pending') ? 'tag-orange' : 'tag-neutral'}`}>
                      {est.status}
                    </span>
                  </td>
                  <td>
                    {est.status === 'Pending Agent Review' ? (
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => onApproveEstimate(est.id)}>
                        <CheckCircle2 size={13} /> Approve Policy
                      </button>
                    ) : (
                      <span className="micro-label">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'claims' && (
        <div className="panel table-wrap">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Client</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Attachment</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((clm) => (
                <tr key={clm.id}>
                  <td className="font-mono" style={{ fontSize: '0.76rem' }}>{clm.id}</td>
                  <td style={{ fontWeight: 700 }}>{clm.clientName}</td>
                  <td>{clm.claimType}</td>
                  <td>${clm.requestedAmount.toLocaleString()}</td>
                  <td className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--ink-muted)' }}>{clm.attachmentName}</td>
                  <td>
                    <span className={`tag ${clm.status === 'Approved' ? 'tag-ok' : clm.status === 'Declined' ? 'tag-red' : 'tag-orange'}`}>
                      {clm.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="select-field"
                      style={{ padding: '5px 8px', fontSize: '0.8rem', minWidth: 160 }}
                      value={clm.status}
                      onChange={(e) => onUpdateClaimStatus(clm.id, e.target.value)}
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Agent Review">Under Agent Review</option>
                      <option value="Needs Info">Needs Info</option>
                      <option value="Approved">Approved</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'clients' && (
        <div style={{ display: 'grid', gap: 14 }}>
          <div className="panel-gold" style={{ padding: '12px 16px', fontSize: '0.82rem' }}>
            <strong>Privacy Boundary:</strong> Client Rewards app scores and daily step counts are restricted and not visible to advisors.
          </div>
          <div className="panel table-wrap">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assignedClients.map((cli) => (
                  <tr key={cli.id}>
                    <td style={{ fontWeight: 700 }}>{cli.name}</td>
                    <td className="font-mono" style={{ fontSize: '0.78rem' }}>{cli.email}</td>
                    <td>{cli.age || 'N/A'}</td>
                    <td><span className="tag tag-ok">{cli.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
