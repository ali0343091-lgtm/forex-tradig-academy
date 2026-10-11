import React, { useEffect, useState } from 'react';
import { ShieldCheck, Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, RefreshCw, FileText, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { PaymentRequest } from '../types/index.ts';

interface StatusPageProps {
  navigate: (path: string) => void;
}

export const StatusPage: React.FC<StatusPageProps> = ({ navigate }) => {
  const { user, paymentStatus, canAccessClasses, refreshUser } = useAuth();
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPayments = async () => {
    setLoading(true);
    const token = localStorage.getItem('fta_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/payments/my-status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPayments();
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Student Login Required</h2>
        <p className="text-xs text-slate-400">
          Please log in to view your registration and payment status.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const isAccountApproved = user.status === 'approved';
  const isPaymentApproved = paymentStatus === 'approved';
  const hasFullAccess = canAccessClasses;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Student Verification Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
            Enrollment & Access Status
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Student: <strong className="text-white">{user.name}</strong> ({user.email})
          </p>
        </div>

        <button
          onClick={async () => {
            await refreshUser();
            await fetchMyPayments();
          }}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Main Status Overview Card */}
      <div className="bg-[#090e1d] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Account Registration Status */}
          <div className="bg-[#050813] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Account Status
              </span>
              {user.status === 'approved' && (
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </span>
              )}
              {user.status === 'pending' && (
                <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-500/30">
                  <Clock className="w-3.5 h-3.5" /> Pending Review
                </span>
              )}
              {user.status === 'rejected' && (
                <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full text-xs font-bold border border-rose-500/30">
                  <XCircle className="w-3.5 h-3.5" /> Rejected
                </span>
              )}
              {user.status === 'blocked' && (
                <span className="flex items-center gap-1 text-rose-500 bg-rose-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold border border-rose-500/40">
                  Suspended
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300">
              {user.status === 'approved'
                ? 'Your student account has been approved by the academy.'
                : user.status === 'pending'
                ? 'Your registration is in queue. Admin approval is granted once payment is verified.'
                : 'Please contact academy support regarding your account.'}
            </p>
          </div>

          {/* Box 2: Payment Verification Status */}
          <div className="bg-[#050813] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Course Payment Status
              </span>
              {paymentStatus === 'approved' && (
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
              {paymentStatus === 'pending' && (
                <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-500/30">
                  <Clock className="w-3.5 h-3.5" /> Receipt Pending
                </span>
              )}
              {paymentStatus === 'none' && (
                <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-0.5 rounded-full font-bold">
                  Not Submitted
                </span>
              )}
              {paymentStatus === 'rejected' && (
                <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full text-xs font-bold border border-rose-500/30">
                  <XCircle className="w-3.5 h-3.5" /> Declined
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300">
              {paymentStatus === 'approved'
                ? 'Your manual payment receipt has been verified and confirmed.'
                : paymentStatus === 'pending'
                ? 'Your receipt is submitted and undergoing independent verification by the instructor.'
                : paymentStatus === 'rejected'
                ? 'Your receipt submission was rejected. Review the details below or re-submit.'
                : 'No payment receipt submitted yet. Transfer via Easypaisa or JazzCash to proceed.'}
            </p>
          </div>
        </div>

        {/* Access Banner */}
        <div className={`p-5 rounded-2xl border ${
          hasFullAccess
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
            : 'bg-amber-500/10 border-amber-500/40 text-amber-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {hasFullAccess ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <Lock className="w-6 h-6 text-amber-400 shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-bold text-white">
                  {hasFullAccess ? 'Full Course Access Granted!' : 'Private Classes Locked (Pending Verification)'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {hasFullAccess
                    ? 'You have unlimited access to all private modules, video classes, and updates.'
                    : 'Paid course access unlocks immediately once the admin approves your submitted payment receipt.'}
                </p>
              </div>
            </div>

            {hasFullAccess ? (
              <button
                onClick={() => navigate('/classes')}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Enter Class Library</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/payment-submission')}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Submit Payment Receipt</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submitted Payments History Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-display">
          Your Payment Submission History
        </h3>

        {loading ? (
          <div className="text-xs text-slate-500">Loading history...</div>
        ) : payments.length === 0 ? (
          <div className="bg-[#050813] border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400 space-y-2">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <p>You have not submitted any payment receipts yet.</p>
            <button
              onClick={() => navigate('/payment-submission')}
              className="text-amber-400 hover:text-amber-300 font-bold underline"
            >
              Submit Your First Payment Receipt
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <div
                key={p.id}
                className="bg-[#080d1b] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{p.method} Transfer</span>
                    <span className="text-xs text-slate-400 font-mono">PKR {p.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Trx Ref: <span className="font-mono text-cyan-300">{p.transactionRef}</span> • Submitted: {new Date(p.submittedAt).toLocaleDateString()}
                  </div>

                  {p.rejectionReason && (
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs mt-2">
                      <strong>Rejection Note:</strong> {p.rejectionReason}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    p.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : p.status === 'rejected'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
