import React, { useState } from 'react';
import {
  INITIAL_USERS,
  INITIAL_ESTIMATES,
  INITIAL_POLICIES,
  INITIAL_CLAIMS,
  INITIAL_CHATS,
  INITIAL_POLICY_SETTINGS,
} from './data/mockData';
import { AuthScreen } from './components/AuthScreen';
import { ClientPortal } from './components/ClientPortal';
import { AgentPortal } from './components/AgentPortal';
import { ManagerPortal } from './components/ManagerPortal';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [estimates, setEstimates] = useState(INITIAL_ESTIMATES);
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [claims, setClaims] = useState(INITIAL_CLAIMS);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [policySettings, setPolicySettings] = useState(INITIAL_POLICY_SETTINGS);

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  const handleLogin = (user) => {
    setCurrentUserId(user.id);
  };

  const handleRegisterClient = ({ name, email, age }) => {
    const firstAgent = users.find((u) => u.role === 'Agent');
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
    const newClientId = `cli-${Date.now()}`;
    const newClient = {
      id: newClientId,
      name,
      email,
      role: 'Client',
      reportsTo: firstAgent?.id || null,
      title: 'Policyholder',
      avatarInitials: initials || 'CL',
      status: 'Active',
      age,
    };

    setUsers((prev) => [...prev, newClient]);
    if (firstAgent) {
      setChats((prev) => [
        ...prev,
        {
          id: `CHAT-${Date.now()}`,
          clientId: newClientId,
          agentId: firstAgent.id,
          escalated: false,
          escalationReason: '',
          messages: [
            {
              id: `m-${Date.now()}`,
              senderId: firstAgent.id,
              senderName: firstAgent.name,
              senderRole: 'Agent',
              text: `Welcome to Autonomy Insurances, ${name}! I am your assigned advisor. Feel free to ask anything or share a policy estimate.`,
              timestamp: 'Just now',
            },
          ],
        },
      ]);
    }
    setCurrentUserId(newClientId);
  };

  const handleSendMessage = ({ chatId, text, attachmentName }) => {
    if (!currentUser) return;
    const nowLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          messages: [
            ...c.messages,
            {
              id: `m-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: currentUser.role,
              text: text || 'Sent an attachment',
              attachmentName,
              timestamp: nowLabel,
            },
          ],
        };
      })
    );
  };

  const handleCreateEstimate = (payload) => {
    if (!currentUser) return;
    const newEstimate = {
      id: `EST-2026-${Math.floor(200 + Math.random() * 799)}`,
      clientId: currentUser.id,
      clientName: currentUser.name,
      agentId: currentUser.reportsTo,
      ...payload,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setEstimates((prev) => [newEstimate, ...prev]);
  };

  const handleApproveEstimate = (estimateId) => {
    const target = estimates.find((e) => e.id === estimateId);
    if (!target) return;

    setEstimates((prev) =>
      prev.map((e) => (e.id === estimateId ? { ...e, status: 'Approved -> Policy' } : e))
    );

    const newPolicy = {
      id: `POL-${Math.floor(10000 + Math.random() * 89999)}`,
      estimateId: target.id,
      clientId: target.clientId,
      clientName: target.clientName,
      agentId: target.agentId,
      planName: target.planName,
      coverageAmount: target.coverageAmount,
      termYears: target.termYears,
      monthlyPremium: target.monthlyPremium,
      status: 'Active',
      startDate: new Date().toISOString().slice(0, 10),
      nextDueDate: '2026-12-23',
      rewardExtensionDays: 0,
      schedule: [
        { installment: 'Dec 2026', dueDate: '2026-12-23', amount: target.monthlyPremium, status: 'Upcoming' },
        { installment: 'Jan 2027', dueDate: '2027-01-23', amount: target.monthlyPremium, status: 'Upcoming' },
      ],
    };
    setPolicies((prev) => [newPolicy, ...prev]);
  };

  const handleSubmitClaim = (payload) => {
    if (!currentUser) return;
    const newClaim = {
      id: `CLM-${Math.floor(4100 + Math.random() * 899)}`,
      clientId: currentUser.id,
      clientName: currentUser.name,
      agentId: currentUser.reportsTo,
      ...payload,
      status: 'Submitted',
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    setClaims((prev) => [newClaim, ...prev]);
  };

  const handleUpdateClaimStatus = (claimId, nextStatus) => {
    setClaims((prev) => prev.map((c) => (c.id === claimId ? { ...c, status: nextStatus } : c)));
  };

  const handleEscalateChat = (chatId, reason) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, escalated: true, escalationReason: reason } : c))
    );
  };

  const handleResolveEscalation = (chatId) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, escalated: false, escalationReason: '' } : c))
    );
  };

  const handleReassignClient = (clientId, newAgentId) => {
    setUsers((prev) => prev.map((u) => (u.id === clientId ? { ...u, reportsTo: newAgentId } : u)));
    setChats((prev) => prev.map((c) => (c.clientId === clientId ? { ...c, agentId: newAgentId } : c)));
    setEstimates((prev) => prev.map((e) => (e.clientId === clientId ? { ...e, agentId: newAgentId } : e)));
    setPolicies((prev) => prev.map((p) => (p.clientId === clientId ? { ...p, agentId: newAgentId } : p)));
    setClaims((prev) => prev.map((c) => (c.clientId === clientId ? { ...c, agentId: newAgentId } : c)));
  };

  const handleCreateStaffAccount = ({ name, email, role, reportsTo }) => {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
    const newUser = {
      id: `${role.toLowerCase().slice(0, 3)}-${Date.now()}`,
      name,
      email,
      role,
      reportsTo,
      title: role === 'Manager' ? 'Branch Manager' : 'Life Insurance Advisor',
      avatarInitials: initials || 'ST',
      status: 'Active',
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const handleAssignAgentToManager = (agentId, managerId) => {
    setUsers((prev) => prev.map((u) => (u.id === agentId ? { ...u, reportsTo: managerId } : u)));
  };

  if (!currentUser) {
    return (
      <AuthScreen
        users={users}
        onLogin={handleLogin}
        onRegisterClient={handleRegisterClient}
      />
    );
  }

  if (currentUser.role === 'Client') {
    const assignedAgent = users.find((u) => u.id === currentUser.reportsTo);
    const clientChat = chats.find((c) => c.clientId === currentUser.id);
    return (
      <ClientPortal
        user={currentUser}
        assignedAgent={assignedAgent}
        estimates={estimates.filter((e) => e.clientId === currentUser.id)}
        policies={policies.filter((p) => p.clientId === currentUser.id)}
        claims={claims.filter((c) => c.clientId === currentUser.id)}
        chat={clientChat}
        policySettings={policySettings}
        onSendMessage={handleSendMessage}
        onCreateEstimate={handleCreateEstimate}
        onSubmitClaim={handleSubmitClaim}
        onLogout={() => setCurrentUserId(null)}
      />
    );
  }

  if (currentUser.role === 'Agent') {
    const manager = users.find((u) => u.id === currentUser.reportsTo);
    const assignedClients = users.filter((u) => u.role === 'Client' && u.reportsTo === currentUser.id);
    return (
      <AgentPortal
        user={currentUser}
        manager={manager}
        assignedClients={assignedClients}
        estimates={estimates.filter((e) => e.agentId === currentUser.id)}
        claims={claims.filter((c) => c.agentId === currentUser.id)}
        chats={chats.filter((c) => c.agentId === currentUser.id)}
        onSendMessage={handleSendMessage}
        onEscalateChat={handleEscalateChat}
        onApproveEstimate={handleApproveEstimate}
        onUpdateClaimStatus={handleUpdateClaimStatus}
        onLogout={() => setCurrentUserId(null)}
      />
    );
  }

  if (currentUser.role === 'Manager') {
    const teamAgents = users.filter((u) => u.role === 'Agent' && u.reportsTo === currentUser.id);
    const teamAgentIds = new Set(teamAgents.map((a) => a.id));
    const teamClients = users.filter((u) => u.role === 'Client' && teamAgentIds.has(u.reportsTo));
    const escalatedChats = chats.filter((c) => c.escalated && teamAgentIds.has(c.agentId));
    const teamPolicies = policies.filter((p) => teamAgentIds.has(p.agentId));

    return (
      <ManagerPortal
        user={currentUser}
        teamAgents={teamAgents}
        teamClients={teamClients}
        escalatedChats={escalatedChats}
        policies={teamPolicies}
        onReassignClient={handleReassignClient}
        onSendMessage={handleSendMessage}
        onResolveEscalation={handleResolveEscalation}
        onLogout={() => setCurrentUserId(null)}
      />
    );
  }

  return (
    <AdminPortal
      user={currentUser}
      users={users}
      policies={policies}
      estimates={estimates}
      claims={claims}
      policySettings={policySettings}
      onCreateStaffAccount={handleCreateStaffAccount}
      onAssignAgentToManager={handleAssignAgentToManager}
      onUpdatePolicySettings={setPolicySettings}
      onLogout={() => setCurrentUserId(null)}
    />
  );
}
