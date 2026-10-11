import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { ForexQuote } from '../types/index.ts';

export const MarketTicker: React.FC = () => {
  const [rates, setRates] = useState<ForexQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/market-rates');
        if (res.ok) {
          const data = await res.json();
          setRates(data.rates || []);
        }
      } catch (e) {
        console.error('Ticker fetch error', e);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 5000); // 5s live updates
    return () => clearInterval(interval);
  }, []);

  if (loading && rates.length === 0) {
    return (
      <div className="bg-[#040711] border-b border-slate-800/80 text-xs py-2 px-4 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Connecting to global liquidity feeds...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#03060e] border-b border-amber-500/10 text-xs py-1.5 px-3 sm:px-6 overflow-hidden relative select-none">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="shrink-0 flex items-center gap-1.5 pr-3 border-r border-slate-800 text-amber-400 font-semibold tracking-wider uppercase text-[10px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Forex
        </div>

        <div className="flex items-center gap-5 sm:gap-8 whitespace-nowrap">
          {rates.map((q) => {
            const isPositive = q.change >= 0;
            return (
              <div key={q.symbol} className="inline-flex items-center gap-1.5 text-[11px] font-mono-numbers">
                <span className="text-slate-300 font-semibold">{q.symbol}</span>
                <span className="text-white font-medium">{q.bid}</span>
                <span className={`inline-flex items-center text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />}
                  {isPositive ? '+' : ''}{q.changePercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
