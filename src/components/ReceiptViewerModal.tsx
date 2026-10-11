import React, { useState } from 'react';
import { X, Check, AlertOctagon, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { PaymentRequest } from '../types/index.ts';

interface ReceiptViewerModalProps {
  payment: PaymentRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (paymentId: string) => Promise<void>;
  onReject: (paymentId: string, reason: string) => Promise<void>;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({
  payment,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [zoom, setZoom] = useState(1);

  if (!isOpen || !payment) return null;

  const token = localStorage.getItem('fta_token');
  const receiptUrl = `/api/receipts/${payment.receiptFilename}?token=${token}`;

  const handleApprove = async () => {
    setProcessing(true);
    await onApprove(payment.id);
    setProcessing(false);
    onClose();
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejecting this payment (e.g. Invalid Trx ID or screenshot unreadable).');
      return;
    }
    setProcessing(true);
    await onReject(payment.id, rejectionReason);
    setProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0b101f] border border-amber-500/30 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#080d1a]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Payment Verification — {payment.method}
            </h3>
            <p className="text-xs text-slate-400">
              Student: <span className="text-white font-semibold">{payment.studentName}</span> ({payment.studentEmail})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#050813] p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Method</span>
              <span className="text-sm font-bold text-amber-400">{payment.method}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Amount</span>
              <span className="text-sm font-bold text-white">PKR {payment.amount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Transaction ID</span>
              <span className="text-sm font-bold text-cyan-300 font-mono select-all">
                {payment.transactionRef}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Submitted</span>
              <span className="text-xs text-slate-300">
                {new Date(payment.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Receipt Image Preview with Zoom Controls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Submitted Receipt Screenshot
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom(Math.max(0.6, zoom - 0.2))}
                  className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(Math.min(2.5, zoom + 0.2))}
                  className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={payment.receiptOriginalName}
                  className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-xs px-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            <div className="relative bg-[#04060e] border border-slate-800 rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center p-4">
              <img
                src={receiptUrl}
                alt="Payment Receipt"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                className="max-h-[480px] max-w-full object-contain rounded transition-transform duration-200"
              />
            </div>
          </div>

          {/* Rejection Reason Form */}
          {showRejectInput && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <label className="block text-xs font-semibold text-rose-300 mb-1.5 uppercase">
                Reason for Rejection (Visible to student)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Transaction ID could not be matched with bank record, or screenshot unreadable."
                rows={2}
                className="w-full bg-[#050813] border border-rose-500/40 rounded-xl p-3 text-white text-xs outline-none focus:ring-1 focus:ring-rose-500"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-all"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setShowRejectInput(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#080d1a] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Current Status: <span className="font-bold uppercase text-amber-400">{payment.status}</span>
          </div>

          <div className="flex items-center gap-3">
            {!showRejectInput && payment.status === 'pending' && (
              <button
                type="button"
                onClick={() => setShowRejectInput(true)}
                disabled={processing}
                className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <AlertOctagon className="w-4 h-4" />
                Reject Payment
              </button>
            )}

            {payment.status === 'pending' && (
              <button
                type="button"
                onClick={handleApprove}
                disabled={processing}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Approve Payment & Grant Access
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
