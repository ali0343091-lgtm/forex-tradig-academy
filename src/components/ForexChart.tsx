import React, { useState, useEffect, useId } from 'react';
import { BarChart3, TrendingUp, Layers, Compass, Eye } from 'lucide-react';

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const ForexChart: React.FC = () => {
  const chartGradientId = useId();
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [timeframe, setTimeframe] = useState<'M15' | 'H1' | 'H4' | 'D1'>('H1');
  const [showEMA, setShowEMA] = useState(true);
  const [showOrderBlock, setShowOrderBlock] = useState(true);
  const [candles, setCandles] = useState<Candle[]>([]);

  // Generate realistic candlestick data for visualization
  useEffect(() => {
    const basePrice = selectedPair === 'XAU/USD' ? 2740.00 : selectedPair === 'USD/JPY' ? 153.20 : 1.0840;
    const volatility = selectedPair === 'XAU/USD' ? 4.5 : selectedPair === 'USD/JPY' ? 0.35 : 0.0018;

    const data: Candle[] = [];
    let currentPrice = basePrice;
    const now = new Date();

    for (let i = 24; i >= 0; i--) {
      const timeDate = new Date(now.getTime() - i * 3600 * 1000);
      const timeStr = timeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const delta = (Math.random() - 0.48) * volatility;
      const open = currentPrice;
      const close = open + delta;
      const high = Math.max(open, close) + Math.random() * (volatility * 0.6);
      const low = Math.min(open, close) - Math.random() * (volatility * 0.6);
      const volume = Math.floor(Math.random() * 800) + 200;

      data.push({
        time: timeStr,
        open: Number(open.toFixed(selectedPair === 'XAU/USD' ? 2 : 4)),
        high: Number(high.toFixed(selectedPair === 'XAU/USD' ? 2 : 4)),
        low: Number(low.toFixed(selectedPair === 'XAU/USD' ? 2 : 4)),
        close: Number(close.toFixed(selectedPair === 'XAU/USD' ? 2 : 4)),
        volume
      });

      currentPrice = close;
    }

    setCandles(data);
  }, [selectedPair, timeframe]);

  if (candles.length === 0) return null;

  // Chart dimensions
  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 800;
  const svgHeight = 320;
  const chartPadding = { top: 20, bottom: 40, left: 10, right: 60 };
  const plotWidth = svgWidth - chartPadding.left - chartPadding.right;
  const plotHeight = svgHeight - chartPadding.top - chartPadding.bottom;

  const getY = (val: number) => {
    return chartPadding.top + plotHeight - ((val - minPrice) / priceRange) * plotHeight;
  };

  const candleSpacing = plotWidth / candles.length;
  const candleBodyWidth = Math.max(6, candleSpacing * 0.58);

  const lastCandle = candles[candles.length - 1];
  const isLastBullish = lastCandle.close >= lastCandle.open;

  return (
    <div className="bg-[#070b16] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Chart Top Toolbar */}
      <div className="p-4 bg-[#0a0f1d] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-[#03060f] p-1 rounded-xl border border-slate-800">
            {['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD'].map((pair) => (
              <button
                key={pair}
                onClick={() => setSelectedPair(pair)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedPair === pair
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {pair}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-[#03060f] p-1 rounded-xl border border-slate-800">
            {(['M15', 'H1', 'H4', 'D1'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                  timeframe === tf ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Live quote ticker on chart */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOrderBlock(!showOrderBlock)}
              className={`text-[11px] px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                showOrderBlock
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title="Show Institutional Order Block / Liquidity Zone"
            >
              <Layers className="w-3 h-3" />
              <span>OB Zone</span>
            </button>

            <button
              onClick={() => setShowEMA(!showEMA)}
              className={`text-[11px] px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                showEMA
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>20 EMA</span>
            </button>
          </div>

          <div className="text-right pl-2 border-l border-slate-800">
            <div className={`text-sm sm:text-base font-bold font-mono-numbers ${isLastBullish ? 'text-emerald-400' : 'text-rose-400'}`}>
              {lastCandle.close}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Live Feed
            </div>
          </div>
        </div>
      </div>

      {/* SVG Candlestick Viewport */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] select-none bg-gradient-to-b from-[#070b16] to-[#04060d]">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
          <defs>
            <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const price = minPrice + (1 - pct) * priceRange;
            const y = chartPadding.top + pct * plotHeight;
            return (
              <g key={idx}>
                <line
                  x1={chartPadding.left}
                  y1={y}
                  x2={svgWidth - chartPadding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.5"
                />
                {/* Price label on the right axis */}
                <text
                  x={svgWidth - chartPadding.right + 6}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  {price.toFixed(selectedPair === 'XAU/USD' ? 1 : 4)}
                </text>
              </g>
            );
          })}

          {/* Institutional Order Block (OB Zone Highlight) */}
          {showOrderBlock && candles.length > 10 && (
            <g opacity="0.35">
              <rect
                x={chartPadding.left + 5 * candleSpacing}
                y={getY(candles[8].high)}
                width={plotWidth - 5 * candleSpacing}
                height={Math.max(12, Math.abs(getY(candles[8].high) - getY(candles[8].low)))}
                fill="#f59e0b"
                rx="4"
              />
              <text
                x={chartPadding.left + 5 * candleSpacing + 8}
                y={getY(candles[8].high) + 12}
                fill="#fde68a"
                fontSize="9"
                fontWeight="700"
              >
                INSTITUTIONAL ORDER BLOCK (DEMAND)
              </text>
            </g>
          )}

          {/* 20 EMA Smooth Line */}
          {showEMA && (
            <path
              d={candles
                .map((c, i) => {
                  const x = chartPadding.left + i * candleSpacing + candleSpacing / 2;
                  // Simple smoothed line
                  const avg = (c.open + c.close + c.high + c.low) / 4;
                  const y = getY(avg);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              opacity="0.85"
            />
          )}

          {/* Candlesticks Rendering */}
          {candles.map((candle, idx) => {
            const isBullish = candle.close >= candle.open;
            const x = chartPadding.left + idx * candleSpacing + candleSpacing / 2;
            const highY = getY(candle.high);
            const lowY = getY(candle.low);
            const openY = getY(candle.open);
            const closeY = getY(candle.close);
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(2, Math.abs(openY - closeY));
            const color = isBullish ? '#10b981' : '#f43f5e';

            return (
              <g key={idx} className="transition-all">
                {/* Upper and Lower Wick */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1.5"
                />
                {/* Candle Real Body */}
                <rect
                  x={x - candleBodyWidth / 2}
                  y={bodyTop}
                  width={candleBodyWidth}
                  height={bodyHeight}
                  fill={isBullish ? '#10b981' : '#f43f5e'}
                  rx="1"
                />
              </g>
            );
          })}

          {/* Last Price Marker Line */}
          <line
            x1={chartPadding.left}
            y1={getY(lastCandle.close)}
            x2={svgWidth - chartPadding.right}
            y2={getY(lastCandle.close)}
            stroke={isLastBullish ? '#10b981' : '#f43f5e'}
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        </svg>

        {/* Floating status tag */}
        <div className="absolute bottom-3 left-4 flex items-center gap-3 text-[11px] text-slate-400 bg-[#090f1d]/90 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Compass className="w-3.5 h-3.5" />
            Institutional Analysis Module
          </span>
          <span className="text-slate-500">•</span>
          <span>Zero Lag Price Action</span>
        </div>
      </div>
    </div>
  );
};
