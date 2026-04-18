import React, { useCallback, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Briefcase,
  Download,
  Filter,
  RefreshCcw,
  ShieldAlert,
  Target,
  TrendingUp,
} from 'lucide-react';

import useForecastAnalytics from '../../hooks/analytics/useForecastAnalytics';

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

interface ForecastPageFilters {
  dateRange: AnalyticsDateRange;
  startDate?: string;
  endDate?: string;
  teamIds: string[];
  ownerIds: string[];
  projectIds: string[];
  sourceIds: string[];
  locationIds: string[];
  search: string;
}

interface ForecastComparePeriod {
  enabled: boolean;
  type: ComparePeriodType;
}

const DEFAULT_FILTERS: ForecastPageFilters = {
  dateRange: '30d',
  teamIds: [],
  ownerIds: [],
  projectIds: [],
  sourceIds: [],
  locationIds: [],
  search: '',
};

const DEFAULT_COMPARE_PERIOD: ForecastComparePeriod = {
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

const getNumber = (
  source: unknown,
  keys: string[],
  fallback = 0,
): number => {
  const record = toRecord(source);

  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }

  return fallback;
};

const getString = (
  source: unknown,
  keys: string[],
  fallback = '',
): string => {
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
      <div style={{ maxWidth: 840 }}>
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
          <TrendingUp size={14} />
          Forecast Intelligence
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
  filters: ForecastPageFilters;
  comparePeriod: ForecastComparePeriod;
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
          placeholder="Search owners, stages, teams..."
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

const TrendListCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Trend"
    title="Forecast vs Actual Trend"
    subtitle="Period-wise forecast performance with confidence and variance."
    action={
      <button type="button" style={buttonSecondaryStyle}>
        <Download size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
        Export
      </button>
    }
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['label', 'period', 'month', 'name'], `Period ${index + 1}`);
        const forecastValue = getNumber(item, ['forecastValue', 'forecast', 'value', 'projectedRevenue']);
        const actualValue = getNumber(item, ['actualValue', 'actual', 'closedRevenue']);
        const confidence = getNumber(item, ['confidence', 'confidenceScore', 'accuracy']);
        const variance = getNumber(item, ['variance', 'variancePercent', 'changePercent']);

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
                  Forecast {formatCurrency(forecastValue)} · Actual {formatCurrency(actualValue)}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: variance >= 0 ? '#15803d' : '#b91c1c',
                }}
              >
                {variance >= 0 ? '+' : ''}
                {formatPercent(variance)}
              </div>
            </div>

            <ProgressBar value={confidence} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill label="Forecast" value={formatCompactCurrency(forecastValue)} />
              <MetricPill label="Actual" value={formatCompactCurrency(actualValue)} />
              <MetricPill
                label="Confidence"
                value={formatPercent(confidence)}
                tone={confidence >= 75 ? 'positive' : confidence >= 50 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const StageBreakdownCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Stages"
    title="Stage Forecast Breakdown"
    subtitle="Pipeline stages driving future revenue expectation."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['stageName', 'label', 'name'], `Stage ${index + 1}`);
        const dealCount = getNumber(item, ['dealCount', 'count', 'totalDeals']);
        const forecastValue = getNumber(item, ['forecastValue', 'forecast', 'value']);
        const weightedValue = getNumber(item, ['weightedValue', 'weightedForecast', 'weighted']);
        const conversionRate = getNumber(item, ['conversionRate', 'winRate', 'rate']);

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
                  {formatNumber(dealCount)} deals
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>
                {formatCurrency(forecastValue)}
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
              <MetricPill label="Forecast" value={formatCompactCurrency(forecastValue)} />
              <MetricPill label="Weighted" value={formatCompactCurrency(weightedValue)} />
              <MetricPill
                label="Conversion"
                value={formatPercent(conversionRate)}
                tone={conversionRate >= 50 ? 'positive' : 'warning'}
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
    title="Forecast Owner Performance"
    subtitle="Top owners contributing to forecast movement."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['ownerName', 'name', 'owner'], `Owner ${index + 1}`);
        const forecastValue = getNumber(item, ['forecastValue', 'forecast', 'value']);
        const closedValue = getNumber(item, ['closedValue', 'actualValue', 'closedRevenue']);
        const pipelineValue = getNumber(item, ['pipelineValue', 'openPipelineValue', 'pipeline']);
        const winRate = getNumber(item, ['winRate', 'conversionRate', 'successRate']);

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
                {formatPercent(winRate)}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
              }}
            >
              <MetricPill label="Forecast" value={formatCompactCurrency(forecastValue)} />
              <MetricPill label="Closed" value={formatCompactCurrency(closedValue)} />
              <MetricPill label="Pipeline" value={formatCompactCurrency(pipelineValue)} />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const RiskPanelCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Risk"
    title="Forecast Risk Watch"
    subtitle="Signals that can drag forecast confidence or achievement."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 6).map((item, index) => {
        const label = getString(item, ['riskName', 'label', 'name'], `Risk ${index + 1}`);
        const severity = getString(item, ['severity', 'level'], 'low').toLowerCase();
        const impactValue = getNumber(item, ['impactValue', 'impact', 'value']);
        const affectedDeals = getNumber(item, ['affectedDeals', 'dealCount', 'count']);
        const confidenceDrop = getNumber(item, ['confidenceDrop', 'dropPercent', 'riskPercent']);

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
                  {formatNumber(affectedDeals)} affected deals
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

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 10,
              }}
            >
              <MetricPill label="Impact" value={formatCurrency(impactValue)} tone="danger" />
              <MetricPill
                label="Confidence Drop"
                value={formatPercent(confidenceDrop)}
                tone={confidenceDrop >= 20 ? 'danger' : 'warning'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const ExecutiveSummaryCard: React.FC<{
  forecastRevenue: number;
  bestCaseRevenue: number;
  worstCaseRevenue: number;
  confidenceScore: number;
  coverageRatio: number;
  riskValue: number;
}> = ({
  forecastRevenue,
  bestCaseRevenue,
  worstCaseRevenue,
  confidenceScore,
  coverageRatio,
  riskValue,
}) => (
  <ChartCard
    eyebrow="Executive"
    title="Forecast Summary"
    subtitle="Fast read of confidence, range, and exposure."
    minHeight={200}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}
    >
      <MetricPill label="Forecast Revenue" value={formatCompactCurrency(forecastRevenue)} tone="positive" />
      <MetricPill label="Best Case" value={formatCompactCurrency(bestCaseRevenue)} tone="positive" />
      <MetricPill label="Worst Case" value={formatCompactCurrency(worstCaseRevenue)} tone="warning" />
      <MetricPill
        label="Confidence Score"
        value={formatPercent(confidenceScore)}
        tone={confidenceScore >= 75 ? 'positive' : confidenceScore >= 50 ? 'warning' : 'danger'}
      />
      <MetricPill label="Coverage Ratio" value={formatPercent(coverageRatio)} tone="positive" />
      <MetricPill label="Risk Value" value={formatCompactCurrency(riskValue)} tone="danger" />
    </div>
  </ChartCard>
);

const ForecastAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState<ForecastPageFilters>(DEFAULT_FILTERS);
  const [comparePeriod, setComparePeriod] =
    useState<ForecastComparePeriod>(DEFAULT_COMPARE_PERIOD);

  const sharedFilters = useMemo(
    () => ({
      dateRange: filters.dateRange,
      startDate: filters.startDate,
      endDate: filters.endDate,
      teamIds: filters.teamIds,
      ownerIds: filters.ownerIds,
      projectIds: filters.projectIds,
      sourceIds: filters.sourceIds,
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

  const forecastAnalytics = useForecastAnalytics({
    initialFilters: sharedFilters,
    initialComparePeriod: sharedComparePeriod,
    useMockOnError: true,
  });

  const data = forecastAnalytics.data;
  const summary = data?.summary;

  const trendItems = getArray<unknown>(toRecord(data).trend);
  const stageBreakdownItems = getArray<unknown>(toRecord(data).stageBreakdown);
  const ownerPerformanceItems = getArray<unknown>(toRecord(data).ownerPerformance);
  const riskItems = getArray<unknown>(toRecord(data).risks);

  const forecastRevenue = getNumber(summary, ['forecastRevenue', 'projectedRevenue', 'totalForecast']);
  const bestCaseRevenue = getNumber(summary, ['bestCaseRevenue', 'bestCase', 'maxForecast']);
  const worstCaseRevenue = getNumber(summary, ['worstCaseRevenue', 'worstCase', 'minForecast']);
  const confidenceScore = getNumber(summary, ['confidenceScore', 'confidence', 'accuracyScore']);
  const coverageRatio = getNumber(summary, ['coverageRatio', 'coverage', 'targetCoverage']);
  const riskValue = getNumber(summary, ['riskValue', 'totalRiskValue', 'riskExposure']);
  const forecastGrowthRate = getNumber(summary, ['forecastGrowthRate', 'growthRate', 'growthPercent']);
  const attainmentRate = getNumber(summary, ['attainmentRate', 'achievementRate', 'targetAttainment']);

  const hasAnyData = Boolean(data);
  const isLoading = forecastAnalytics.isLoading;
  const isRefreshing = forecastAnalytics.isRefreshing;
  const error = forecastAnalytics.error;

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
    await forecastAnalytics.refetch();
  }, [forecastAnalytics]);

  const statCards = useMemo(
    () => [
      {
        key: 'forecast-revenue',
        title: 'Forecast Revenue',
        value: formatCompactCurrency(forecastRevenue),
        subtitle: `Best case ${formatCompactCurrency(bestCaseRevenue)}`,
        trendText: `${formatPercent(forecastGrowthRate)} growth`,
        trendTone: getTrendTone(forecastGrowthRate) as TrendTone,
        icon: <TrendingUp size={20} />,
      },
      {
        key: 'confidence-score',
        title: 'Confidence Score',
        value: formatPercent(confidenceScore),
        subtitle: `Worst case ${formatCompactCurrency(worstCaseRevenue)}`,
        trendText:
          confidenceScore >= 75
            ? 'Healthy confidence band'
            : confidenceScore >= 50
              ? 'Moderate confidence band'
              : 'Low confidence band',
        trendTone:
          confidenceScore >= 75
            ? ('positive' as TrendTone)
            : confidenceScore >= 50
              ? ('neutral' as TrendTone)
              : ('negative' as TrendTone),
        icon: <Target size={20} />,
      },
      {
        key: 'coverage-ratio',
        title: 'Coverage Ratio',
        value: formatPercent(coverageRatio),
        subtitle: `Attainment ${formatPercent(attainmentRate)}`,
        trendText:
          coverageRatio >= 100
            ? 'Pipeline covers target'
            : 'Needs stronger pipeline coverage',
        trendTone: coverageRatio >= 100 ? ('positive' as TrendTone) : ('negative' as TrendTone),
        icon: <Briefcase size={20} />,
      },
      {
        key: 'risk-value',
        title: 'Risk Value',
        value: formatCompactCurrency(riskValue),
        subtitle: 'Potential exposure in forecast path',
        trendText: riskValue > 0 ? 'Monitor deal slippage closely' : 'No major risk flagged',
        trendTone: riskValue > 0 ? ('negative' as TrendTone) : ('positive' as TrendTone),
        icon: <ShieldAlert size={20} />,
      },
    ],
    [
      attainmentRate,
      bestCaseRevenue,
      confidenceScore,
      coverageRatio,
      forecastGrowthRate,
      forecastRevenue,
      riskValue,
      worstCaseRevenue,
    ],
  );

  return (
    <PageShell>
      <PageHero
        title="Forecast Analytics"
        subtitle="A sharper forward view of revenue probability, stage momentum, ownership strength, and risk pressure — so the next move is driven by signal, not guesswork."
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
          title="Loading forecast analytics"
          description="Forecast signals, confidence layers, owner contribution, and risk markers are being assembled."
          tone="loading"
        />
      ) : null}

      {!isLoading && error && !hasAnyData ? (
        <StatusPanel
          title="Unable to load forecast analytics"
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
          title="No forecast data available"
          description="Try changing the current filters or date range to surface forecast records."
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
            forecastRevenue={forecastRevenue}
            bestCaseRevenue={bestCaseRevenue}
            worstCaseRevenue={worstCaseRevenue}
            confidenceScore={confidenceScore}
            coverageRatio={coverageRatio}
            riskValue={riskValue}
          />

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1.15fr 0.85fr',
              gap: 16,
            }}
          >
            <TrendListCard items={trendItems} />
            <StageBreakdownCard items={stageBreakdownItems} />
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
            }}
          >
            <OwnerPerformanceCard items={ownerPerformanceItems} />
            <RiskPanelCard items={riskItems} />
          </section>
        </>
      ) : null}
    </PageShell>
  );
};

export default ForecastAnalyticsPage;