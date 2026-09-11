import React from 'react';
import { ArrowUpRight, ArrowDownRight } from './Icon.jsx';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'purple', // 'purple' | 'blue' | 'white' | 'dark'
  trend,
  trendPositive = true,
  onClick
}) {
  if (variant === 'purple') {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4527a0] via-[#5e35b1] to-[#7e57c2] p-6 text-white berry-card-shadow berry-card-hover ${
          onClick ? 'cursor-pointer' : ''
        }`}
      >
        {/* Berry decorative ambient geometric circles */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -right-4 -bottom-10 h-36 w-36 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs text-white">
            {Icon && <Icon className="h-6 w-6" />}
          </div>
          {trend && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur-xs">
              {trendPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trend}
            </span>
          )}
        </div>

        <div className="relative z-10 mt-6">
          <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
          <p className="mt-1 text-sm font-medium text-purple-100">{title}</p>
          {subtitle && <p className="mt-2 text-xs text-purple-200/80">{subtitle}</p>}
        </div>
      </div>
    );
  }

  if (variant === 'blue') {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1565c0] via-[#1e88e5] to-[#42a5f5] p-6 text-white berry-card-shadow berry-card-hover ${
          onClick ? 'cursor-pointer' : ''
        }`}
      >
        {/* Berry decorative circles */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -right-4 -bottom-10 h-36 w-36 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs text-white">
            {Icon && <Icon className="h-6 w-6" />}
          </div>
          {trend && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur-xs">
              {trendPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trend}
            </span>
          )}
        </div>

        <div className="relative z-10 mt-6">
          <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
          <p className="mt-1 text-sm font-medium text-blue-100">{title}</p>
          {subtitle && <p className="mt-2 text-xs text-blue-200/80">{subtitle}</p>}
        </div>
      </div>
    );
  }

  // White Card Variant
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 berry-card-shadow berry-card-hover ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ede7f6] text-[#5e35b1]">
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              trendPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {trendPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-3xl font-bold tracking-tight text-slate-800">{value}</h3>
        <p className="mt-1 text-sm font-medium text-slate-500">{title}</p>
        {subtitle && <p className="mt-2 text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}
