import React, { useCallback, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Download,
  Filter,
  Gauge,
  GitBranch,
  RefreshCcw,
  Search,
  ShieldAlert,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import usePipelineAnalytics from '../../hooks/analytics/usePipelineAnalytics';

type AnalyticsDateRange =
  | 'today'
  | '7d'
  | '30d'
  | '90d'
  | '6m'
  | '12m'
  | 'custom';

type ComparePeriodType =
  | 'previous_period'
  | 'previous_month'
  | 'previous_quarter'
  | 'previous_year';

type TrendTone = 'positive' | 'negative' | 'neutral';
type MetricTone = 'default' | 'positive' | 'warning' | 'danger';

interface PipelinePageFilters {
  dateRange: AnalyticsDateRange;
  startDate?: string;
  endDate?: string;
  pipelineIds: string[];
  stageIds: string[];
  ownerIds: string[];
  teamIds: string[];
  sourceIds: string[];
  projectIds: string[];
  locationIds: string[];
  search: string;
}

interface PipelineComparePeriod {
  enabled: boolean;
  type: ComparePeriodType;
}

interface StatCardItem {
  key: string;
  title: string;
  value: string;
  subtitle?: string;
  trendText?: string;
  trendTone?: TrendTone;
  icon: React.ReactNode;
}

const DEFAULT_FILTERS: PipelinePageFilters = {
  dateRange: '30d',
  pipelineIds: [],
  stageIds: [],
  ownerIds: [],
  teamIds: [],
  sourceIds: [],
  projectIds: [],
  locationIds: [],
  search: '',
};

const DEFAULT_COMPARE_PERIOD: PipelineComparePeriod = {
  enabled: true,
  type: 'previous_period',
};

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const formatNumber = (value: number): string => numberFormatter.format(value || 0);
const formatPercent = (value: number): string => `${percentFormatter.format(value || 0)}%`;
const formatCompactCurrency = (value: number): string =>
  `₹${compactCurrencyFormatter.format(value || 0)}`;

const getDateRangeLabel = (range: AnalyticsDateRange): string => {
  switch (range) {
    case 'today':
      return 'Today';
    case '7d':
      return 'Last 7 Days';
    case '30d':
      return 'Last 30 Days';
    case '90d':
      return 'Last 90 Days';
    case '6m':
      return 'Last 6 Months';
    case '12m':
      return 'Last 12 Months';
    case 'custom':
      return 'Custom Range';
    default:
      return 'Last 30 Days';
  }
};

const getTrendTone = (value: number): TrendTone => {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
};

const getMetricToneFromTrend = (value: number): MetricTone => {
  if (value > 0) return 'positive';
  if (value < 0) return 'danger';
  return 'default';
};

const getSuccessTone = (value: number, good = 70, warning = 40): TrendTone => {
  if (value >= good) return 'positive';
  if (value >= warning) return 'neutral';
  return 'negative';
};

const getMetricToneFromThreshold = (value: number, good = 70, warning = 40): MetricTone => {
  if (value >= good) return 'positive';
  if (value >= warning) return 'warning';
  return 'danger';
};

const toneColorMap: Record<TrendTone, string> = {
  positive: '#15803d',
  negative: '#b91c1c',
  neutral: '#475569',
};

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const getNumber = (source: unknown, keys: string[], fallback = 0): number => {
  const record = toRecord(source);

  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }

  return fallback;
};

const getString = (source: unknown, keys: string[], fallback = ''): string => {
  const record = toRecord(source);

  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return fallback;
};

const getArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const shellStyle: React.CSSProperties = {
  minHeight: '100%',
  background: '#f8fafc',
  padding: 24,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1600,
  margin: '0 auto',
  display: 'grid',
  gap: 20,
};

const surfaceStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 22,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
};

const subtleCardStyle: React.CSSProperties = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 18,
};

const inputStyle: React.CSSProperties = {
  height: 40,
  width: '100%',
  borderRadius: 12,
  border: '1px solid #dbe2ea',
  padding: '0 12px',
  fontSize: 14,
  outline: 'none',
  background: '#ffffff',
  color: '#0f172a',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  paddingRight: 32,
};

const primaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: '0 14px',
  borderRadius: 12,
  border: '1px solid #0f172a',
  background: '#0f172a',
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: '0 14px',
  borderRadius: 12,
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  color: '#0f172a',
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
};

const PageHero: React.FC<{
  title: string;
  subtitle: string;
  dateRangeLabel: string;
  compareEnabled: boolean;
}> = ({ title, subtitle, dateRangeLabel, compareEnabled }) => (
  <section
    style={{
      ...surfaceStyle,
      padding: 24,
      border: 'none',
      color: '#ffffff',
      background:
        'linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(29,78,216,0.96) 52%, rgba(30,64,175,0.92) 100%)',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ maxWidth: 860 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.10)',
            fontSize: 12,
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          <GitBranch size={14} />
          Pipeline Intelligence
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: -0.6,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: '12px 0 0',
            fontSize: 15,
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.82)',
            maxWidth: 760,
          }}
        >
          {subtitle}
        </p>
      </div>

      <div
        style={{
          minWidth: 280,
          display: 'grid',
          gap: 12,
        }}
      >
        <div
          style={{
            padding: 14,
            borderRadius: 18,
            background: 'rgba(255,255,255,0.10)',
          }}
        >
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)', marginBottom: 6 }}>
            Active Range
          </div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{dateRangeLabel}</div>
        </div>

        <div
          style={{
            padding: 14,
            borderRadius: 18,
            background: 'rgba(255,255,255,0.10)',
          }}
        >
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)', marginBottom: 6 }}>
            Compare Mode
          </div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>
            {compareEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Toolbar: React.FC<{
  filters: PipelinePageFilters;
  comparePeriod: PipelineComparePeriod;
  onDateRangeChange: (value: AnalyticsDateRange) => void;
  onSearchChange: (value: string) => void;
  onCompareToggle: () => void;
  onCompareTypeChange: (value: ComparePeriodType) => void;
  onRefresh: () => void;
  onReset: () => void;
  isRefreshing?: boolean;
}> = ({
  filters,
  comparePeriod,
  onDateRangeChange,
  onSearchChange,
  onCompareToggle,
  onCompareTypeChange,
  onRefresh,
  onReset,
  isRefreshing = false,
}) => (
  <section style={{ ...surfaceStyle, padding: 18 }}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}
    >
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 8 }}>
          Date Range
        </div>
        <select
          value={filters.dateRange}
          onChange={(e) => onDateRangeChange(e.target.value as AnalyticsDateRange)}
          style={selectStyle}
        >
          <option value="today">Today</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="6m">Last 6 Months</option>
          <option value="12m">Last 12 Months</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 8 }}>
          Search
        </div>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
            }}
          />
          <input
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pipeline, stage, team, owner..."
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 8 }}>
          Compare Against
        </div>
        <select
          value={comparePeriod.type}
          onChange={(e) => onCompareTypeChange(e.target.value as ComparePeriodType)}
          disabled={!comparePeriod.enabled}
          style={selectStyle}
        >
          <option value="previous_period">Previous Period</option>
          <option value="previous_month">Previous Month</option>
          <option value="previous_quarter">Previous Quarter</option>
          <option value="previous_year">Previous Year</option>
        </select>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'end',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <button type="button" onClick={onCompareToggle} style={secondaryButtonStyle}>
          <Filter size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          {comparePeriod.enabled ? 'Disable Compare' : 'Enable Compare'}
        </button>

        <button type="button" onClick={onRefresh} style={secondaryButtonStyle}>
          <RefreshCcw size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>

        <button type="button" onClick={onReset} style={primaryButtonStyle}>
          Reset
        </button>
      </div>
    </div>
  </section>
);

const StatusPanel: React.FC<{
  title: string;
  description: string;
  tone?: 'loading' | 'error' | 'empty';
  action?: React.ReactNode;
}> = ({ title, description, tone = 'loading', action }) => {
  const toneStyles =
    tone === 'error'
      ? {
          background: '#fff7f7',
          borderColor: '#fecaca',
          iconBg: '#fee2e2',
          iconColor: '#b91c1c',
          titleColor: '#7f1d1d',
          descriptionColor: '#991b1b',
        }
      : {
          background: '#ffffff',
          borderColor: '#e2e8f0',
          iconBg: '#f1f5f9',
          iconColor: '#0f172a',
          titleColor: '#0f172a',
          descriptionColor: '#64748b',
        };

  return (
    <div
      style={{
        ...surfaceStyle,
        padding: 32,
        background: toneStyles.background,
        borderColor: toneStyles.borderColor,
      }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: toneStyles.iconBg,
            color: toneStyles.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {tone === 'error' ? <AlertTriangle size={18} /> : <BarChart3 size={18} />}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 17,
              fontWeight: 900,
              color: toneStyles.titleColor,
              marginBottom: 6,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: toneStyles.descriptionColor,
            }}
          >
            {description}
          </div>

          {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ eyebrow, title, subtitle, action }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      alignItems: 'flex-start',
      marginBottom: 16,
    }}
  >
    <div>
      {eyebrow ? (
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            color: '#64748b',
            marginBottom: 6,
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{title}</h3>
      {subtitle ? (
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
          {subtitle}
        </p>
      ) : null}
    </div>
    {action ? <div>{action}</div> : null}
  </div>
);

const ChartCard: React.FC<{
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  minHeight?: number;
}> = ({ title, subtitle, eyebrow, action, children, minHeight = 280 }) => (
  <section
    style={{
      ...surfaceStyle,
      padding: 20,
      minHeight,
    }}
  >
    <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} action={action} />
    {children}
  </section>
);

const MetricPill: React.FC<{
  label: string;
  value: string;
  tone?: MetricTone;
}> = ({ label, value, tone = 'default' }) => {
  const color =
    tone === 'positive'
      ? '#15803d'
      : tone === 'warning'
        ? '#a16207'
        : tone === 'danger'
          ? '#b91c1c'
          : '#0f172a';

  return (
    <div style={{ ...subtleCardStyle, padding: 12 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#64748b',
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 900, color }}>{value}</div>
    </div>
  );
};

const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = '#0f172a' }) => {
  const safeValue = Math.max(0, Math.min(100, value || 0));

  return (
    <div
      style={{
        width: '100%',
        height: 10,
        borderRadius: 999,
        background: '#e2e8f0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${safeValue}%`,
          height: '100%',
          borderRadius: 999,
          background: color,
        }}
      />
    </div>
  );
};

const StatCard: React.FC<StatCardItem> = ({
  title,
  value,
  subtitle,
  trendText,
  trendTone = 'neutral',
  icon,
}) => (
  <div
    style={{
      ...surfaceStyle,
      padding: 20,
      minHeight: 148,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 10 }}>
          {title}
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
          {value}
        </div>
        {subtitle ? (
          <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>{subtitle}</div>
        ) : null}
      </div>

      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0f172a',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
    </div>

    {trendText ? (
      <div
        style={{
          marginTop: 16,
          fontSize: 13,
          fontWeight: 800,
          color: toneColorMap[trendTone],
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {trendTone === 'positive' ? <TrendingUp size={14} /> : null}
        {trendTone === 'negative' ? <TrendingDown size={14} /> : null}
        {trendText}
      </div>
    ) : null}
  </div>
);

const ExecutiveSummaryCard: React.FC<{
  totalDeals: number;
  pipelineValue: number;
  wonValue: number;
  avgDealSize: number;
  velocityDays: number;
  winRate: number;
  stageCount: number;
  riskDeals: number;
}> = ({
  totalDeals,
  pipelineValue,
  wonValue,
  avgDealSize,
  velocityDays,
  winRate,
  stageCount,
  riskDeals,
}) => (
  <ChartCard
    eyebrow="Executive"
    title="Pipeline Summary"
    subtitle="A quick operating read on value, stage depth, velocity, and closure strength."
    minHeight={200}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}
    >
      <MetricPill label="Active Deals" value={formatNumber(totalDeals)} />
      <MetricPill label="Pipeline Value" value={formatCompactCurrency(pipelineValue)} tone="positive" />
      <MetricPill label="Won Value" value={formatCompactCurrency(wonValue)} tone="positive" />
      <MetricPill label="Avg Deal Size" value={formatCompactCurrency(avgDealSize)} />
      <MetricPill
        label="Velocity"
        value={`${formatNumber(velocityDays)} days`}
        tone={velocityDays <= 20 ? 'positive' : velocityDays <= 45 ? 'warning' : 'danger'}
      />
      <MetricPill
        label="Win Rate"
        value={formatPercent(winRate)}
        tone={winRate >= 35 ? 'positive' : winRate >= 18 ? 'warning' : 'danger'}
      />
      <MetricPill label="Stages" value={formatNumber(stageCount)} />
      <MetricPill
        label="Risk Deals"
        value={formatNumber(riskDeals)}
        tone={riskDeals <= 5 ? 'positive' : riskDeals <= 15 ? 'warning' : 'danger'}
      />
    </div>
  </ChartCard>
);

const StageDistributionCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Stages"
    title="Stage Distribution"
    subtitle="See where your pipeline weight is concentrated and where momentum is getting stuck."
    action={
      <button type="button" style={secondaryButtonStyle}>
        <Download size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
        Export
      </button>
    }
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const label = getString(item, ['stageName', 'label', 'name'], `Stage ${index + 1}`);
        const count = getNumber(item, ['count', 'dealCount', 'totalDeals']);
        const value = getNumber(item, ['value', 'pipelineValue', 'amount']);
        const share = getNumber(item, ['share', 'percentage', 'stageShare']);
        const avgAge = getNumber(item, ['avgAge', 'averageAge', 'avgDays']);

        return (
          <div key={`${label}-${index}`} style={{ ...subtleCardStyle, padding: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                alignItems: 'flex-start',
                marginBottom: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{label}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  {formatNumber(count)} deals · {formatCompactCurrency(value)}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>
                {formatPercent(share)}
              </div>
            </div>

            <ProgressBar value={share} color="#1d4ed8" />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Deals" value={formatNumber(count)} />
              <MetricPill label="Value" value={formatCompactCurrency(value)} tone="positive" />
              <MetricPill
                label="Avg Age"
                value={`${formatNumber(avgAge)}d`}
                tone={avgAge <= 15 ? 'positive' : avgAge <= 35 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const ConversionFlowCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Conversion"
    title="Stage-to-Stage Conversion"
    subtitle="Track movement quality across stage transitions and spot weak links in the funnel."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 7).map((item, index) => {
        const fromStage = getString(item, ['fromStage', 'from', 'sourceStage'], `Stage ${index + 1}`);
        const toStage = getString(item, ['toStage', 'to', 'targetStage'], `Stage ${index + 2}`);
        const rate = getNumber(item, ['conversionRate', 'rate', 'percentage']);
        const count = getNumber(item, ['count', 'dealCount', 'movedDeals']);
        const dropOff = getNumber(item, ['dropOffRate', 'lossRate', 'dropRate']);

        return (
          <div key={`${fromStage}-${toStage}-${index}`} style={{ ...subtleCardStyle, padding: 14 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{fromStage}</span>
                <ArrowRight size={14} color="#64748b" />
                <span style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{toStage}</span>
              </div>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: rate >= 45 ? '#15803d' : rate >= 20 ? '#a16207' : '#b91c1c',
                }}
              >
                {formatPercent(rate)}
              </div>
            </div>

            <ProgressBar
              value={rate}
              color={rate >= 45 ? '#15803d' : rate >= 20 ? '#a16207' : '#b91c1c'}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Moved" value={formatNumber(count)} />
              <MetricPill
                label="Rate"
                value={formatPercent(rate)}
                tone={rate >= 45 ? 'positive' : rate >= 20 ? 'warning' : 'danger'}
              />
              <MetricPill
                label="Drop-off"
                value={formatPercent(dropOff)}
                tone={dropOff <= 20 ? 'positive' : dropOff <= 40 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const VelocityInsightsCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Velocity"
    title="Velocity Insights"
    subtitle="Understand which stages are moving fast and which ones are quietly draining close speed."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const label = getString(item, ['stageName', 'label', 'name'], `Stage ${index + 1}`);
        const avgDays = getNumber(item, ['avgDays', 'averageDays', 'velocityDays']);
        const targetDays = getNumber(item, ['targetDays', 'benchmarkDays'], 0);
        const count = getNumber(item, ['dealCount', 'count', 'deals']);
        const adherence =
          targetDays > 0 ? Math.max(0, Math.min(100, (targetDays / Math.max(avgDays, 1)) * 100)) : 0;

        return (
          <div key={`${label}-${index}`} style={{ ...subtleCardStyle, padding: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{label}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  {formatNumber(count)} deals in stage
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: avgDays <= targetDays || targetDays === 0 ? '#15803d' : '#b91c1c',
                }}
              >
                {formatNumber(avgDays)}d
              </div>
            </div>

            <ProgressBar
              value={adherence}
              color={adherence >= 70 ? '#15803d' : adherence >= 40 ? '#a16207' : '#b91c1c'}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Avg Days" value={`${formatNumber(avgDays)}d`} />
              <MetricPill label="Target" value={`${formatNumber(targetDays)}d`} />
              <MetricPill
                label="Adherence"
                value={formatPercent(adherence)}
                tone={adherence >= 70 ? 'positive' : adherence >= 40 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const RiskInsightsCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Risk"
    title="Pipeline Risk Watch"
    subtitle="Monitor deals and stages carrying elevated risk so the team can intervene early."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const label = getString(item, ['label', 'dealName', 'stageName', 'name'], `Risk ${index + 1}`);
        const riskScore = getNumber(item, ['riskScore', 'score']);
        const value = getNumber(item, ['value', 'pipelineValue', 'amount']);
        const age = getNumber(item, ['ageDays', 'daysOpen', 'avgAge']);
        const owner = getString(item, ['ownerName', 'owner', 'assignee'], 'Unassigned');

        return (
          <div key={`${label}-${index}`} style={{ ...subtleCardStyle, padding: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{label}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  Owner: {owner}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: riskScore >= 70 ? '#b91c1c' : riskScore >= 40 ? '#a16207' : '#15803d',
                }}
              >
                {formatNumber(riskScore)}
              </div>
            </div>

            <ProgressBar
              value={riskScore}
              color={riskScore >= 70 ? '#b91c1c' : riskScore >= 40 ? '#a16207' : '#15803d'}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Value" value={formatCompactCurrency(value)} />
              <MetricPill
                label="Risk"
                value={formatNumber(riskScore)}
                tone={riskScore >= 70 ? 'danger' : riskScore >= 40 ? 'warning' : 'positive'}
              />
              <MetricPill
                label="Age"
                value={`${formatNumber(age)}d`}
                tone={age <= 15 ? 'positive' : age <= 35 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const PipelineAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState<PipelinePageFilters>(DEFAULT_FILTERS);
  const [comparePeriod, setComparePeriod] = useState<PipelineComparePeriod>(DEFAULT_COMPARE_PERIOD);

  const sharedFilters = useMemo(
    () => ({
      dateRange: filters.dateRange,
      startDate: filters.startDate,
      endDate: filters.endDate,
      pipelineIds: filters.pipelineIds,
      stageIds: filters.stageIds,
      ownerIds: filters.ownerIds,
      teamIds: filters.teamIds,
      sourceIds: filters.sourceIds,
      projectIds: filters.projectIds,
      locationIds: filters.locationIds,
      search: filters.search,
    }),
    [filters],
  );

  const sharedComparePeriod = useMemo(
    () => ({
      enabled: comparePeriod.enabled,
      type: comparePeriod.type,
    }),
    [comparePeriod],
  );

  const pipelineAnalytics = usePipelineAnalytics({
    initialFilters: sharedFilters,
    initialComparePeriod: sharedComparePeriod,
    useMockOnError: true,
  });

  const data = pipelineAnalytics.data;
  const summary = data?.summary;

  const stageDistribution = getArray<unknown>(toRecord(data).stageDistribution);
  const conversionFlow = getArray<unknown>(toRecord(data).conversionFlow);
  const velocityInsights = getArray<unknown>(toRecord(data).velocityInsights);
  const riskInsights = getArray<unknown>(toRecord(data).riskInsights);

  const totalDeals = getNumber(summary, ['totalDeals', 'dealCount', 'activeDeals']);
  const pipelineValue = getNumber(summary, ['pipelineValue', 'totalValue', 'amount']);
  const wonValue = getNumber(summary, ['wonValue', 'closedWonValue', 'convertedValue']);
  const avgDealSize = getNumber(summary, ['avgDealSize', 'averageDealSize']);
  const velocityDays = getNumber(summary, ['velocityDays', 'avgVelocityDays', 'averageDays']);
  const winRate = getNumber(summary, ['winRate', 'conversionRate', 'closeRate']);
  const riskDeals = getNumber(summary, ['riskDeals', 'highRiskDeals', 'atRiskDeals']);
  const stageCount = stageDistribution.length;

  const stageMovement = getNumber(summary, ['stageMovementRate', 'movementRate'], 0);
  const dealGrowth = getNumber(summary, ['dealGrowthRate', 'growthRate', 'changePercent'], 0);
  const stuckDeals = getNumber(summary, ['stuckDeals', 'delayedDeals'], 0);
  const forecastAccuracy = getNumber(summary, ['forecastAccuracy', 'accuracyRate'], 0);

  const isLoading = pipelineAnalytics.isLoading;
  const isRefreshing = pipelineAnalytics.isRefreshing;
  const error = pipelineAnalytics.error;
  const hasAnyData = Boolean(data);

  const handleDateRangeChange = useCallback((value: AnalyticsDateRange) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: value,
    }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  }, []);

  const handleCompareToggle = useCallback(() => {
    setComparePeriod((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  }, []);

  const handleCompareTypeChange = useCallback((value: ComparePeriodType) => {
    setComparePeriod((prev) => ({
      ...prev,
      type: value,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setComparePeriod(DEFAULT_COMPARE_PERIOD);
  }, []);

  const handleRefresh = useCallback(async () => {
    await pipelineAnalytics.refetch();
  }, [pipelineAnalytics]);

  const statCards = useMemo<StatCardItem[]>(
    () => [
      {
        key: 'pipeline-value',
        title: 'Pipeline Value',
        value: formatCompactCurrency(pipelineValue),
        subtitle: `${formatNumber(totalDeals)} active deals`,
        trendText: `${formatPercent(dealGrowth)} deal growth`,
        trendTone: getTrendTone(dealGrowth),
        icon: <BarChart3 size={20} />,
      },
      {
        key: 'win-rate',
        title: 'Win Rate',
        value: formatPercent(winRate),
        subtitle: `${formatCompactCurrency(wonValue)} won value`,
        trendText:
          winRate >= 35 ? 'Strong close health' : winRate >= 18 ? 'Mid close strength' : 'Weak close signal',
        trendTone: getSuccessTone(winRate, 35, 18),
        icon: <Target size={20} />,
      },
      {
        key: 'velocity',
        title: 'Pipeline Velocity',
        value: `${formatNumber(velocityDays)}d`,
        subtitle: `${formatNumber(stageCount)} active stages`,
        trendText:
          velocityDays <= 20 ? 'Fast-moving pipeline' : velocityDays <= 45 ? 'Moderate stage speed' : 'Slow-moving pipeline',
        trendTone: velocityDays <= 20 ? 'positive' : velocityDays <= 45 ? 'neutral' : 'negative',
        icon: <Gauge size={20} />,
      },
      {
        key: 'risk',
        title: 'Risk Pressure',
        value: formatNumber(riskDeals),
        subtitle: `${formatNumber(stuckDeals)} stuck deals`,
        trendText: `${formatPercent(forecastAccuracy)} forecast accuracy`,
        trendTone: getSuccessTone(forecastAccuracy, 75, 45),
        icon: <ShieldAlert size={20} />,
      },
    ],
    [
      pipelineValue,
      totalDeals,
      dealGrowth,
      winRate,
      wonValue,
      velocityDays,
      stageCount,
      riskDeals,
      stuckDeals,
      forecastAccuracy,
    ],
  );

  return (
    <div style={shellStyle}>
      <div style={containerStyle}>
        <PageHero
          title="Pipeline Analytics"
          subtitle="Measure stage health, conversion flow, velocity drag, and risk concentration with a pipeline dashboard built for high-clarity decision making."
          dateRangeLabel={getDateRangeLabel(filters.dateRange)}
          compareEnabled={comparePeriod.enabled}
        />

        <Toolbar
          filters={filters}
          comparePeriod={comparePeriod}
          onDateRangeChange={handleDateRangeChange}
          onSearchChange={handleSearchChange}
          onCompareToggle={handleCompareToggle}
          onCompareTypeChange={handleCompareTypeChange}
          onRefresh={handleRefresh}
          onReset={handleReset}
          isRefreshing={isRefreshing}
        />

        {isLoading && !hasAnyData ? (
          <StatusPanel
            title="Loading pipeline analytics"
            description="Stage depth, conversion flow, velocity, and risk insights are being prepared."
            tone="loading"
          />
        ) : null}

        {!isLoading && error && !hasAnyData ? (
          <StatusPanel
            title="Unable to load pipeline analytics"
            description={error}
            tone="error"
            action={
              <button type="button" onClick={handleRefresh} style={primaryButtonStyle}>
                Retry
              </button>
            }
          />
        ) : null}

        {!isLoading && !error && !hasAnyData ? (
          <StatusPanel
            title="No pipeline data available"
            description="Try changing the current filters or date range to reveal stage, conversion, and risk insights."
            tone="empty"
          />
        ) : null}

        {hasAnyData ? (
          <>
            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 16,
              }}
            >
              {statCards.map((card) => (
                <StatCard
                  key={card.key}
                  title={card.title}
                  value={card.value}
                  subtitle={card.subtitle}
                  trendText={card.trendText}
                  trendTone={card.trendTone}
                  icon={card.icon}
                />
              ))}
            </section>

            <ExecutiveSummaryCard
              totalDeals={totalDeals}
              pipelineValue={pipelineValue}
              wonValue={wonValue}
              avgDealSize={avgDealSize}
              velocityDays={velocityDays}
              winRate={winRate}
              stageCount={stageCount}
              riskDeals={riskDeals}
            />

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: '1.05fr 0.95fr',
                gap: 16,
              }}
            >
              <StageDistributionCard items={stageDistribution} />
              <ConversionFlowCard items={conversionFlow} />
            </section>

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              <VelocityInsightsCard items={velocityInsights} />
              <RiskInsightsCard items={riskInsights} />
            </section>

            <section
              style={{
                ...surfaceStyle,
                padding: 20,
              }}
            >
              <SectionHeader
                eyebrow="Signals"
                title="Pipeline Intelligence Notes"
                subtitle="A compact read on movement quality, stage pressure, and risk posture."
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 12,
                }}
              >
                <MetricPill
                  label="Stage Movement Rate"
                  value={formatPercent(stageMovement)}
                  tone={getMetricToneFromThreshold(stageMovement, 55, 28)}
                />
                <MetricPill
                  label="Forecast Accuracy"
                  value={formatPercent(forecastAccuracy)}
                  tone={getMetricToneFromThreshold(forecastAccuracy, 75, 45)}
                />
                <MetricPill
                  label="Stuck Deals"
                  value={formatNumber(stuckDeals)}
                  tone={stuckDeals <= 6 ? 'positive' : stuckDeals <= 15 ? 'warning' : 'danger'}
                />
                <MetricPill
                  label="Deal Growth"
                  value={formatPercent(dealGrowth)}
                  tone={getMetricToneFromTrend(dealGrowth)}
                />
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 12,
                }}
              >
                <div style={{ ...subtleCardStyle, padding: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <Activity size={16} color="#1d4ed8" />
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>Movement Read</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b' }}>
                    {stageMovement >= 55
                      ? 'Pipeline movement looks healthy. Deals are flowing with decent stage continuity.'
                      : stageMovement >= 28
                        ? 'Movement is moderate. A few stages likely need follow-up discipline and owner accountability.'
                        : 'Movement looks weak. Pipeline drag is building and stage stagnation needs intervention.'}
                  </div>
                </div>

                <div style={{ ...subtleCardStyle, padding: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <ShieldAlert size={16} color="#b91c1c" />
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>Risk Read</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b' }}>
                    {riskDeals <= 5
                      ? 'Risk pressure is under control. Team attention can stay focused on acceleration and close quality.'
                      : riskDeals <= 15
                        ? 'Risk is present but manageable. Prioritize aging deals and delayed stage transitions.'
                        : 'Risk is elevated. High-risk concentration suggests follow-up leaks, weak qualification, or stalled negotiation loops.'}
                  </div>
                </div>

                <div style={{ ...subtleCardStyle, padding: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <Gauge size={16} color="#15803d" />
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>Velocity Read</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b' }}>
                    {velocityDays <= 20
                      ? 'Velocity is strong. Keep stage definitions clear and double down on high-intent follow-ups.'
                      : velocityDays <= 45
                        ? 'Velocity is acceptable, but some stage dwell time is likely slowing the final close window.'
                        : 'Velocity is slow. Tighten stage exit rules, sales manager reviews, and aging-deal escalation.'}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PipelineAnalyticsPage;