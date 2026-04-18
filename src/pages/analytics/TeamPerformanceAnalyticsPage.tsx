import React, { useCallback, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle2,
  Clock3,
  Download,
  Filter,
  RefreshCcw,
  Search,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

import useTeamPerformanceAnalytics from '../../hooks/analytics/useTeamPerformanceAnalytics';

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

interface TeamPerformancePageFilters {
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

interface TeamPerformanceComparePeriod {
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

const DEFAULT_FILTERS: TeamPerformancePageFilters = {
  dateRange: '30d',
  ownerIds: [],
  teamIds: [],
  sourceIds: [],
  projectIds: [],
  locationIds: [],
  channelIds: [],
  search: '',
};

const DEFAULT_COMPARE_PERIOD: TeamPerformanceComparePeriod = {
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
        'linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(37,99,235,0.95) 52%, rgba(14,165,233,0.92) 100%)',
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
          <Users size={14} />
          Team Performance Intelligence
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
  filters: TeamPerformancePageFilters;
  comparePeriod: TeamPerformanceComparePeriod;
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
            placeholder="Search team, owner, member, location..."
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

const TeamOverviewCard: React.FC<{
  totalMembers: number;
  activeMembers: number;
  avgProductivity: number;
  avgConversionRate: number;
  avgResponseTime: number;
  avgFollowUpCompletion: number;
  topPerformerCount: number;
  underperformingCount: number;
}> = ({
  totalMembers,
  activeMembers,
  avgProductivity,
  avgConversionRate,
  avgResponseTime,
  avgFollowUpCompletion,
  topPerformerCount,
  underperformingCount,
}) => (
  <ChartCard
    eyebrow="Executive"
    title="Team Overview"
    subtitle="A quick leadership read on activity, productivity, consistency, and overall operational sharpness."
    minHeight={200}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}
    >
      <MetricPill label="Total Members" value={formatNumber(totalMembers)} />
      <MetricPill label="Active Members" value={formatNumber(activeMembers)} tone="positive" />
      <MetricPill
        label="Avg Productivity"
        value={formatPercent(avgProductivity)}
        tone={getMetricToneByThreshold(avgProductivity, 80, 55)}
      />
      <MetricPill
        label="Avg Conversion"
        value={formatPercent(avgConversionRate)}
        tone={getMetricToneByThreshold(avgConversionRate, 30, 15)}
      />
      <MetricPill
        label="Avg Response Time"
        value={`${formatNumber(avgResponseTime)} min`}
        tone={avgResponseTime <= 15 ? 'positive' : avgResponseTime <= 45 ? 'warning' : 'danger'}
      />
      <MetricPill
        label="Follow-up Completion"
        value={formatPercent(avgFollowUpCompletion)}
        tone={getMetricToneByThreshold(avgFollowUpCompletion, 85, 65)}
      />
      <MetricPill label="Top Performers" value={formatNumber(topPerformerCount)} tone="positive" />
      <MetricPill
        label="Needs Attention"
        value={formatNumber(underperformingCount)}
        tone={underperformingCount <= 1 ? 'positive' : underperformingCount <= 3 ? 'warning' : 'danger'}
      />
    </div>
  </ChartCard>
);

const TeamLeaderboardCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Leaderboard"
    title="Top Team Members"
    subtitle="See who is setting the pace across productivity, conversion, and commercial effectiveness."
    action={
      <button type="button" style={secondaryButtonStyle}>
        <Download size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
        Export
      </button>
    }
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const name = getString(item, ['memberName', 'name', 'ownerName', 'label'], `Member ${index + 1}`);
        const teamName = getString(item, ['teamName', 'groupName', 'team'], 'Core Team');
        const score = getNumber(item, ['performanceScore', 'score', 'productivityScore']);
        const conversion = getNumber(item, ['conversionRate', 'closeRate']);
        const followUp = getNumber(item, ['followUpCompletionRate', 'followUpRate']);
        const responseTime = getNumber(item, ['avgResponseTime', 'responseTime']);
        const activityCount = getNumber(item, ['activityCount', 'activities', 'taskCount']);

        return (
          <div key={`${name}-${index}`} style={{ ...subtleCardStyle, padding: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 10,
                alignItems: 'flex-start',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>
                  #{index + 1} {name}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{teamName}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>
                {formatPercent(score)}
              </div>
            </div>

            <ProgressBar
              value={score}
              color={score >= 85 ? '#15803d' : score >= 60 ? '#a16207' : '#b91c1c'}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill
                label="Score"
                value={formatPercent(score)}
                tone={score >= 85 ? 'positive' : score >= 60 ? 'warning' : 'danger'}
              />
              <MetricPill
                label="Conversion"
                value={formatPercent(conversion)}
                tone={getMetricToneByThreshold(conversion, 30, 15)}
              />
              <MetricPill
                label="Follow-up"
                value={formatPercent(followUp)}
                tone={getMetricToneByThreshold(followUp, 85, 65)}
              />
              <MetricPill
                label="Response"
                value={`${formatNumber(responseTime)}m`}
                tone={responseTime <= 15 ? 'positive' : responseTime <= 45 ? 'warning' : 'danger'}
              />
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: '#64748b',
                fontWeight: 700,
              }}
            >
              {formatNumber(activityCount)} tracked activities
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const TeamDistributionCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Distribution"
    title="Performance by Team"
    subtitle="Compare team-wise output to understand which groups are operating with real consistency."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const label = getString(item, ['teamName', 'name', 'label'], `Team ${index + 1}`);
        const score = getNumber(item, ['performanceScore', 'score']);
        const productivity = getNumber(item, ['productivityRate', 'productivity']);
        const conversion = getNumber(item, ['conversionRate', 'closeRate']);
        const members = getNumber(item, ['memberCount', 'members']);
        const activityVolume = getNumber(item, ['activityCount', 'activities']);

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
                  {formatNumber(members)} members · {formatNumber(activityVolume)} activities
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>
                {formatPercent(score)}
              </div>
            </div>

            <ProgressBar
              value={score}
              color={score >= 85 ? '#15803d' : score >= 60 ? '#a16207' : '#b91c1c'}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill
                label="Productivity"
                value={formatPercent(productivity)}
                tone={getMetricToneByThreshold(productivity, 80, 55)}
              />
              <MetricPill
                label="Conversion"
                value={formatPercent(conversion)}
                tone={getMetricToneByThreshold(conversion, 30, 15)}
              />
              <MetricPill
                label="Score"
                value={formatPercent(score)}
                tone={score >= 85 ? 'positive' : score >= 60 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const ActivityQualityCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Execution"
    title="Activity Quality Signals"
    subtitle="Measure response discipline, follow-up completion, and execution consistency across members."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const label = getString(item, ['memberName', 'name', 'label'], `Member ${index + 1}`);
        const responseTime = getNumber(item, ['avgResponseTime', 'responseTime']);
        const followUpRate = getNumber(item, ['followUpCompletionRate', 'followUpRate']);
        const taskClosureRate = getNumber(item, ['taskClosureRate', 'completionRate']);
        const qualityScore = getNumber(item, ['qualityScore', 'executionScore']);

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
                  Response discipline and task completion quality
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>
                {formatPercent(qualityScore)}
              </div>
            </div>

            <ProgressBar
              value={qualityScore}
              color={qualityScore >= 85 ? '#15803d' : qualityScore >= 60 ? '#a16207' : '#b91c1c'}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill
                label="Response"
                value={`${formatNumber(responseTime)}m`}
                tone={responseTime <= 15 ? 'positive' : responseTime <= 45 ? 'warning' : 'danger'}
              />
              <MetricPill
                label="Follow-up"
                value={formatPercent(followUpRate)}
                tone={getMetricToneByThreshold(followUpRate, 85, 65)}
              />
              <MetricPill
                label="Task Close"
                value={formatPercent(taskClosureRate)}
                tone={getMetricToneByThreshold(taskClosureRate, 85, 65)}
              />
              <MetricPill
                label="Quality"
                value={formatPercent(qualityScore)}
                tone={qualityScore >= 85 ? 'positive' : qualityScore >= 60 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const CoachingNeedsCard: React.FC<{ items: unknown[] }> = ({ items }) => (
  <ChartCard
    eyebrow="Coaching"
    title="Members Needing Attention"
    subtitle="These are the people or groups where focused coaching can create the biggest turnaround."
  >
    <div style={{ display: 'grid', gap: 12 }}>
      {items.slice(0, 8).map((item, index) => {
        const name = getString(item, ['memberName', 'name', 'label'], `Member ${index + 1}`);
        const teamName = getString(item, ['teamName', 'team', 'groupName'], 'Core Team');
        const score = getNumber(item, ['performanceScore', 'score']);
        const conversion = getNumber(item, ['conversionRate', 'closeRate']);
        const followUpRate = getNumber(item, ['followUpCompletionRate', 'followUpRate']);
        const responseTime = getNumber(item, ['avgResponseTime', 'responseTime']);

        return (
          <div key={`${name}-${index}`} style={{ ...subtleCardStyle, padding: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{teamName}</div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: score < 60 ? '#b91c1c' : '#a16207',
                }}
              >
                {formatPercent(score)}
              </div>
            </div>

            <ProgressBar value={score} color={score < 60 ? '#b91c1c' : '#a16207'} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MetricPill
                label="Score"
                value={formatPercent(score)}
                tone={score >= 60 ? 'warning' : 'danger'}
              />
              <MetricPill
                label="Conversion"
                value={formatPercent(conversion)}
                tone={getMetricToneByThreshold(conversion, 30, 15)}
              />
              <MetricPill
                label="Follow-up"
                value={formatPercent(followUpRate)}
                tone={getMetricToneByThreshold(followUpRate, 85, 65)}
              />
              <MetricPill
                label="Response"
                value={`${formatNumber(responseTime)}m`}
                tone={responseTime <= 15 ? 'positive' : responseTime <= 45 ? 'warning' : 'danger'}
              />
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const TeamPerformanceAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState<TeamPerformancePageFilters>(DEFAULT_FILTERS);
  const [comparePeriod, setComparePeriod] =
    useState<TeamPerformanceComparePeriod>(DEFAULT_COMPARE_PERIOD);

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

  const teamAnalytics = useTeamPerformanceAnalytics({
    initialFilters: sharedFilters,
    initialComparePeriod: sharedComparePeriod,
    useMockOnError: true,
  });

  const data = teamAnalytics.data;
  const summary = data?.summary;

  const leaderboard = getArray<unknown>(toRecord(data).leaderboard);
  const teamDistribution = getArray<unknown>(toRecord(data).teamDistribution);
  const activityQuality = getArray<unknown>(toRecord(data).activityQuality);
  const coachingNeeds = getArray<unknown>(toRecord(data).coachingNeeds);

  const totalMembers = getNumber(summary, ['totalMembers', 'memberCount', 'users']);
  const activeMembers = getNumber(summary, ['activeMembers', 'engagedMembers']);
  const avgProductivity = getNumber(summary, ['avgProductivity', 'productivityRate']);
  const avgConversionRate = getNumber(summary, ['avgConversionRate', 'conversionRate']);
  const avgResponseTime = getNumber(summary, ['avgResponseTime', 'responseTime']);
  const avgFollowUpCompletion = getNumber(summary, [
    'avgFollowUpCompletion',
    'followUpCompletionRate',
  ]);
  const topPerformerCount = getNumber(summary, ['topPerformerCount', 'highPerformerCount']);
  const underperformingCount = getNumber(summary, [
    'underperformingCount',
    'lowPerformerCount',
    'needsAttentionCount',
  ]);
  const overallScore = getNumber(summary, ['overallPerformanceScore', 'overallScore']);
  const growthRate = getNumber(summary, ['growthRate', 'changePercent']);
  const consistencyRate = getNumber(summary, ['consistencyRate', 'executionConsistency']);
  const qualityScore = getNumber(summary, ['qualityScore', 'executionQuality']);

  const isLoading = teamAnalytics.isLoading;
  const isRefreshing = teamAnalytics.isRefreshing;
  const error = teamAnalytics.error;
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
    await teamAnalytics.refetch();
  }, [teamAnalytics]);

  const statCards = useMemo<StatCardItem[]>(
    () => [
      {
        key: 'overall-score',
        title: 'Overall Team Score',
        value: formatPercent(overallScore),
        subtitle: `${formatNumber(activeMembers)} active members`,
        trendText: `${formatPercent(growthRate)} growth`,
        trendTone: getTrendTone(growthRate),
        icon: <Trophy size={20} />,
      },
      {
        key: 'productivity',
        title: 'Avg Productivity',
        value: formatPercent(avgProductivity),
        subtitle: `${formatPercent(consistencyRate)} consistency`,
        trendText:
          avgProductivity >= 80
            ? 'Strong output discipline'
            : avgProductivity >= 55
              ? 'Moderate productivity balance'
              : 'Productivity needs sharper coaching',
        trendTone:
          avgProductivity >= 80 ? 'positive' : avgProductivity >= 55 ? 'neutral' : 'negative',
        icon: <Zap size={20} />,
      },
      {
        key: 'conversion',
        title: 'Avg Conversion Rate',
        value: formatPercent(avgConversionRate),
        subtitle: `${formatPercent(qualityScore)} quality score`,
        trendText:
          avgConversionRate >= 30
            ? 'Conversion engine is healthy'
            : avgConversionRate >= 15
              ? 'Conversion is stable'
              : 'Conversion pressure is high',
        trendTone:
          avgConversionRate >= 30 ? 'positive' : avgConversionRate >= 15 ? 'neutral' : 'negative',
        icon: <Target size={20} />,
      },
      {
        key: 'response-time',
        title: 'Avg Response Time',
        value: `${formatNumber(avgResponseTime)} min`,
        subtitle: `${formatPercent(avgFollowUpCompletion)} follow-up completion`,
        trendText:
          avgResponseTime <= 15
            ? 'Fast response rhythm'
            : avgResponseTime <= 45
              ? 'Response speed is acceptable'
              : 'Response delays need attention',
        trendTone:
          avgResponseTime <= 15 ? 'positive' : avgResponseTime <= 45 ? 'neutral' : 'negative',
        icon: <Clock3 size={20} />,
      },
    ],
    [
      overallScore,
      activeMembers,
      growthRate,
      avgProductivity,
      consistencyRate,
      avgConversionRate,
      qualityScore,
      avgResponseTime,
      avgFollowUpCompletion,
    ],
  );

  return (
    <div style={shellStyle}>
      <div style={containerStyle}>
        <PageHero
          title="Team Performance Analytics"
          subtitle="Track team productivity, responsiveness, conversion strength, execution quality, and coaching opportunities with a leadership-first view."
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
            title="Loading team analytics"
            description="Team productivity, leaderboard signals, and coaching insights are being prepared."
            tone="loading"
          />
        ) : null}

        {!isLoading && error && !hasAnyData ? (
          <StatusPanel
            title="Unable to load team analytics"
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
            title="No team data available"
            description="Try adjusting the active range or filters to surface performance insights."
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

            <TeamOverviewCard
              totalMembers={totalMembers}
              activeMembers={activeMembers}
              avgProductivity={avgProductivity}
              avgConversionRate={avgConversionRate}
              avgResponseTime={avgResponseTime}
              avgFollowUpCompletion={avgFollowUpCompletion}
              topPerformerCount={topPerformerCount}
              underperformingCount={underperformingCount}
            />

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: '1.05fr 0.95fr',
                gap: 16,
              }}
            >
              <TeamLeaderboardCard items={leaderboard} />
              <TeamDistributionCard items={teamDistribution} />
            </section>

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              <ActivityQualityCard items={activityQuality} />
              <CoachingNeedsCard items={coachingNeeds} />
            </section>

            <section
              style={{
                ...surfaceStyle,
                padding: 20,
              }}
            >
              <SectionHeader
                eyebrow="Signals"
                title="Leadership Insights"
                subtitle="A condensed read of what the current team pattern is really saying."
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 12,
                }}
              >
                <MetricPill
                  label="Overall Score"
                  value={formatPercent(overallScore)}
                  tone={getMetricToneByThreshold(overallScore, 85, 60)}
                />
                <MetricPill
                  label="Consistency"
                  value={formatPercent(consistencyRate)}
                  tone={getMetricToneByThreshold(consistencyRate, 80, 55)}
                />
                <MetricPill
                  label="Quality Score"
                  value={formatPercent(qualityScore)}
                  tone={getMetricToneByThreshold(qualityScore, 85, 60)}
                />
                <MetricPill
                  label="Growth Rate"
                  value={formatPercent(growthRate)}
                  tone={getMetricToneFromTrend(growthRate)}
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
                    <Award size={16} color="#15803d" />
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>Performance Read</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b' }}>
                    {overallScore >= 85
                      ? 'The team is operating with real strength. Execution quality and output rhythm look healthy.'
                      : overallScore >= 60
                        ? 'The team is stable, but not fully sharp. Process discipline can still unlock a stronger edge.'
                        : 'The team is under pressure. Productivity, coaching, and follow-up hygiene need immediate tightening.'}
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
                    <ShieldCheck size={16} color="#1d4ed8" />
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>Execution Read</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b' }}>
                    {consistencyRate >= 80
                      ? 'Execution consistency is strong. Team discipline is holding up well across cycles.'
                      : consistencyRate >= 55
                        ? 'Execution is decent, but gaps still appear in consistency and sustained follow-through.'
                        : 'Execution consistency is weak. The system likely needs clearer accountability and coaching loops.'}
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
                    <CheckCircle2 size={16} color="#0f766e" />
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>Follow-up Read</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b' }}>
                    {avgFollowUpCompletion >= 85
                      ? 'Follow-up culture looks strong. This usually protects conversion rates over time.'
                      : avgFollowUpCompletion >= 65
                        ? 'Follow-up quality is fair, but inconsistency may still be leaking opportunities.'
                        : 'Follow-up discipline is weak. That usually means missed conversion and avoidable pipeline loss.'}
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
                    <Activity size={16} color="#b91c1c" />
                    <div style={{ fontWeight: 900, color: '#0f172a' }}>Coaching Read</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b' }}>
                    {underperformingCount <= 1
                      ? 'Very few members need intervention. The team is largely self-sustaining.'
                      : underperformingCount <= 3
                        ? 'A few members need focused coaching. Smart intervention here can lift the whole team.'
                        : 'Several members need attention. This is now a structural coaching issue, not a one-off dip.'}
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

export default TeamPerformanceAnalyticsPage;