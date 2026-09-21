import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Building2,
  RefreshCw,
  UserCheck,
  FileCheck,
  History,
  Lock,
} from 'lucide-react';
import { VerificationStatus } from '../types';

export const AdminVerificationConsole: React.FC = () => {
  const {
    workers,
    governmentVerifications,
    getWorkerVerifications,
    adminVerifyGovernment,
    adminRejectGovernment,
    verifyCooperativeWorker,
    rejectCooperativeWorker,
    verifyPlatformWorker,
    rejectPlatformWorker,
    getVerificationAuditLogs,
    setSelectedWorkerForProfile,
    language,
  } = useApp();

  // Admin persona toggle for evaluator demonstrations
  const [adminScope, setAdminScope] = useState<'coop-delhi' | 'coop-punjab' | 'platform-admin'>('coop-delhi');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<'ALL' | 'GOVERNMENT' | 'COOPERATIVE' | 'SHRAMSETU'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [auditWorkerId, setAuditWorkerId] = useState<string | null>(null);

  const adminScopeConfig = {
    'coop-delhi': {
      label: 'DLACS Cooperative Registrar',
      societyId: 'coop-delhi-central',
      societyName: 'Delhi Labourers & Artisans Cooperative Society (DLACS)',
      adminType: 'cooperative_admin' as const,
      color: 'bg-blue-600',
    },
    'coop-punjab': {
      label: 'Punjab Shramik Sabha Registrar',
      societyId: 'coop-punjab-shramik',
      societyName: 'Punjab Shramik Sahakari Sabha, Mohali',
      adminType: 'cooperative_admin' as const,
      color: 'bg-amber-600',
    },
    'platform-admin': {
      label: 'ShramSetu Platform Super Admin',
      societyId: undefined,
      societyName: undefined,
      adminType: 'platform_admin' as const,
      color: 'bg-emerald-600',
    },
  }[adminScope];

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.primaryTrade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.cooperativeName.toLowerCase().includes(searchQuery.toLowerCase());

    const govRecord = governmentVerifications.find((gv) => gv.workerId === worker.id);
    const govStatus = govRecord ? govRecord.status : 'NOT_VERIFIED';

    if (filterStatus === 'ALL') return matchesSearch;
    if (filterTier === 'GOVERNMENT') return matchesSearch && govStatus === filterStatus;
    if (filterTier === 'COOPERATIVE') return matchesSearch && worker.cooperativeVerificationStatus === filterStatus;
    if (filterTier === 'SHRAMSETU') return matchesSearch && worker.shramsetuVerificationStatus === filterStatus;
    return matchesSearch;
  });

  // Action Handlers
  const handleGovVerify = async (workerId: string) => {
    setActionLoadingId(`${workerId}-gov`);
    setActionError(null);
    try {
      const res = await adminVerifyGovernment(workerId, 'Cooperative Registrar administrative audit approved.');
      setActionMessage(`Government Tier: Worker ${workerId} verified. Authority: ${res.authority}`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionError(err.message || 'Government verification failed');
      setTimeout(() => setActionError(null), 5000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleGovReject = async (workerId: string) => {
    setActionLoadingId(`${workerId}-gov`);
    setActionError(null);
    try {
      await adminRejectGovernment(workerId, 'Documentation audit incomplete.');
      setActionMessage(`Government Tier: Worker ${workerId} marked NOT_VERIFIED.`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionError(err.message || 'Rejection failed');
      setTimeout(() => setActionError(null), 5000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCoopVerify = async (worker: any) => {
    setActionLoadingId(`${worker.id}-coop`);
    setActionError(null);
    try {
      // Check cooperative boundary restriction
      if (adminScopeConfig.societyId && worker.cooperativeId !== adminScopeConfig.societyId) {
        throw new Error(
          `Boundary Enforcement: You are acting as ${adminScopeConfig.label} (${adminScopeConfig.societyId}) and cannot verify workers of '${worker.cooperativeName}'.`
        );
      }
      const res = await verifyCooperativeWorker(worker.id, 'Physical trade field audit verified.');
      setActionMessage(`Cooperative Tier: Worker ${worker.name} verified by ${res.cooperativeVerifiedBy}.`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionError(err.message || 'Cooperative verification failed');
      setTimeout(() => setActionError(null), 6000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCoopReject = async (worker: any) => {
    setActionLoadingId(`${worker.id}-coop`);
    setActionError(null);
    try {
      if (adminScopeConfig.societyId && worker.cooperativeId !== adminScopeConfig.societyId) {
        throw new Error(
          `Boundary Enforcement: You are acting as ${adminScopeConfig.label} (${adminScopeConfig.societyId}) and cannot reject workers of '${worker.cooperativeName}'.`
        );
      }
      const res = await rejectCooperativeWorker(worker.id, 'Cooperative society field audit failed.');
      setActionMessage(`Cooperative Tier: Worker ${worker.name} marked REJECTED.`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionError(err.message || 'Cooperative rejection failed');
      setTimeout(() => setActionError(null), 6000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePlatformVerify = async (workerId: string) => {
    setActionLoadingId(`${workerId}-platform`);
    setActionError(null);
    try {
      if (adminScopeConfig.adminType === 'cooperative_admin') {
        throw new Error('Access denied: Platform tier verification requires Platform Administrator authority.');
      }
      const res = await verifyPlatformWorker(workerId, 'KYC photo match and safety protocol validated.');
      setActionMessage(`Platform Tier: Worker ${workerId} verified by ${res.shramsetuVerifiedBy}.`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionError(err.message || 'Platform verification failed');
      setTimeout(() => setActionError(null), 6000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePlatformReject = async (workerId: string) => {
    setActionLoadingId(`${workerId}-platform`);
    setActionError(null);
    try {
      if (adminScopeConfig.adminType === 'cooperative_admin') {
        throw new Error('Access denied: Platform tier verification requires Platform Administrator authority.');
      }
      await rejectPlatformWorker(workerId, 'Platform onboarding checklist incomplete.');
      setActionMessage(`Platform Tier: Worker ${workerId} marked REJECTED.`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionError(err.message || 'Platform rejection failed');
      setTimeout(() => setActionError(null), 6000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const auditLogs = getVerificationAuditLogs(auditWorkerId || undefined);

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="p-6 bg-neutral-900 text-white rounded-2xl shadow-sm border border-neutral-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>3-Tier Independent Verification Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Worker Credentials & Audit Gateway
            </h1>
            <p className="text-neutral-400 text-xs mt-1 max-w-2xl leading-relaxed">
              Three completely decoupled verification layers: Government (Official/CLC),
              Cooperative Society (Local Membership Audit), and ShramSetu Platform (KYC & Safety).
            </p>
          </div>

          {/* Admin Persona Switcher */}
          <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/80 space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-neutral-400">
              Active Security Persona:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setAdminScope('coop-delhi')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                  adminScope === 'coop-delhi'
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                }`}
              >
                Delhi Co-op Admin
              </button>
              <button
                type="button"
                onClick={() => setAdminScope('coop-punjab')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                  adminScope === 'coop-punjab'
                    ? 'bg-amber-600 text-white'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                }`}
              >
                Punjab Co-op Admin
              </button>
              <button
                type="button"
                onClick={() => setAdminScope('platform-admin')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                  adminScope === 'platform-admin'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                }`}
              >
                Platform Super Admin
              </button>
            </div>
            <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {adminScopeConfig.societyName || 'Global Platform Authority'}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {actionMessage}
          </span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-700 hover:text-emerald-950 text-xs font-bold">✕</button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-950 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            {actionError}
          </span>
          <button onClick={() => setActionError(null)} className="text-red-700 hover:text-red-950 text-xs font-bold">✕</button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by worker, trade, society..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'VERIFIED', 'PENDING', 'REJECTED', 'REQUIRES_REVIEW'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Tier Workers Management Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs divide-y divide-neutral-100">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-neutral-50 text-[11px] font-black uppercase text-neutral-400">
          <div className="col-span-3">Worker & Society</div>
          <div className="col-span-3">Tier 1: Government (CLC / State)</div>
          <div className="col-span-3">Tier 2: Cooperative Status</div>
          <div className="col-span-3">Tier 3: Platform KYC</div>
        </div>

        {filteredWorkers.map((worker) => {
          const govRecords = getWorkerVerifications(worker.id);
          const govRecord = govRecords[0] || null;
          const govStatus = govRecord ? govRecord.status : 'NOT_VERIFIED';

          const isGovLoading = actionLoadingId === `${worker.id}-gov`;
          const isCoopLoading = actionLoadingId === `${worker.id}-coop`;
          const isPlatformLoading = actionLoadingId === `${worker.id}-platform`;

          const canAdminVerifyCoop =
            !adminScopeConfig.societyId || adminScopeConfig.societyId === worker.cooperativeId;

          return (
            <div
              key={worker.id}
              className="grid grid-cols-12 gap-3 px-5 py-4 items-start hover:bg-neutral-50/50 transition-colors text-xs border-b border-neutral-100 last:border-0"
            >
              {/* Worker Info */}
              <div className="col-span-3 flex items-start gap-3">
                <img
                  src={worker.photoUrl}
                  alt={worker.name}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0 mt-0.5"
                />
                <div>
                  <button
                    onClick={() => setSelectedWorkerForProfile(worker)}
                    className="font-bold text-neutral-900 hover:underline text-left block"
                  >
                    {worker.name}
                  </button>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    {worker.primaryTrade}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5 line-clamp-1" title={worker.cooperativeName}>
                    {worker.cooperativeName}
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuditWorkerId(auditWorkerId === worker.id ? null : worker.id)}
                    className="mt-1.5 text-[10px] font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <History className="w-3 h-3" />
                    Audit History
                  </button>
                </div>
              </div>

              {/* Tier 1: Government */}
              <div className="col-span-3 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      govStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : govStatus === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : govStatus === 'REQUIRES_REVIEW'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {govStatus}
                  </span>
                  <span className="text-[9px] text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                    DEMO
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-600 truncate">
                  Ref: {govRecord?.verificationReference || 'CLC-DEMO-PENDING'}
                </div>
                <div className="flex items-center gap-1 pt-1">
                  {govStatus !== 'VERIFIED' && (
                    <button
                      type="button"
                      disabled={isGovLoading}
                      onClick={() => handleGovVerify(worker.id)}
                      className="px-2 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded cursor-pointer disabled:opacity-50"
                    >
                      Verify
                    </button>
                  )}
                  {govStatus !== 'NOT_VERIFIED' && (
                    <button
                      type="button"
                      disabled={isGovLoading}
                      onClick={() => handleGovReject(worker.id)}
                      className="px-2 py-0.5 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded cursor-pointer disabled:opacity-50"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>

              {/* Tier 2: Cooperative */}
              <div className="col-span-3 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      worker.cooperativeVerificationStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : worker.cooperativeVerificationStatus === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {worker.cooperativeVerificationStatus || 'PENDING'}
                  </span>
                  {!canAdminVerifyCoop && (
                    <span className="text-[9px] text-neutral-500 flex items-center gap-0.5" title="Belongs to another cooperative">
                      <Lock className="w-2.5 h-2.5" />
                      Locked
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-500 line-clamp-1">
                  By: {worker.cooperativeVerifiedBy || 'Society Board'}
                </div>
                <div className="flex items-center gap-1 pt-1">
                  {worker.cooperativeVerificationStatus !== 'VERIFIED' && (
                    <button
                      type="button"
                      disabled={isCoopLoading}
                      onClick={() => handleCoopVerify(worker)}
                      className="px-2 py-0.5 text-[10px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded cursor-pointer disabled:opacity-50"
                      title={!canAdminVerifyCoop ? 'Cross-society restriction' : 'Verify membership'}
                    >
                      Co-op Verify
                    </button>
                  )}
                  {worker.cooperativeVerificationStatus !== 'REJECTED' && (
                    <button
                      type="button"
                      disabled={isCoopLoading}
                      onClick={() => handleCoopReject(worker)}
                      className="px-2 py-0.5 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded cursor-pointer disabled:opacity-50"
                    >
                      Co-op Reject
                    </button>
                  )}
                </div>
              </div>

              {/* Tier 3: Platform KYC */}
              <div className="col-span-3 space-y-1.5">
                <div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      worker.shramsetuVerificationStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : worker.shramsetuVerificationStatus === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {worker.shramsetuVerificationStatus || 'PENDING'}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 line-clamp-1">
                  By: {worker.shramsetuVerifiedBy || 'Platform Safety'}
                </div>
                <div className="flex items-center gap-1 pt-1">
                  {worker.shramsetuVerificationStatus !== 'VERIFIED' && (
                    <button
                      type="button"
                      disabled={isPlatformLoading}
                      onClick={() => handlePlatformVerify(worker.id)}
                      className="px-2 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded cursor-pointer disabled:opacity-50"
                    >
                      Platform Verify
                    </button>
                  )}
                  {worker.shramsetuVerificationStatus !== 'REJECTED' && (
                    <button
                      type="button"
                      disabled={isPlatformLoading}
                      onClick={() => handlePlatformReject(worker.id)}
                      className="px-2 py-0.5 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded cursor-pointer disabled:opacity-50"
                    >
                      Platform Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit Log Timeline View */}
      <div className="p-5 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-neutral-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              {auditWorkerId
                ? `Verification Audit Trail for Worker ${auditWorkerId}`
                : 'Recent Verification Audit Trail (All Tiers)'}
            </h3>
          </div>
          {auditWorkerId && (
            <button
              onClick={() => setAuditWorkerId(null)}
              className="text-xs text-neutral-500 hover:text-black font-semibold cursor-pointer"
            >
              Show All Workers
            </button>
          )}
        </div>

        <div className="divide-y divide-neutral-100">
          {auditLogs.slice(0, 8).map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-neutral-900 flex items-center gap-2">
                  <span className="font-mono text-neutral-500 text-[11px]">{log.formattedDate}</span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-emerald-800 font-semibold">{log.action}</span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  Target: {log.workerName || log.workerId} | Auditor: {log.actorName}
                </div>
                {log.notes && (
                  <div className="text-[10px] text-neutral-400 italic">
                    "{log.notes}"
                  </div>
                )}
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                log.tier === 'GOVERNMENT'
                  ? 'bg-purple-100 text-purple-800'
                  : log.tier === 'COOPERATIVE'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {log.tier}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
