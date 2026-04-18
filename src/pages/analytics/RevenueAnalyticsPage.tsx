import React, { useCallback, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  Download,
  Filter,
  IndianRupee,
  LineChart,
  MapPin,
  RefreshCcw,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';

import useRevenueAnalytics from '../../hooks/analytics/useRevenueAnalytics';

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

interface RevenuePageFilters {
  dateRange: AnalyticsDateRange;
  startDate?: string;
  endDate?: string;
  ownerIds: string[];
  teamIds: string[];
  sourceIds: string[];
  projectIds: string[];
  locationIds: string[];
  channelIds: string[];
  search: string;
}

interface RevenueComparePeriod {
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

const DEFAULT_FILTERS: RevenuePageFilters = {
  dateRange: '30d',
  ownerIds: [],
  teamIds: [],
  sourceIds: [],
  projectIds: [],
  locationIds: [],
  channelIds: [],
  search: '',
};

const DEFAULT_COMPARE_PERIOD: RevenueComparePeriod = {
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

const getMetricToneByThreshold = (
  value: number,
  goodThreshold: number,
  warningThreshold: number,
): MetricTone => {
  if (value >= goodThreshold) return 'positive';
  if (value >= warningThreshold) return 'warning';
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
        'linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(5,150,105,0.94) 52%, rgba(13,148,136,0.92) 100%)',
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
          <IndianRupee size={14} />
          Revenue Intelligence
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
  filters: RevenuePageFilters;
  comparePeriod: RevenueComparePeriod;
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
            placeholder="Search owner, location, project, channel..."
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
  totalRevenue: number;
  closedRevenue: number;
  avgRevenuePerDeal: number;
  targetRevenue: number;
  collectedRevenue: number;
  outstandingRevenue: number;
  dealsCount: number;
  growthRate: number;
}> = ({
  totalRevenue,
  closedRevenue,
  avgRevenuePerDeal,
  targetRevenue,
  collectedRevenue,
  outstandingRevenue,
  dealsCount,
  growthRate,
}) => (
  <ChartCard
    eyebrow="Executive"
    title="Revenue Summary"
    subtitle="A top-level commercial view of revenue generation, collection strength, and target progress."
    minHeight={200}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}
    >
      <MetricPill label="Total Revenue" value={formatCompactCurrency(totalRevenue)} tone="positive" />
      <MetricPill label="Closed Revenue" value={formatCompactCurrency(closedRevenue)} tone="positive" />
      <MetricPill label="Avg / Deal" value={formatCompactCurrency(avgRevenuePerDeal)} />
      <MetricPill label="Target Revenue" value={formatCompactCurrency(targetRevenue)} />
      <MetricPill
        label="Collected Revenue"
        value={formatCompactCurrency(collectedRevenue)}
        tone="positive"
      />
      <MetricPill
        label="Outstanding"
        value={formatCompactCurrency(outstandingRevenue)}
        tone={outstandingRevenue <= totalRevenue * 0.15 ? 'positive' : outstandingRevenue <= totalRevenue * 0.35 ? 'warning' : 'danger'}
      />
      <MetricPill label="Revenue Deals" value={formatNumber(dealsCount)} />
      <MetricPill
        label="Growth Rate"
        value={formatPercent(growthRate)}
        tone={getMetricToneFromTrend(growthRate)}
      />
    </div>
  </ChartCard>
);

const RevenueTrendCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Trend"
    title="Revenue Trend"
    subtitle="Track revenue flow across time and understand whether momentum is building or fading."
    action={
      <button type="button" style={secondaryButtonStyle}>
        <Download size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
        Export
      </button>
    }
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const label = getString(item, ['label', 'month', 'period', 'name'], `Period ${index + 1}`);
        const revenue = getNumber(item, ['revenue', 'value', 'amount']);
        const target = getNumber(item, ['target', 'goal', 'plannedRevenue']);
        const growth = getNumber(item, ['growthRate', 'changePercent', 'trend']);
        const achievement = target > 0 ? (revenue / target) * 100 : 0;

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
                  Revenue {formatCompactCurrency(revenue)} · Target {formatCompactCurrency(target)}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: growth > 0 ? '#15803d' : growth < 0 ? '#b91c1c' : '#475569',
                }}
              >
                {formatPercent(growth)}
              </div>
            </div>

            <ProgressBar
              value={achievement}
              color={achievement >= 100 ? '#15803d' : achievement >= 70 ? '#a16207' : '#b91c1c'}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Revenue" value={formatCompactCurrency(revenue)} tone="positive" />
              <MetricPill
                label="Achievement"
                value={formatPercent(achievement)}
                tone={achievement >= 100 ? 'positive' : achievement >= 70 ? 'warning' : 'danger'}
              />
              <MetricPill
                label="Growth"
                value={formatPercent(growth)}
                tone={getMetricToneFromTrend(growth)}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const ChannelPerformanceCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Channels"
    title="Channel Revenue Performance"
    subtitle="See which acquisition and sales channels are carrying the most revenue weight."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const label = getString(item, ['channelName', 'label', 'name'], `Channel ${index + 1}`);
        const revenue = getNumber(item, ['revenue', 'value', 'amount']);
        const share = getNumber(item, ['share', 'percentage']);
        const deals = getNumber(item, ['deals', 'dealCount', 'count']);
        const growth = getNumber(item, ['growthRate', 'changePercent'], 0);

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
                  {formatNumber(deals)} deals · {formatCompactCurrency(revenue)}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>
                {formatPercent(share)}
              </div>
            </div>

            <ProgressBar value={share} color="#0f766e" />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Revenue" value={formatCompactCurrency(revenue)} tone="positive" />
              <MetricPill label="Share" value={formatPercent(share)} />
              <MetricPill
                label="Growth"
                value={formatPercent(growth)}
                tone={getMetricToneFromTrend(growth)}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const OwnerPerformanceCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Owners"
    title="Revenue by Owner"
    subtitle="Compare who is bringing in commercial value and who needs sharper execution."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const label = getString(item, ['ownerName', 'label', 'name'], `Owner ${index + 1}`);
        const revenue = getNumber(item, ['revenue', 'value', 'amount']);
        const target = getNumber(item, ['target', 'goal', 'plannedRevenue']);
        const deals = getNumber(item, ['deals', 'dealCount', 'count']);
        const achievement = target > 0 ? (revenue / target) * 100 : 0;

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
                  {formatNumber(deals)} deals · Target {formatCompactCurrency(target)}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>
                {formatCompactCurrency(revenue)}
              </div>
            </div>

            <ProgressBar
              value={achievement}
              color={achievement >= 100 ? '#15803d' : achievement >= 70 ? '#a16207' : '#b91c1c'}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Revenue" value={formatCompactCurrency(revenue)} tone="positive" />
              <MetricPill label="Deals" value={formatNumber(deals)} />
              <MetricPill
                label="Achievement"
                value={formatPercent(achievement)}
                tone={achievement >= 100 ? 'positive' : achievement >= 70 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const ProjectPerformanceCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Projects"
    title="Revenue by Project"
    subtitle="Identify which projects are carrying real commercial momentum and which ones are lagging."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const label = getString(item, ['projectName', 'label', 'name'], `Project ${index + 1}`);
        const revenue = getNumber(item, ['revenue', 'value', 'amount']);
        const share = getNumber(item, ['share', 'percentage']);
        const conversion = getNumber(item, ['conversionRate', 'closeRate'], 0);
        const deals = getNumber(item, ['deals', 'dealCount', 'count']);

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
                  {formatNumber(deals)} deals
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>
                {formatCompactCurrency(revenue)}
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
              <MetricPill label="Revenue" value={formatCompactCurrency(revenue)} tone="positive" />
              <MetricPill label="Share" value={formatPercent(share)} />
              <MetricPill
                label="Conversion"
                value={formatPercent(conversion)}
                tone={getMetricToneByThreshold(conversion, 35, 18)}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const LocationPerformanceCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Locations"
    title="Revenue by Location"
    subtitle="Measure location-wise commercial output and spot strong or underperforming markets."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const label = getString(item, ['locationName', 'label', 'name'], `Location ${index + 1}`);
        const revenue = getNumber(item, ['revenue', 'value', 'amount']);
        const growth = getNumber(item, ['growthRate', 'changePercent'], 0);
        const deals = getNumber(item, ['deals', 'dealCount', 'count']);
        const share = getNumber(item, ['share', 'percentage'], 0);

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
                  {formatNumber(deals)} deals
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: growth > 0 ? '#15803d' : growth < 0 ? '#b91c1c' : '#475569',
                }}
              >
                {formatPercent(growth)}
              </div>
            </div>

            <ProgressBar value={share} color="#0f172a" />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Revenue" value={formatCompactCurrency(revenue)} tone="positive" />
              <MetricPill label="Share" value={formatPercent(share)} />
              <MetricPill
                label="Growth"
                value={formatPercent(growth)}
                tone={getMetricToneFromTrend(growth)}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const RevenueAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState<RevenuePageFilters>(DEFAULT_FILTERS);
  const [comparePeriod, setComparePeriod] = useState<RevenueComparePeriod>(DEFAULT_COMPARE_PERIOD);

  const sharedFilters = useMemo(
    () => ({
      dateRange: filters.dateRange,
      startDate: filters.startDate,
      endDate: filters.endDate,
      ownerIds: filters.ownerIds,
      teamIds: filters.teamIds,
      sourceIds: filters.sourceIds,
      projectIds: filters.projectIds,
      locationIds: filters.locationIds,
      channelIds: filters.channelIds,
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

  const revenueAnalytics = useRevenueAnalytics({
    initialFilters: sharedFilters,
    initialComparePeriod: sharedComparePeriod,
    useMockOnError: true,
  });

  const data = revenueAnalytics.data;
  const summary = data?.summary;

  const revenueTrend = getArray<unknown>(toRecord(data).revenueTrend);
  const revenueByChannel = getArray<unknown>(toRecord(data).revenueByChannel);
  const revenueByOwner = getArray<unknown>(toRecord(data).revenueByOwner);
  const revenueByProject = getArray<unknown>(toRecord(data).revenueByProject);
  const revenueByLocation = getArray<unknown>(toRecord(data).revenueByLocation);

  const totalRevenue = getNumber(summary, ['totalRevenue', 'revenue', 'grossRevenue']);
  const closedRevenue = getNumber(summary, ['closedRevenue', 'wonRevenue', 'bookedRevenue']);
  const collectedRevenue = getNumber(summary, ['collectedRevenue', 'receivedRevenue']);
  const outstandingRevenue = getNumber(summary, ['outstandingRevenue', 'pendingRevenue']);
  const targetRevenue = getNumber(summary, ['targetRevenue', 'goalRevenue', 'plannedRevenue']);
  const avgRevenuePerDeal = getNumber(summary, ['avgRevenuePerDeal', 'averageDealRevenue']);
  const dealsCount = getNumber(summary, ['dealsCount', 'dealCount', 'revenueDeals']);
  const growthRate = getNumber(summary, ['growthRate', 'changePercent', 'revenueGrowth']);
  const collectionRate = getNumber(summary, ['collectionRate', 'recoveryRate'], 0);
  const targetAchievement =
    targetRevenue > 0 ? (totalRevenue / targetRevenue) * 100 : getNumber(summary, ['achievementRate'], 0);
  const winRate = getNumber(summary, ['winRate', 'conversionRate', 'closeRate'], 0);
  const topChannelShare = getNumber(summary, ['topChannelShare', 'bestChannelShare'], 0);

  const isLoading = revenueAnalytics.isLoading;
  const isRefreshing = revenueAnalytics.isRefreshing;
  const error = revenueAnalytics.error;
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
    await revenueAnalytics.refetch();
  }, [revenueAnalytics]);

  const statCards = useMemo<StatCardItem[]>(
    () => [
      {
        key: 'total-revenue',
        title: 'Total Revenue',
        value: formatCompactCurrency(totalRevenue),
        subtitle: `${formatNumber(dealsCount)} revenue deals`,
        trendText: `${formatPercent(growthRate)} growth`,
        trendTone: getTrendTone(growthRate),
        icon: <IndianRupee size={20} />,
      },
      {
        key: 'collection-rate',
        title: 'Collection Rate',
        value: formatPercent(collectionRate),
        subtitle: `${formatCompactCurrency(collectedRevenue)} collected`,
        trendText:
          collectionRate >= 85
            ? 'Strong collection discipline'
            : collectionRate >= 60
              ? 'Moderate collection health'
              : 'Collection risk building',
        trendTone:
          collectionRate >= 85 ? 'positive' : collectionRate >= 60 ? 'neutral' : 'negative',
        icon: <Target size={20} />,
      },
      {
        key: 'achievement',
        title: 'Target Achievement',
        value: formatPercent(targetAchievement),
        subtitle: `Target ${formatCompactCurrency(targetRevenue)}`,
        trendText:
          targetAchievement >= 100
            ? 'Target exceeded'
            : targetAchievement >= 70
              ? 'On the way to target'
              : 'Target pressure high',
        trendTone:
          targetAchievement >= 100 ? 'positive' : targetAchievement >= 70 ? 'neutral' : 'negative',
        icon: <Trophy size={20} />,
      },
      {
        key: 'outstanding',
        title: 'Outstanding Revenue',
        value: formatCompactCurrency(outstandingRevenue),
        subtitle: `${formatPercent(topChannelShare)} top channel share`,
        trendText:
          outstandingRevenue <= totalRevenue * 0.15
            ? 'Outstanding under control'
            : outstandingRevenue <= totalRevenue * 0.35
              ? 'Outstanding needs review'
              : 'Outstanding risk elevated',
        trendTone:
          outstandingRevenue <= totalRevenue * 0.15
            ? 'positive'
            : outstandingRevenue <= totalRevenue * 0.35
              ? 'neutral'
              : 'negative',
        icon: <Activity size={20} />,
      },
    ],
    [
      totalRevenue,
      dealsCount,
      growthRate,
      collectionRate,
      collectedRevenue,
      targetAchievement,
      targetRevenue,
      outstandingRevenue,
      topChannelShare,
    ],
  );

  return (
    <div style={shellStyle}>
      <div style={containerStyle}>
        <PageHero
          title="Revenue Analytics"
          subtitle="Track revenue momentum, target achievement, collection quality, and commercial contribution across owners, channels, projects, and locations."
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
            title="Loading revenue analytics"
            description="Revenue summaries, trend cards, and commercial breakdowns are being prepared."
            tone="loading"
          />
        ) : null}

        {!isLoading && error && !hasAnyData ? (
          <StatusPanel
            title="Unable to load revenue analytics"
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
            title="No revenue data available"
            description="Try changing the active filters or date range to surface commercial insights."
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
              totalRevenue={totalRevenue}
              closedRevenue={closedRevenue}
              avgRevenuePerDeal={avgRevenuePerDeal}
              targetRevenue={targetRevenue}
              collectedRevenue={collectedRevenue}
              outstandingRevenue={outstandingRevenue}
              dealsCount={dealsCount}
              growthRate={growthRate}
            />

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: '1.05fr 0.95fr',
                gap: 16,
              }}
            >
              <RevenueTrendCard items={revenueTrend} />
              <ChannelPerformanceCard items={revenueByChannel} />
            </section>

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              <OwnerPerformanceCard items={revenueByOwner} />
              <ProjectPerformanceCard items={revenueByProject} />
            </section>

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 16,
              }}
            >
              <LocationPerformanceCard items={revenueByLocation} />
            </section>

            <section
              style={{
                ...surfaceStyle,
                padding: 20,
              }}
            >
              <SectionHeader
                eyebrow="Signals"
                title="Revenue Intelligence Notes"
                subtitle="A compact read on commercial momentum, collection posture, and target progress."
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 12,
                }}
              >
                <MetricPill
                  label="Growth Rate"
                  value={formatPercent(growthRate)}
                  tone={getMetricToneFromTrend(growthRate)}
                />
                <MetricPill
                  label="Collection Rate"
                  value={formatPercent(collectionRate)}
                  tone={getMetricToneByThreshold(collectionRate, 85, 60)}
                />
                <MetricPill
                  label="Target Achievement"
                  value={formatPercent(targetAchievement)}
                  tone={targetAchievement >= 100 ? 'positive' : targetAchievement >= 70 ? 'warning' : 'danger'}
                />
                <MetricPill
                  label="Win Rate"
                  value={formatPercent(winRate)}
                  tone={getMetricToneByThreshold(winRate, 35, 18)}
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
                    <LineChart size={16} color="#15803d" />
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>Momentum Read</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b' }}>
                    {growthRate > 0
                      ? 'Revenue momentum is moving upward. Keep pressure on conversion consistency and collection speed.'
                      : growthRate === 0
                        ? 'Revenue is flat. Commercial activity needs stronger push to create visible lift.'
                        : 'Revenue is softening. Review source quality, project mix, and owner execution immediately.'}
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
                    <Users size={16} color="#1d4ed8" />
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>Commercial Read</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b' }}>
                    {winRate >= 35
                      ? 'Commercial execution looks sharp. The current funnel is translating into quality revenue.'
                      : winRate >= 18
                        ? 'Execution is acceptable, but tighter stage control can unlock better booked revenue.'
                        : 'Commercial efficiency is weak. Lead quality, sales follow-up, or pricing friction may be dragging outcomes.'}
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
                    <Building2 size={16} color="#b91c1c" />
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>Collection Read</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b' }}>
                    {collectionRate >= 85
                      ? 'Collection posture is strong. Revenue quality is matching booked performance.'
                      : collectionRate >= 60
                        ? 'Collections are decent but need tighter follow-up on delayed closures and pending payments.'
                        : 'Collection risk is high. Outstanding pressure could distort real commercial performance.'}
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
                    <MapPin size={16} color="#0f766e" />
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>Market Read</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b' }}>
                    {topChannelShare >= 45
                      ? 'Revenue concentration is high. One major channel is doing heavy lifting, so diversification matters.'
                      : topChannelShare >= 25
                        ? 'Revenue mix is fairly balanced with moderate channel concentration.'
                        : 'Revenue mix looks distributed. This usually gives better resilience across market shifts.'}
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

export default RevenueAnalyticsPage;