import React, { useState, useEffect } from 'react';
import { 
  Users, CreditCard, Video, Settings as SettingsIcon, Shield, Search, 
  Check, X, Eye, Trash2, Edit, Plus, Upload, AlertCircle, RefreshCw, 
  CheckCircle2, DollarSign, Phone, Mail, Award, Lock, Unlock, FileText 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSettings } from '../context/SettingsContext.tsx';
import { User, PaymentRequest, ClassLesson, AuditLog } from '../types/index.ts';
import { ReceiptViewerModal } from '../components/ReceiptViewerModal.tsx';
import { AdminVideoUploadModal } from '../components/AdminVideoUploadModal.tsx';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { settings, updateSettings, refreshSettings } = useSettings();

  const [activeTab, setActiveTab] = useState<'students' | 'payments' | 'classes' | 'settings' | 'audit'>('students');

  // Data states
  const [students, setStudents] = useState<(User & { paymentStatus: string; paymentsCount: number })[]>([]);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [classes, setClasses] = useState<ClassLesson[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedPaymentForReview, setSelectedPaymentForReview] = useState<PaymentRequest | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Editable settings form
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const fetchAllAdminData = async () => {
    setLoading(true);
    const token = localStorage.getItem('fta_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [studRes, payRes, clsRes, logRes] = await Promise.all([
        fetch('/api/admin/students', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/payments', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/classes', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/audit-logs', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (studRes.ok) {
        const sData = await studRes.json();
        setStudents(sData.students || []);
      }
      if (payRes.ok) {
        const pData = await payRes.json();
        setPayments(pData.payments || []);
      }
      if (clsRes.ok) {
        const cData = await clsRes.json();
        setClasses(cData.classes || []);
      }
      if (logRes.ok) {
        const lData = await logRes.json();
        setAuditLogs(lData.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  // Auth Guard
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400">
          You must be logged in as an authorized academy administrator to view this control panel.
        </p>
        <button
          onClick={() => navigate('/admin-login')}
          className="px-6 py-2.5 bg-amber-500 text-black font-extrabold text-xs rounded-xl"
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  // Admin Actions: Students
  const handleStudentStatusChange = async (studentId: string, newStatus: string) => {
    const token = localStorage.getItem('fta_token');
    try {
      const res = await fetch(`/api/admin/students/${studentId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Actions: Payments
  const handleApprovePayment = async (paymentId: string) => {
    const token = localStorage.getItem('fta_token');
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.ok) {
        fetchAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectPayment = async (paymentId: string, reason: string) => {
    const token = localStorage.getItem('fta_token');
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
      });
      if (res.ok) {
        fetchAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Actions: Classes
  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to permanently delete this class?')) return;
    const token = localStorage.getItem('fta_token');
    try {
      const res = await fetch(`/api/admin/classes/${classId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async (c: ClassLesson) => {
    const token = localStorage.getItem('fta_token');
    try {
      const res = await fetch(`/api/admin/classes/${c.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished: !c.isPublished })
      });
      if (res.ok) {
        fetchAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSavedSuccess(false);

    const success = await updateSettings(settingsForm);
    if (success) {
      setSettingsSavedSuccess(true);
      await refreshSettings();
      setTimeout(() => setSettingsSavedSuccess(false), 3000);
    }
    setSavingSettings(false);
  };

  // Upload Instructor Avatar
  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setAvatarUploading(true);

    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('fta_token');
    try {
      const res = await fetch('/api/settings/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setSettingsForm(prev => ({ ...prev, instructorAvatar: data.avatarUrl }));
        await refreshSettings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAvatarUploading(false);
    }
  };

  // Counts for Stats Strip
  const pendingStudentsCount = students.filter(s => s.status === 'pending').length;
  const pendingPaymentsCount = payments.filter(p => p.status === 'pending').length;
  const verifiedPaymentsCount = payments.filter(p => p.status === 'approved').length;
  const totalRevenuePKR = payments
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesStatus = studentStatusFilter === 'all' || s.status === studentStatusFilter;
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          (s.phone && s.phone.includes(studentSearch));
    return matchesStatus && matchesSearch;
  });

  // Filtered Payments
  const filteredPayments = payments.filter(p => {
    return paymentFilter === 'all' || p.status === paymentFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Control Panel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            Academy Administration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Logged in as <strong className="text-white">{user.email}</strong> • Full administrative privileges
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Prominent "+ NEW CLASS / UPLOAD VIDEO" Button */}
          <button
            onClick={() => setVideoModalOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ NEW CLASS / UPLOAD VIDEO</span>
          </button>

          <button
            onClick={fetchAllAdminData}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            title="Refresh All Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Analytics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Students
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono-numbers mt-1">
            {students.length}
          </div>
          <span className="text-[10px] text-amber-400 font-semibold mt-1 block">
            {pendingStudentsCount} pending review
          </span>
        </div>

        <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Receipts
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono-numbers mt-1">
            {pendingPaymentsCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Awaiting verification
          </span>
        </div>

        <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Verified Payments
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono-numbers mt-1">
            {verifiedPaymentsCount}
          </div>
          <span className="text-[10px] text-emerald-400/80 mt-1 block">
            Active paid students
          </span>
        </div>

        <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Verified Tuition (PKR)
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-cyan-300 font-mono-numbers mt-1 truncate">
            {totalRevenuePKR.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Easypaisa & JazzCash
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'students'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students ({students.length})</span>
          {pendingStudentsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-black text-[10px] rounded-full font-black">
              {pendingStudentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'payments'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Receipts ({payments.length})</span>
          {pendingPaymentsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-emerald-500 text-black text-[10px] rounded-full font-black">
              {pendingPaymentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'classes'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Classes & Videos ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Website Settings & Prices</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: STUDENTS MANAGEMENT ================= */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-[#080d1b] border border-slate-800 focus:border-amber-500 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={studentStatusFilter}
                onChange={(e) => setStudentStatusFilter(e.target.value)}
                className="bg-[#080d1b] border border-slate-800 text-xs text-white rounded-xl py-2 px-3 outline-none"
              >
                <option value="all">All ({students.length})</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="blocked">Blocked / Suspended</option>
              </select>
            </div>
          </div>

          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#050813] text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Registration</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-sans">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No students found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{s.name}</div>
                          <div className="text-[11px] text-slate-400">{s.email}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {s.phone || '—'}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            s.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : s.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            s.paymentStatus === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : s.paymentStatus === 'pending'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {s.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {s.status !== 'approved' && (
                              <button
                                onClick={() => handleStudentStatusChange(s.id, 'approved')}
                                className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold"
                                title="Approve Student Account"
                              >
                                Approve
                              </button>
                            )}

                            {s.status !== 'blocked' ? (
                              <button
                                onClick={() => handleStudentStatusChange(s.id, 'blocked')}
                                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-[10px] font-bold"
                                title="Suspend Account"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStudentStatusChange(s.id, 'approved')}
                                className="px-2.5 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 rounded-lg text-[10px] font-bold"
                                title="Restore Suspended Account"
                              >
                                Restore
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PAYMENTS VERIFICATION ================= */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-display">Submitted Manual Payments</h3>
              <p className="text-xs text-slate-400">Review receipts and verify against your Easypaisa & JazzCash apps</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter:</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-[#080d1b] border border-slate-800 text-xs text-white rounded-xl py-2 px-3 outline-none"
              >
                <option value="all">All Payments ({payments.length})</option>
                <option value="pending">Pending ({pendingPaymentsCount})</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPayments.length === 0 ? (
              <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
                No payment requests match this filter.
              </div>
            ) : (
              filteredPayments.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#080d1b] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                        p.method === 'Easypaisa' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {p.method}
                      </span>
                      <span className="text-base font-bold text-white font-mono-numbers">
                        PKR {p.amount.toLocaleString()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : p.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300">
                      Student: <strong className="text-white">{p.studentName}</strong> ({p.studentEmail})
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      Transaction Ref / TID: <span className="text-cyan-300 font-bold select-all bg-black/40 px-2 py-0.5 rounded">{p.transactionRef}</span>
                      <span className="mx-2 text-slate-600">•</span>
                      Submitted: {new Date(p.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {p.rejectionReason && (
                      <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
                        <strong>Rejection Reason:</strong> {p.rejectionReason}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {/* View Receipt Screenshot Modal Button */}
                    <button
                      onClick={() => setSelectedPaymentForReview(p)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Receipt Screenshot</span>
                    </button>

                    {p.status === 'pending' && (
                      <button
                        onClick={() => handleApprovePayment(p.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer shadow-md"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Quick Approve</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: CLASSES & VIDEO MANAGEMENT ================= */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display">Forex Class Management</h3>
              <p className="text-xs text-slate-400">
                Upload new MP4/WebM videos, edit titles, and control publishing status
              </p>
            </div>

            <button
              onClick={() => setVideoModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ NEW CLASS / UPLOAD VIDEO</span>
            </button>
          </div>

          <div className="space-y-3">
            {classes.map((c, index) => (
              <div
                key={c.id}
                className="bg-[#080d1b] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      #{index + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      c.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {c.isPublished ? 'Published' : 'Draft / Unpublished'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">{c.description}</p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>{c.moduleTitle}</span>
                    <span>•</span>
                    <span>{c.durationMinutes} min</span>
                    {c.videoFilename && (
                      <>
                        <span>•</span>
                        <span className="text-cyan-300 font-mono">Custom Video: {c.videoFilename}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(c)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      c.isPublished
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {c.isPublished ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => handleDeleteClass(c.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Class"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: WEBSITE SETTINGS & PRICES ================= */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-display">Website Settings & Pricing</h3>
              <p className="text-xs text-slate-400">
                Update prices, Easypaisa/JazzCash numbers, and academy details without editing source code
              </p>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {settingsSavedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully! Changes are live across the entire website.</span>
            </div>
          )}

          {/* Pricing Config Card */}
          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Course Pricing Configuration
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Original Course Price (PKR)
                </label>
                <input
                  type="number"
                  value={settingsForm.originalPrice}
                  onChange={(e) => setSettingsForm({ ...settingsForm, originalPrice: Number(e.target.value) })}
                  className="w-full bg-[#050813] border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-4 text-white text-sm font-mono-numbers outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Discounted Course Price (PKR)
                </label>
                <input
                  type="number"
                  value={settingsForm.discountedPrice}
                  onChange={(e) => setSettingsForm({ ...settingsForm, discountedPrice: Number(e.target.value) })}
                  className="w-full bg-[#050813] border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-4 text-white text-sm font-mono-numbers outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Numbers Config Card */}
          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Manual Payment Numbers (Easypaisa & JazzCash)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Easypaisa */}
              <div className="space-y-3 p-4 bg-[#050813] border border-slate-800 rounded-xl">
                <span className="text-xs font-bold text-emerald-400 uppercase">Easypaisa Details</span>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={settingsForm.easypaisaNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, easypaisaNumber: e.target.value })}
                    className="w-full bg-[#080d1b] border border-slate-700 rounded-xl py-2 px-3 text-white text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Account Title</label>
                  <input
                    type="text"
                    value={settingsForm.easypaisaAccountTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, easypaisaAccountTitle: e.target.value })}
                    className="w-full bg-[#080d1b] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs outline-none"
                  />
                </div>
              </div>

              {/* JazzCash */}
              <div className="space-y-3 p-4 bg-[#050813] border border-slate-800 rounded-xl">
                <span className="text-xs font-bold text-amber-400 uppercase">JazzCash Details</span>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={settingsForm.jazzcashNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, jazzcashNumber: e.target.value })}
                    className="w-full bg-[#080d1b] border border-slate-700 rounded-xl py-2 px-3 text-white text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Account Title</label>
                  <input
                    type="text"
                    value={settingsForm.jazzcashAccountTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, jazzcashAccountTitle: e.target.value })}
                    className="w-full bg-[#080d1b] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Profile & Photo Upload (Requirement 11) */}
          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" />
              Instructor Profile & Portrait
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Avatar Uploader */}
              <div className="space-y-3 text-center">
                <div className="w-32 h-32 rounded-2xl bg-[#050813] border border-amber-500/40 overflow-hidden mx-auto flex items-center justify-center">
                  {settingsForm.instructorAvatar ? (
                    <img
                      src={settingsForm.instructorAvatar}
                      alt="Instructor"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-500">No Image Uploaded</span>
                  )}
                </div>

                <label className="inline-block px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                  {avatarUploading ? 'Uploading...' : 'Upload Portrait Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Bio Details */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Instructor Display Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.instructorName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instructorName: e.target.value })}
                    className="w-full bg-[#050813] border border-slate-700 rounded-xl py-2 px-3 text-white text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Instructor Bio
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.instructorBio}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instructorBio: e.target.value })}
                    className="w-full bg-[#050813] border border-slate-700 rounded-xl p-3 text-white text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Academy Contact Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Contact Email</label>
                <input
                  type="email"
                  value={settingsForm.contactEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                  className="w-full bg-[#050813] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={settingsForm.contactPhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                  className="w-full bg-[#050813] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full bg-[#050813] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ================= TAB 5: AUDIT LOG ================= */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white font-display">System Audit Logs</h3>
          <p className="text-xs text-slate-400">
            Immutable log of student registrations, payment reviews, and settings changes
          </p>

          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="divide-y divide-slate-800/80 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                      {log.action}
                    </span>
                    <p className="text-slate-300">{log.details}</p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Actor: {log.actorEmail}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ReceiptViewerModal
        isOpen={Boolean(selectedPaymentForReview)}
        payment={selectedPaymentForReview}
        onClose={() => setSelectedPaymentForReview(null)}
        onApprove={handleApprovePayment}
        onReject={handleRejectPayment}
      />

      <AdminVideoUploadModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onSuccess={() => fetchAllAdminData()}
      />
    </div>
  );
};
