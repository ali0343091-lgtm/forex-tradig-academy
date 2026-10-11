import React, { useState } from 'react';
import { Calculator, ShieldAlert, Award, ArrowRight, DollarSign } from 'lucide-react';

export const RiskCalculator: React.FC = () => {
  const [balance, setBalance] = useState<number>(1000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [stopLossPips, setStopLossPips] = useState<number>(25);
  const [pair, setPair] = useState<string>('EUR/USD');

  // Pip value estimation per standard lot (1.0 = $10/pip for EUR/USD)
  const pipValuePerStandardLot = pair === 'USD/JPY' ? 6.5 : 10;
  
  const riskAmount = (balance * (riskPercent / 100));
  // Lot size formula: Risk Amount / (StopLossPips * PipValuePerLot)
  const calculatedLots = stopLossPips > 0 
    ? Number((riskAmount / (stopLossPips * pipValuePerStandardLot)).toFixed(2)) 
    : 0;

  const target2R = (riskAmount * 2).toFixed(2);
  const target3R = (riskAmount * 3).toFixed(2);

  return (
    <div className="bg-[#090e1d] border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-display">
            Discipline Risk & Lot Size Calculator
          </h3>
          <p className="text-xs text-slate-400">
            Never risk more than 1% per setup. Master mathematical longevity in the currency markets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input: Balance */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Account Balance ($ USD)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-500 font-bold">$</span>
            <input
              type="number"
              min="10"
              step="50"
              value={balance}
              onChange={(e) => setBalance(Math.max(1, Number(e.target.value)))}
              className="w-full bg-[#050813] border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 pl-8 pr-4 text-white text-sm font-mono-numbers outline-none"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {[500, 1000, 5000, 10000].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBalance(b)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                ${b}
              </button>
            ))}
          </div>
        </div>

        {/* Input: Risk % */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Risk Tolerance (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0.25"
              max="5"
              step="0.25"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full bg-[#050813] border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 px-4 text-white text-sm font-mono-numbers outline-none"
            />
            <span className="text-sm font-bold text-slate-400">%</span>
          </div>
          <div className="flex gap-2 mt-2">
            {[0.5, 1, 1.5, 2].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRiskPercent(r)}
                className={`text-[11px] px-2 py-0.5 rounded ${
                  riskPercent === r ? 'bg-amber-500 text-black font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>

        {/* Input: Stop Loss Pips */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Stop Loss (Pips)
          </label>
          <input
            type="number"
            min="1"
            max="200"
            value={stopLossPips}
            onChange={(e) => setStopLossPips(Math.max(1, Number(e.target.value)))}
            className="w-full bg-[#050813] border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 px-4 text-white text-sm font-mono-numbers outline-none"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Measure from your entry to invalidation point
          </span>
        </div>
      </div>

      {/* Calculated Results Box */}
      <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#040713] p-4 rounded-xl border border-amber-500/30 flex flex-col justify-between">
          <span className="text-xs font-medium text-amber-400/90 uppercase tracking-wider">
            Optimal Lot Size
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono-numbers">
              {calculatedLots}
            </span>
            <span className="text-xs text-slate-400">Lots</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Exact volume for MT4/MT5 execution
          </span>
        </div>

        <div className="bg-[#040713] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-medium text-rose-400 uppercase tracking-wider">
            Risk at Invalidation
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-300 font-mono-numbers">
              ${riskAmount.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Maximum monetary downside on this trade
          </span>
        </div>

        <div className="bg-[#040713] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
            1:3 RR Target Profit
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-300 font-mono-numbers">
              +${target3R}
            </span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Triple your risk on high-confluence setups
          </span>
        </div>
      </div>
    </div>
  );
};
