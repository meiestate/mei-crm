import React, { useCallback, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Download,
  Filter,
  Megaphone,
  RefreshCcw,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import useMarketingAnalytics from '../../hooks/analytics/useMarketingAnalytics';

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

interface MarketingPageFilters {
  dateRange: AnalyticsDateRange;
  startDate?: string;
  endDate?: string;
  channelIds: string[];
  campaignIds: string[];
  teamIds: string[];
  ownerIds: string[];
  locationIds: string[];
  sourceIds: string[];
  search: string;
}

interface MarketingComparePeriod {
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

const DEFAULT_FILTERS: MarketingPageFilters = {
  dateRange: '30d',
  channelIds: [],
  campaignIds: [],
  teamIds: [],
  ownerIds: [],
  locationIds: [],
  sourceIds: [],
  search: '',
};

const DEFAULT_COMPARE_PERIOD: MarketingComparePeriod = {
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

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

const formatNumber = (value: number): string => numberFormatter.format(value || 0);
const formatPercent = (value: number): string => `${percentFormatter.format(value || 0)}%`;
const formatCurrency = (value: number): string => `₹${currencyFormatter.format(value || 0)}`;
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

const getRoiTone = (value: number): TrendTone => {
  if (value >= 3) return 'positive';
  if (value >= 1.2) return 'neutral';
  return 'negative';
};

const getConversionTone = (value: number): TrendTone => {
  if (value >= 10) return 'positive';
  if (value >= 4) return 'neutral';
  return 'negative';
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
        'linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 45%, rgba(51,65,85,1) 100%)',
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
          <Megaphone size={14} />
          Marketing Intelligence
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
  filters: MarketingPageFilters;
  comparePeriod: MarketingComparePeriod;
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
            placeholder="Search campaign, channel, source..."
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
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
}> = ({ impressions, clicks, leads, conversions, spend, revenue, ctr, conversionRate }) => (
  <ChartCard
    eyebrow="Executive"
    title="Marketing Summary"
    subtitle="A tight read on reach, engagement, conversion, and revenue efficiency."
    minHeight={200}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}
    >
      <MetricPill label="Impressions" value={formatNumber(impressions)} />
      <MetricPill label="Clicks" value={formatNumber(clicks)} />
      <MetricPill label="Leads" value={formatNumber(leads)} tone="positive" />
      <MetricPill label="Conversions" value={formatNumber(conversions)} tone="positive" />
      <MetricPill label="Spend" value={formatCompactCurrency(spend)} tone="warning" />
      <MetricPill label="Revenue" value={formatCompactCurrency(revenue)} tone="positive" />
      <MetricPill
        label="CTR"
        value={formatPercent(ctr)}
        tone={ctr >= 3 ? 'positive' : ctr >= 1.5 ? 'warning' : 'danger'}
      />
      <MetricPill
        label="Conversion Rate"
        value={formatPercent(conversionRate)}
        tone={conversionRate >= 10 ? 'positive' : conversionRate >= 4 ? 'warning' : 'danger'}
      />
    </div>
  </ChartCard>
);

const ChannelPerformanceCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Channels"
    title="Channel Performance"
    subtitle="See which channels are creating efficient lead flow and real revenue."
    action={
      <button type="button" style={secondaryButtonStyle}>
        <Download size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
        Export
      </button>
    }
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['channelName', 'label', 'name'], `Channel ${index + 1}`);
        const spend = getNumber(item, ['spend', 'adSpend', 'cost']);
        const leads = getNumber(item, ['leadCount', 'leads', 'count']);
        const revenue = getNumber(item, ['revenue', 'revenueValue', 'pipelineValue']);
        const roi = getNumber(item, ['roi', 'roas', 'returnRate']);
        const conversionRate = getNumber(item, ['conversionRate', 'leadConversionRate']);

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
                  {formatNumber(leads)} leads · {formatCompactCurrency(spend)} spend
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: roi >= 3 ? '#15803d' : roi >= 1.2 ? '#a16207' : '#b91c1c',
                }}
              >
                {roi.toFixed(1)}x ROI
              </div>
            </div>

            <ProgressBar value={Math.min(conversionRate, 100)} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Leads" value={formatNumber(leads)} />
              <MetricPill label="Spend" value={formatCompactCurrency(spend)} tone="warning" />
              <MetricPill label="Revenue" value={formatCompactCurrency(revenue)} tone="positive" />
              <MetricPill
                label="Conv."
                value={formatPercent(conversionRate)}
                tone={conversionRate >= 12 ? 'positive' : conversionRate >= 5 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const CampaignROIInsightsCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Campaigns"
    title="Campaign ROI Insights"
    subtitle="Top campaigns by return, lead generation, and conversion strength."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['campaignName', 'label', 'name'], `Campaign ${index + 1}`);
        const spend = getNumber(item, ['spend', 'adSpend', 'cost']);
        const revenue = getNumber(item, ['revenue', 'revenueValue']);
        const roi = getNumber(item, ['roi', 'roas', 'returnRate']);
        const leads = getNumber(item, ['leadCount', 'leads', 'count']);

        return (
          <div key={`${label}-${index}`} style={{ ...subtleCardStyle, padding: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{label}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  Spend {formatCompactCurrency(spend)} · Revenue {formatCompactCurrency(revenue)}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: roi >= 3 ? '#15803d' : roi >= 1 ? '#a16207' : '#b91c1c',
                }}
              >
                {roi.toFixed(1)}x
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
              }}
            >
              <MetricPill label="Leads" value={formatNumber(leads)} />
              <MetricPill label="Spend" value={formatCompactCurrency(spend)} tone="warning" />
              <MetricPill
                label="ROI"
                value={`${roi.toFixed(1)}x`}
                tone={roi >= 3 ? 'positive' : roi >= 1 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const SpendEfficiencyCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Efficiency"
    title="Spend Efficiency"
    subtitle="Cost per lead, cost per conversion, and efficiency signals across spend buckets."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['label', 'bucketName', 'name'], `Bucket ${index + 1}`);
        const cpl = getNumber(item, ['costPerLead', 'cpl']);
        const cpa = getNumber(item, ['costPerAcquisition', 'cpa', 'costPerConversion']);
        const leads = getNumber(item, ['leadCount', 'leads', 'count']);
        const efficiencyScore = getNumber(item, ['efficiencyScore', 'score']);

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
                  {formatNumber(leads)} leads captured
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color:
                    efficiencyScore >= 75
                      ? '#15803d'
                      : efficiencyScore >= 45
                        ? '#a16207'
                        : '#b91c1c',
                }}
              >
                {formatNumber(efficiencyScore)}
              </div>
            </div>

            <ProgressBar value={efficiencyScore} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="CPL" value={formatCurrency(cpl)} tone="warning" />
              <MetricPill label="CPA" value={formatCurrency(cpa)} tone="warning" />
              <MetricPill
                label="Score"
                value={formatNumber(efficiencyScore)}
                tone={efficiencyScore >= 75 ? 'positive' : efficiencyScore >= 45 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const AttributionCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Attribution"
    title="Attribution Snapshot"
    subtitle="How revenue and leads are being credited across campaigns and channels."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['label', 'sourceName', 'name'], `Attribution ${index + 1}`);
        const attributionRate = getNumber(item, ['attributionRate', 'rate', 'share']);
        const revenue = getNumber(item, ['revenue', 'revenueValue']);
        const leads = getNumber(item, ['leadCount', 'leads', 'count']);

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
                  Revenue {formatCompactCurrency(revenue)}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>
                {formatPercent(attributionRate)}
              </div>
            </div>

            <ProgressBar value={attributionRate} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Leads" value={formatNumber(leads)} />
              <MetricPill label="Revenue" value={formatCompactCurrency(revenue)} tone="positive" />
              <MetricPill
                label="Share"
                value={formatPercent(attributionRate)}
                tone={attributionRate >= 30 ? 'positive' : attributionRate >= 12 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const MarketingAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState<MarketingPageFilters>(DEFAULT_FILTERS);
  const [comparePeriod, setComparePeriod] = useState<MarketingComparePeriod>(DEFAULT_COMPARE_PERIOD);

  const sharedFilters = useMemo(
    () => ({
      dateRange: filters.dateRange,
      startDate: filters.startDate,
      endDate: filters.endDate,
      channelIds: filters.channelIds,
      campaignIds: filters.campaignIds,
      teamIds: filters.teamIds,
      ownerIds: filters.ownerIds,
      locationIds: filters.locationIds,
      sourceIds: filters.sourceIds,
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

  const marketingAnalytics = useMarketingAnalytics({
    initialFilters: sharedFilters,
    initialComparePeriod: sharedComparePeriod,
    useMockOnError: true,
  });

  const data = marketingAnalytics.data;
  const summary = data?.summary;

  const channelPerformance = getArray<unknown>(toRecord(data).channelPerformance);
  const campaignPerformance = getArray<unknown>(toRecord(data).campaignPerformance);
  const spendEfficiency = getArray<unknown>(toRecord(data).spendEfficiency);
  const attributionSummary = getArray<unknown>(toRecord(data).attributionSummary);

  const impressions = getNumber(summary, ['impressions', 'totalImpressions']);
  const clicks = getNumber(summary, ['clicks', 'totalClicks']);
  const leads = getNumber(summary, ['leads', 'leadCount', 'totalLeads']);
  const conversions = getNumber(summary, ['conversions', 'convertedLeads', 'wonLeads']);
  const spend = getNumber(summary, ['spend', 'adSpend', 'cost']);
  const revenue = getNumber(summary, ['revenue', 'revenueValue', 'pipelineValue']);
  const ctr = getNumber(summary, ['ctr', 'clickThroughRate']);
  const conversionRate = getNumber(summary, ['conversionRate', 'leadConversionRate']);
  const roi = getNumber(summary, ['roi', 'roas', 'returnRate']);
  const cpl = getNumber(summary, ['costPerLead', 'cpl']);
  const cpc = getNumber(summary, ['costPerClick', 'cpc']);
  const growthRate = getNumber(summary, ['growthRate', 'revenueGrowthRate', 'changePercent']);

  const isLoading = marketingAnalytics.isLoading;
  const isRefreshing = marketingAnalytics.isRefreshing;
  const error = marketingAnalytics.error;
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
    await marketingAnalytics.refetch();
  }, [marketingAnalytics]);

  const statCards = useMemo<StatCardItem[]>(
    () => [
      {
        key: 'spend',
        title: 'Total Spend',
        value: formatCompactCurrency(spend),
        subtitle: `${formatNumber(clicks)} clicks generated`,
        trendText: `CPC ${formatCurrency(cpc)}`,
        trendTone: 'neutral',
        icon: <Megaphone size={20} />,
      },
      {
        key: 'revenue',
        title: 'Attributed Revenue',
        value: formatCompactCurrency(revenue),
        subtitle: `${formatNumber(conversions)} conversions`,
        trendText: `${formatPercent(growthRate)} growth`,
        trendTone: getTrendTone(growthRate),
        icon: <BarChart3 size={20} />,
      },
      {
        key: 'roi',
        title: 'ROI / ROAS',
        value: `${roi.toFixed(1)}x`,
        subtitle: `${formatNumber(leads)} leads delivered`,
        trendText:
          roi >= 3 ? 'Strong campaign return' : roi >= 1.2 ? 'Moderate return zone' : 'Low return signal',
        trendTone: getRoiTone(roi),
        icon: <Target size={20} />,
      },
      {
        key: 'cpl',
        title: 'Cost Per Lead',
        value: formatCurrency(cpl),
        subtitle: `CTR ${formatPercent(ctr)}`,
        trendText:
          conversionRate >= 10
            ? 'Healthy conversion efficiency'
            : conversionRate >= 4
              ? 'Conversion needs optimization'
              : 'Weak conversion efficiency',
        trendTone: getConversionTone(conversionRate),
        icon: <Activity size={20} />,
      },
    ],
    [clicks, conversions, cpc, cpl, ctr, growthRate, leads, revenue, roi, conversionRate, spend],
  );

  return (
    <div style={shellStyle}>
      <div style={containerStyle}>
        <PageHero
          title="Marketing Analytics"
          subtitle="Track campaign performance, channel efficiency, spend quality, and revenue attribution with a dashboard built for sharp decisions — not vanity metrics."
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
            title="Loading marketing analytics"
            description="Campaign ROI, channel efficiency, attribution, and spend performance are being assembled."
            tone="loading"
          />
        ) : null}

        {!isLoading && error && !hasAnyData ? (
          <StatusPanel
            title="Unable to load marketing analytics"
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
            title="No marketing data available"
            description="Try changing the active filters or date range to surface campaign and channel data."
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
              impressions={impressions}
              clicks={clicks}
              leads={leads}
              conversions={conversions}
              spend={spend}
              revenue={revenue}
              ctr={ctr}
              conversionRate={conversionRate}
            />

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: '1.05fr 0.95fr',
                gap: 16,
              }}
            >
              <ChannelPerformanceCard items={channelPerformance} />
              <CampaignROIInsightsCard items={campaignPerformance} />
            </section>

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              <SpendEfficiencyCard items={spendEfficiency} />
              <AttributionCard items={attributionSummary} />
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default MarketingAnalyticsPage;