import React, { useCallback, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Download,
  Filter,
  RefreshCcw,
  Target,
  UserCheck,
  Users,
} from 'lucide-react';

import useLeadAnalytics from '../../hooks/analytics/useLeadAnalytics';

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

interface LeadPageFilters {
  dateRange: AnalyticsDateRange;
  startDate?: string;
  endDate?: string;
  teamIds: string[];
  ownerIds: string[];
  sourceIds: string[];
  campaignIds: string[];
  locationIds: string[];
  statusIds: string[];
  search: string;
}

interface LeadComparePeriod {
  enabled: boolean;
  type: ComparePeriodType;
}

const DEFAULT_FILTERS: LeadPageFilters = {
  dateRange: '30d',
  teamIds: [],
  ownerIds: [],
  sourceIds: [],
  campaignIds: [],
  locationIds: [],
  statusIds: [],
  search: '',
};

const DEFAULT_COMPARE_PERIOD: LeadComparePeriod = {
  enabled: true,
  type: 'previous_period',
};

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const formatCurrency = (value: number): string => `₹${currencyFormatter.format(value || 0)}`;
const formatCompactCurrency = (value: number): string =>
  `₹${compactCurrencyFormatter.format(value || 0)}`;
const formatNumber = (value: number): string => numberFormatter.format(value || 0);
const formatPercent = (value: number): string => `${percentFormatter.format(value || 0)}%`;

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

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const getNumber = (source: unknown, keys: string[], fallback = 0): number => {
  const record = toRecord(source);

  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }

  return fallback;
};

const getString = (source: unknown, keys: string[], fallback = ''): string => {
  const record = toRecord(source);

  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value;
  }

  return fallback;
};

const getArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const surfaceStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 22,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
};

const subtleSurfaceStyle: React.CSSProperties = {
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

const buttonPrimaryStyle: React.CSSProperties = {
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

const buttonSecondaryStyle: React.CSSProperties = {
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

const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      minHeight: '100%',
      background: '#f8fafc',
      padding: 24,
    }}
  >
    <div
      style={{
        maxWidth: 1600,
        margin: '0 auto',
        display: 'grid',
        gap: 20,
      }}
    >
      {children}
    </div>
  </div>
);

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
        'linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 48%, rgba(51,65,85,1) 100%)',
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
            background: 'rgba(255,255,255,0.08)',
            fontSize: 12,
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          <Users size={14} />
          Lead Intelligence
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
          display: 'grid',
          gap: 12,
          minWidth: 280,
        }}
      >
        <div
          style={{
            padding: 14,
            borderRadius: 18,
            background: 'rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>
            Active Range
          </div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{dateRangeLabel}</div>
        </div>

        <div
          style={{
            padding: 14,
            borderRadius: 18,
            background: 'rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>
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
  filters: LeadPageFilters;
  comparePeriod: LeadComparePeriod;
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
  <section
    style={{
      ...surfaceStyle,
      padding: 18,
    }}
  >
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
        <input
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search source, owner, campaign..."
          style={inputStyle}
        />
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
        <button type="button" onClick={onCompareToggle} style={buttonSecondaryStyle}>
          <Filter size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          {comparePeriod.enabled ? 'Disable Compare' : 'Enable Compare'}
        </button>

        <button type="button" onClick={onRefresh} style={buttonSecondaryStyle}>
          <RefreshCcw size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>

        <button type="button" onClick={onReset} style={buttonPrimaryStyle}>
          Reset
        </button>
      </div>
    </div>
  </section>
);

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

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
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
          background: '#0f172a',
        }}
      />
    </div>
  );
};

const MetricPill: React.FC<{
  label: string;
  value: string;
  tone?: 'default' | 'positive' | 'warning' | 'danger';
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
    <div style={{ ...subtleSurfaceStyle, padding: 12 }}>
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

const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle?: string;
  trendText?: string;
  trendTone?: TrendTone;
  icon: React.ReactNode;
}> = ({ title, value, subtitle, trendText, trendTone = 'neutral', icon }) => {
  const toneColor =
    trendTone === 'positive'
      ? '#15803d'
      : trendTone === 'negative'
        ? '#b91c1c'
        : '#475569';

  return (
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
        <div style={{ marginTop: 16, fontSize: 13, fontWeight: 800, color: toneColor }}>
          {trendText}
        </div>
      ) : null}
    </div>
  );
};

const SourcePerformanceCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Sources"
    title="Lead Source Performance"
    subtitle="Which channels are creating high-quality lead flow."
    action={
      <button type="button" style={buttonSecondaryStyle}>
        <Download size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
        Export
      </button>
    }
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['sourceName', 'label', 'name'], `Source ${index + 1}`);
        const leadCount = getNumber(item, ['leadCount', 'count', 'totalLeads']);
        const qualifiedCount = getNumber(item, ['qualifiedCount', 'qualifiedLeads']);
        const conversionRate = getNumber(item, ['conversionRate', 'qualificationRate', 'rate']);
        const pipelineValue = getNumber(item, ['pipelineValue', 'value', 'revenueValue']);

        return (
          <div key={`${label}-${index}`} style={{ ...subtleSurfaceStyle, padding: 14 }}>
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
                  {formatNumber(leadCount)} leads · {formatNumber(qualifiedCount)} qualified
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>
                {formatCompactCurrency(pipelineValue)}
              </div>
            </div>

            <ProgressBar value={conversionRate} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Leads" value={formatNumber(leadCount)} />
              <MetricPill label="Qualified" value={formatNumber(qualifiedCount)} />
              <MetricPill
                label="Rate"
                value={formatPercent(conversionRate)}
                tone={conversionRate >= 35 ? 'positive' : conversionRate >= 15 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const FunnelBreakdownCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Funnel"
    title="Lead Funnel Breakdown"
    subtitle="Stage-wise movement from lead capture to closure intent."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['stageName', 'label', 'name'], `Stage ${index + 1}`);
        const count = getNumber(item, ['count', 'leadCount', 'total']);
        const dropOffRate = getNumber(item, ['dropOffRate', 'lossRate']);
        const progressionRate = getNumber(item, ['progressionRate', 'conversionRate', 'rate']);

        return (
          <div key={`${label}-${index}`} style={{ ...subtleSurfaceStyle, padding: 14 }}>
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
                  {formatNumber(count)} leads in stage
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: progressionRate >= 50 ? '#15803d' : '#a16207',
                }}
              >
                {formatPercent(progressionRate)}
              </div>
            </div>

            <ProgressBar value={progressionRate} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Volume" value={formatNumber(count)} />
              <MetricPill
                label="Progress"
                value={formatPercent(progressionRate)}
                tone={progressionRate >= 50 ? 'positive' : 'warning'}
              />
              <MetricPill
                label="Drop Off"
                value={formatPercent(dropOffRate)}
                tone={dropOffRate >= 30 ? 'danger' : 'warning'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const OwnerCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Owners"
    title="Lead Owner Performance"
    subtitle="Who is moving the most leads and qualifying best."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['ownerName', 'name', 'owner'], `Owner ${index + 1}`);
        const totalLeads = getNumber(item, ['leadCount', 'totalLeads', 'count']);
        const qualifiedLeads = getNumber(item, ['qualifiedCount', 'qualifiedLeads']);
        const responseRate = getNumber(item, ['responseRate', 'contactRate', 'rate']);
        const conversionRate = getNumber(item, ['conversionRate', 'qualificationRate']);

        return (
          <div
            key={`${label}-${index}`}
            style={{
              ...subtleSurfaceStyle,
              padding: 14,
              display: 'grid',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#15803d' }}>
                {formatPercent(conversionRate)}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 10,
              }}
            >
              <MetricPill label="Leads" value={formatNumber(totalLeads)} />
              <MetricPill label="Qualified" value={formatNumber(qualifiedLeads)} />
              <MetricPill label="Response" value={formatPercent(responseRate)} />
              <MetricPill
                label="Conversion"
                value={formatPercent(conversionRate)}
                tone={conversionRate >= 35 ? 'positive' : 'warning'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const WarningCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Signals"
    title="Lead Risk & Delay Signals"
    subtitle="Where lead quality, speed, or conversion momentum is falling."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['label', 'riskName', 'name'], `Signal ${index + 1}`);
        const severity = getString(item, ['severity', 'level'], 'medium').toLowerCase();
        const impactedLeads = getNumber(item, ['impactedLeads', 'leadCount', 'count']);
        const impactRate = getNumber(item, ['impactRate', 'dropRate', 'rate']);

        const toneColor =
          severity === 'critical'
            ? '#b91c1c'
            : severity === 'high'
              ? '#c2410c'
              : severity === 'medium'
                ? '#a16207'
                : '#15803d';

        return (
          <div key={`${label}-${index}`} style={{ ...subtleSurfaceStyle, padding: 14 }}>
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
                  {formatNumber(impactedLeads)} impacted leads
                </div>
              </div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: toneColor,
                  textTransform: 'uppercase',
                }}
              >
                {severity}
              </div>
            </div>

            <MetricPill
              label="Impact Rate"
              value={formatPercent(impactRate)}
              tone={impactRate >= 30 ? 'danger' : 'warning'}
            />
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const ExecutiveSummaryCard: React.FC<{
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  qualificationRate: number;
  conversionRate: number;
  pipelineValue: number;
}> = ({
  totalLeads,
  qualifiedLeads,
  convertedLeads,
  qualificationRate,
  conversionRate,
  pipelineValue,
}) => (
  <ChartCard
    eyebrow="Executive"
    title="Lead Summary"
    subtitle="Quick read of volume, quality, conversion, and value."
    minHeight={200}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}
    >
      <MetricPill label="Total Leads" value={formatNumber(totalLeads)} />
      <MetricPill label="Qualified Leads" value={formatNumber(qualifiedLeads)} tone="positive" />
      <MetricPill label="Converted Leads" value={formatNumber(convertedLeads)} tone="positive" />
      <MetricPill
        label="Qualification Rate"
        value={formatPercent(qualificationRate)}
        tone={qualificationRate >= 35 ? 'positive' : qualificationRate >= 15 ? 'warning' : 'danger'}
      />
      <MetricPill
        label="Conversion Rate"
        value={formatPercent(conversionRate)}
        tone={conversionRate >= 20 ? 'positive' : conversionRate >= 10 ? 'warning' : 'danger'}
      />
      <MetricPill label="Pipeline Value" value={formatCompactCurrency(pipelineValue)} tone="positive" />
    </div>
  </ChartCard>
);

const LeadAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState<LeadPageFilters>(DEFAULT_FILTERS);
  const [comparePeriod, setComparePeriod] = useState<LeadComparePeriod>(DEFAULT_COMPARE_PERIOD);

  const sharedFilters = useMemo(
    () => ({
      dateRange: filters.dateRange,
      startDate: filters.startDate,
      endDate: filters.endDate,
      teamIds: filters.teamIds,
      ownerIds: filters.ownerIds,
      sourceIds: filters.sourceIds,
      campaignIds: filters.campaignIds,
      locationIds: filters.locationIds,
      statusIds: filters.statusIds,
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

  const leadAnalytics = useLeadAnalytics({
    initialFilters: sharedFilters,
    initialComparePeriod: sharedComparePeriod,
    useMockOnError: true,
  });

  const data = leadAnalytics.data;
  const summary = data?.summary;

  const sourceItems = getArray<unknown>(toRecord(data).sourcePerformance);
  const funnelItems = getArray<unknown>(toRecord(data).funnelBreakdown);
  const ownerItems = getArray<unknown>(toRecord(data).ownerPerformance);
  const warningItems = getArray<unknown>(toRecord(data).risks);

  const totalLeads = getNumber(summary, ['totalLeads', 'leadCount', 'count']);
  const qualifiedLeads = getNumber(summary, ['qualifiedLeads', 'qualifiedCount']);
  const convertedLeads = getNumber(summary, ['convertedLeads', 'closedLeads', 'wonLeads']);
  const qualificationRate = getNumber(summary, ['qualificationRate', 'qualifiedRate']);
  const conversionRate = getNumber(summary, ['conversionRate', 'leadToCustomerRate']);
  const pipelineValue = getNumber(summary, ['pipelineValue', 'leadValue', 'revenueValue']);
  const growthRate = getNumber(summary, ['growthRate', 'leadGrowthRate', 'changePercent']);
  const responseRate = getNumber(summary, ['responseRate', 'contactRate']);
  const avgQualificationTime = getNumber(summary, ['avgQualificationTime', 'averageQualificationTime']);
  const costPerLead = getNumber(summary, ['costPerLead', 'cpl']);

  const hasAnyData = Boolean(data);
  const isLoading = leadAnalytics.isLoading;
  const isRefreshing = leadAnalytics.isRefreshing;
  const error = leadAnalytics.error;

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
    await leadAnalytics.refetch();
  }, [leadAnalytics]);

  const statCards = useMemo(
    () => [
      {
        key: 'total-leads',
        title: 'Total Leads',
        value: formatNumber(totalLeads),
        subtitle: `${formatNumber(qualifiedLeads)} qualified leads`,
        trendText: `${formatPercent(growthRate)} growth`,
        trendTone: getTrendTone(growthRate) as TrendTone,
        icon: <Users size={20} />,
      },
      {
        key: 'qualification-rate',
        title: 'Qualification Rate',
        value: formatPercent(qualificationRate),
        subtitle: `${formatNumber(convertedLeads)} converted leads`,
        trendText:
          qualificationRate >= 35
            ? 'Healthy lead quality'
            : qualificationRate >= 15
              ? 'Moderate lead quality'
              : 'Low qualification quality',
        trendTone:
          qualificationRate >= 35
            ? ('positive' as TrendTone)
            : qualificationRate >= 15
              ? ('neutral' as TrendTone)
              : ('negative' as TrendTone),
        icon: <Target size={20} />,
      },
      {
        key: 'response-rate',
        title: 'Response Rate',
        value: formatPercent(responseRate),
        subtitle: `Avg qualification ${formatNumber(avgQualificationTime)} hrs`,
        trendText:
          responseRate >= 60
            ? 'Fast lead engagement'
            : responseRate >= 35
              ? 'Response needs work'
              : 'Urgent follow-up gap',
        trendTone:
          responseRate >= 60
            ? ('positive' as TrendTone)
            : responseRate >= 35
              ? ('neutral' as TrendTone)
              : ('negative' as TrendTone),
        icon: <UserCheck size={20} />,
      },
      {
        key: 'cost-per-lead',
        title: 'Cost Per Lead',
        value: formatCurrency(costPerLead),
        subtitle: `Pipeline ${formatCompactCurrency(pipelineValue)}`,
        trendText:
          costPerLead > 0
            ? 'Watch acquisition efficiency'
            : 'Acquisition cost not available',
        trendTone: costPerLead > 0 ? ('neutral' as TrendTone) : ('negative' as TrendTone),
        icon: <Activity size={20} />,
      },
    ],
    [
      avgQualificationTime,
      convertedLeads,
      costPerLead,
      growthRate,
      pipelineValue,
      qualificationRate,
      qualifiedLeads,
      responseRate,
      totalLeads,
    ],
  );

  return (
    <PageShell>
      <PageHero
        title="Lead Analytics"
        subtitle="See how lead volume, quality, source mix, owner productivity, and funnel movement are really behaving — so growth comes from signal, not noise."
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
          title="Loading lead analytics"
          description="Lead quality, funnel movement, source contribution, and owner performance are being assembled."
          tone="loading"
        />
      ) : null}

      {!isLoading && error && !hasAnyData ? (
        <StatusPanel
          title="Unable to load lead analytics"
          description={error}
          tone="error"
          action={
            <button type="button" onClick={handleRefresh} style={buttonPrimaryStyle}>
              Retry
            </button>
          }
        />
      ) : null}

      {!isLoading && !error && !hasAnyData ? (
        <StatusPanel
          title="No lead data available"
          description="Try changing the active filters or date range to surface lead records."
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
            totalLeads={totalLeads}
            qualifiedLeads={qualifiedLeads}
            convertedLeads={convertedLeads}
            qualificationRate={qualificationRate}
            conversionRate={conversionRate}
            pipelineValue={pipelineValue}
          />

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: 16,
            }}
          >
            <SourcePerformanceCard items={sourceItems} />
            <FunnelBreakdownCard items={funnelItems} />
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
            }}
          >
            <OwnerCard items={ownerItems} />
            <WarningCard items={warningItems} />
          </section>
        </>
      ) : null}
    </PageShell>
  );
};

export default LeadAnalyticsPage;