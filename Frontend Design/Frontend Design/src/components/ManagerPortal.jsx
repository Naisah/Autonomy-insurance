import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { SidebarLayout } from './SidebarLayout';

export function ManagerPortal({
  user,
  teamAgents,
  teamClients,
  escalatedChats,
  policies,
  onReassignClient,
  onSendMessage,
  onResolveEscalation,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [replyMap, setReplyMap] = useState({});

  const navItems = [
    { id: 'dashboard', label: 'Team Overview' },
    { id: 'team', label: 'Client Reassignment', badge: teamClients.length },
    { id: 'escalations', label: 'Escalated Chats', badge: escalatedChats.length },
  ];

  const pageMeta = {
    dashboard: { title: 'Branch Oversight', subtitle: 'Team performance and active escalation volume' },
    team: { title: 'Client Reassignment', subtitle: 'Rebalance client ownership across advisors in your branch' },
    escalations: { title: 'Escalated Chats Only', subtitle: 'Private advisor-client chats remain hidden unless escalated' },
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
        <div style={{ display: 'grid', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18, paddingBottom: 20, borderBottom: '1px solid var(--rule-strong)' }}>
            <div>
              <div className="micro-label">Team Advisors</div>
              <div className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1, marginTop: 6 }}>{teamAgents.length}</div>
            </div>
            <div>
              <div className="micro-label">Branch Clients</div>
              <div className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1, marginTop: 6 }}>{teamClients.length}</div>
            </div>
            <div>
              <div className="micro-label">Active Policies</div>
              <div className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1, color: 'var(--gold)', marginTop: 6 }}>{policies.length}</div>
            </div>
            <div>
              <div className="micro-label">Open Escalations</div>
              <div className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1, color: 'var(--vermilion)', marginTop: 6 }}>{escalatedChats.length}</div>
            </div>
          </div>

          <div className="panel table-wrap">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Advisor</th>
                  <th>Role Title</th>
                  <th>Assigned Clients</th>
                  <th>Active Policies</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teamAgents.map((agt) => (
                  <tr key={agt.id}>
                    <td style={{ fontWeight: 700 }}>{agt.name}</td>
                    <td>{agt.title}</td>
                    <td>{teamClients.filter((c) => c.reportsTo === agt.id).length}</td>
                    <td>{policies.filter((p) => p.agentId === agt.id).length}</td>
                    <td><span className="tag tag-ok">{agt.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="panel table-wrap">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Current Advisor</th>
                <th>Reassign Within Branch</th>
              </tr>
            </thead>
            <tbody>
              {teamClients.map((cli) => {
                const currentAgent = teamAgents.find((a) => a.id === cli.reportsTo);
                return (
                  <tr key={cli.id}>
                    <td style={{ fontWeight: 700 }}>{cli.name}</td>
                    <td className="font-mono" style={{ fontSize: '0.78rem' }}>{cli.email}</td>
                    <td><span className="tag tag-gold">{currentAgent?.name || 'Unassigned'}</span></td>
                    <td>
                      <select
                        className="select-field"
                        style={{ maxWidth: 230, padding: '6px 10px' }}
                        value={cli.reportsTo || ''}
                        onChange={(e) => onReassignClient(cli.id, e.target.value)}
                      >
                        {teamAgents.map((agt) => (
                          <option key={agt.id} value={agt.id}>{agt.name}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'escalations' && (
        <div style={{ display: 'grid', gap: 18 }}>
          {escalatedChats.length === 0 ? (
            <div className="panel" style={{ padding: 36, textAlign: 'center', color: 'var(--ink-faint)' }}>
              No active escalated conversations in your branch.
            </div>
          ) : (
            escalatedChats.map((chat) => {
              const cli = teamClients.find((c) => c.id === chat.clientId);
              const agt = teamAgents.find((a) => a.id === chat.agentId);
              const draft = replyMap[chat.id] || '';
              return (
                <div key={chat.id} className="panel" style={{ padding: 22 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--rule)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h3 className="font-display" style={{ fontSize: '1.5rem' }}>
                          {cli?.name || 'Client'} ↔ {agt?.name || 'Advisor'}
                        </h3>
                        <span className="tag tag-orange">Escalated</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--crimson)', marginTop: 4, fontWeight: 600 }}>
                        Reason: {chat.escalationReason}
                      </div>
                    </div>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => onResolveEscalation(chat.id)}>
                      <CheckCircle2 size={14} /> Mark Resolved
                    </button>
                  </div>

                  <div style={{ background: 'var(--stone-100)', padding: 14, display: 'grid', gap: 8, marginBottom: 14, maxHeight: 240, overflowY: 'auto' }}>
                    {chat.messages.map((m) => (
                      <div key={m.id} style={{ fontSize: '0.85rem' }}>
                        <strong style={{ color: 'var(--oxblood)' }}>{m.senderName} ({m.senderRole}):</strong> {m.text}
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!draft.trim()) return;
                      onSendMessage({ chatId: chat.id, text: draft.trim() });
                      setReplyMap((prev) => ({ ...prev, [chat.id]: '' }));
                    }}
                    style={{ display: 'flex', gap: 10 }}
                  >
                    <input
                      className="input-field"
                      placeholder="Post manager guidance into this escalated thread..."
                      value={draft}
                      onChange={(e) => setReplyMap((prev) => ({ ...prev, [chat.id]: e.target.value }))}
                    />
                    <button type="submit" className="btn btn-primary">
                      Respond <Send size={14} />
                    </button>
                  </form>
                </div>
              );
            })
          )}
        </div>
      )}
    </SidebarLayout>
  );
}
