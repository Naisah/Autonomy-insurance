import React, { useState } from 'react';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import { SidebarLayout } from './SidebarLayout';

export function AdminPortal({
  user,
  users,
  policies,
  estimates,
  claims,
  policySettings,
  onCreateStaffAccount,
  onAssignAgentToManager,
  onUpdatePolicySettings,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Agent');
  const [newReportsTo, setNewReportsTo] = useState(users.find((u) => u.role === 'Manager')?.id || '');
  const [notice, setNotice] = useState('');
  const [settingsDraft, setSettingsDraft] = useState(policySettings);

  const managers = users.filter((u) => u.role === 'Manager');
  const agents = users.filter((u) => u.role === 'Agent');
  const clients = users.filter((u) => u.role === 'Client');

  const navItems = [
    { id: 'dashboard', label: 'System Reports' },
    { id: 'accounts', label: 'Accounts & Hierarchy', badge: users.length },
    { id: 'settings', label: 'Policy Settings' },
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    onCreateStaffAccount({
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      reportsTo: newRole === 'Manager' ? user.id : newReportsTo,
    });
    setNewName('');
    setNewEmail('');
    setNotice(`${newRole} account created.`);
    setTimeout(() => setNotice(''), 3500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdatePolicySettings(settingsDraft);
    setNotice('Policy estimator & reward extension settings updated.');
    setTimeout(() => setNotice(''), 3500);
  };

  const pageMeta = {
    dashboard: { title: 'System Reports', subtitle: 'Organization-wide metrics (Chat content restricted)' },
    accounts: { title: 'Accounts & Hierarchy', subtitle: 'Create Manager/Agent accounts and assign reports_to chain' },
    settings: { title: 'Policy Settings', subtitle: 'Configure estimator rates and reward extension limits' },
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
      {notice && (
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--ok-bg)',
            color: 'var(--ok-ink)',
            fontWeight: 600,
            fontSize: '0.84rem',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <CheckCircle2 size={15} /> {notice}
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18, paddingBottom: 20, borderBottom: '1px solid var(--rule-strong)' }}>
            <div>
              <div className="micro-label">Total Accounts</div>
              <div className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1, marginTop: 6 }}>{users.length}</div>
              <div className="micro-label" style={{ marginTop: 6 }}>
                {managers.length} Mgr · {agents.length} Agt · {clients.length} Cli
              </div>
            </div>
            <div>
              <div className="micro-label">Active Policies</div>
              <div className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1, color: 'var(--vermilion)', marginTop: 6 }}>{policies.length}</div>
            </div>
            <div>
              <div className="micro-label">Policy Estimates</div>
              <div className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1, color: 'var(--gold)', marginTop: 6 }}>{estimates.length}</div>
            </div>
            <div>
              <div className="micro-label">System Claims</div>
              <div className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1, marginTop: 6 }}>{claims.length}</div>
            </div>
          </div>

          <div className="panel-gold" style={{ padding: '16px 20px', fontSize: '0.84rem' }}>
            <strong>Privacy &amp; Access Boundary:</strong> Admin accounts manage roles, hierarchy, and system-wide policy parameters—private Client ↔ Advisor chat contents are never exposed here.
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div style={{ display: 'grid', gap: 24 }}>
          <div className="panel" style={{ padding: 22 }}>
            <h2 className="font-display" style={{ fontSize: '1.5rem', marginBottom: 14 }}>Create Manager or Agent Account</h2>
            <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, alignItems: 'end' }}>
              <div>
                <label className="label">Full Name</label>
                <input className="input-field" placeholder="Rafael Gomez" value={newName} onChange={(e) => setNewName(e.target.value)} required />
              </div>
              <div>
                <label className="label">Work Email</label>
                <input type="email" className="input-field" placeholder="rafael@autonomy.insure" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="select-field" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                  <option value="Agent">Agent</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              {newRole === 'Agent' ? (
                <div>
                  <label className="label">Assign to Manager</label>
                  <select className="select-field" value={newReportsTo} onChange={(e) => setNewReportsTo(e.target.value)}>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="micro-label" style={{ paddingBottom: 10 }}>Reports to Admin</div>
              )}
              <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', justifySelf: 'start' }}>
                <UserPlus size={14} /> Create {newRole}
              </button>
            </form>
          </div>

          <div className="panel table-wrap">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Reports To</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const supervisor = users.find((s) => s.id === u.reportsTo);
                  return (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 700 }}>{u.name}</td>
                      <td className="font-mono" style={{ fontSize: '0.78rem' }}>{u.email}</td>
                      <td>
                        <span className={`tag ${u.role === 'Admin' ? 'tag-red' : u.role === 'Manager' ? 'tag-orange' : u.role === 'Agent' ? 'tag-gold' : 'tag-ok'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.role === 'Agent' ? (
                          <select
                            className="select-field"
                            style={{ maxWidth: 210, padding: '5px 8px', fontSize: '0.8rem' }}
                            value={u.reportsTo || ''}
                            onChange={(e) => onAssignAgentToManager(u.id, e.target.value)}
                          >
                            {managers.map((m) => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
                            {supervisor ? supervisor.name : '— Top Level —'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="panel" style={{ padding: 24, maxWidth: 640 }}>
          <h2 className="font-display" style={{ fontSize: '1.5rem', marginBottom: 14 }}>Policy &amp; Estimator Configuration</h2>
          <form onSubmit={handleSaveSettings} style={{ display: 'grid', gap: 16 }}>
            <div className="grid-2" style={{ gap: 14 }}>
              <div>
                <label className="label">Base Rate per $1,000 ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  value={settingsDraft.baseRatePerThousand}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, baseRatePerThousand: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="label">Smoker Multiplier</label>
                <input
                  type="number"
                  step="0.05"
                  className="input-field"
                  value={settingsDraft.smokerMultiplier}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, smokerMultiplier: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="label">Preferred Tier Multiplier</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  value={settingsDraft.preferredDiscount}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, preferredDiscount: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="label">Max Rewards Extension (Days)</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  className="input-field"
                  value={settingsDraft.rewardMaxExtensionDays}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, rewardMaxExtensionDays: Number(e.target.value) })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>
              Save Configuration
            </button>
          </form>
        </div>
      )}
    </SidebarLayout>
  );
}
