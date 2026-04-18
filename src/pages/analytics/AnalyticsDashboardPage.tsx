import React, { useCallback, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Briefcase,
  DollarSign,
  Download,
  Filter,
  Megaphone,
  RefreshCcw,
  Users,
} from 'lucide-react';

import useMarketingAnalytics from '../../hooks/analytics/useMarketingAnalytics';
import usePipelineAnalytics from '../../hooks/analytics/usePipelineAnalytics';
import useRevenueAnalytics from '../../hooks/analytics/useRevenueAnalytics';
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

interface DashboardFilters {
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

interface DashboardComparePeriod {
  enabled: boolean;
  type: ComparePeriodType;
}

interface DashboardStatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trendText?: string;
  trendTone?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

interface DashboardSectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

interface AnalyticsChartCardProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  minHeight?: number;
}

interface MicroStatProps {
  label: string;
  value: string;
  tone?: 'default' | 'positive' | 'warning' | 'danger';
}

interface ProgressListItemProps {
  label: string;
  sublabel?: string;
  value: number;
  rightText?: string;
}

interface TableColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  render: (row: T, index: number) => React.ReactNode;
}

const DEFAULT_FILTERS: DashboardFilters = {
  dateRange: '30d',
  teamIds: [],
  ownerIds: [],
  projectIds: [],
  sourceIds: [],
  locationIds: [],
  search: '',
};

const DEFAULT_COMPARE_PERIOD: DashboardComparePeriod = {
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
const formatMultiplier = (value: number): string => `${percentFormatter.format(value || 0)}x`;

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

const getTrendTone = (value: number): 'positive' | 'negative' | 'neutral' => {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
};

const surfaceStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 22,
  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
};

const subtleSurfaceStyle: React.CSSProperties = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 18,
};

const buttonPrimaryStyle: React.CSSProperties = {
  height: 40,
  padding: '0 14px',
  borderRadius: 12,
  border: '1px solid #0f172a',
  background: '#0f172a',
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 700,
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
  fontWeight: 700,
  cursor: 'pointer',
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

const DashboardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100%',
        background: '#f8fafc',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 1640,
          margin: '0 auto',
          display: 'grid',
          gap: 20,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const DashboardHero: React.FC<{
  title: string;
  subtitle: string;
  dateRangeLabel: string;
  compareEnabled: boolean;
}> = ({ title, subtitle, dateRangeLabel, compareEnabled }) => {
  return (
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
        <div style={{ maxWidth: 820 }}>
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
            <BarChart3 size={14} />
            Advanced Analytics Dashboard
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
            alignContent: 'start',
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
};

const DashboardToolbar: React.FC<{
  filters: DashboardFilters;
  comparePeriod: DashboardComparePeriod;
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
}) => {
  return (
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
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#64748b',
              marginBottom: 8,
            }}
          >
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
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#64748b',
              marginBottom: 8,
            }}
          >
            Search
          </div>
          <input
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects, teams, sources..."
            style={inputStyle}
          />
        </div>

        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#64748b',
              marginBottom: 8,
            }}
          >
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
};

const DashboardSectionHeader: React.FC<DashboardSectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  action,
}) => {
  return (
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

        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 900,
            color: '#0f172a',
          }}
        >
          {title}
        </h3>

        {subtitle ? (
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 13,
              color: '#64748b',
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
};

const AnalyticsChartCard: React.FC<AnalyticsChartCardProps> = ({
  title,
  subtitle,
  eyebrow,
  action,
  children,
  minHeight = 280,
}) => {
  return (
    <section
      style={{
        ...surfaceStyle,
        padding: 20,
        minHeight,
      }}
    >
      <DashboardSectionHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        action={action}
      />
      {children}
    </section>
  );
};

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  subtitle,
  trendText,
  trendTone = 'neutral',
  icon,
}) => {
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
        minHeight: 146,
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
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#64748b',
              marginBottom: 10,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: '#0f172a',
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: 8,
                fontSize: 13,
                color: '#64748b',
              }}
            >
              {subtitle}
            </div>
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
            color: toneColor,
          }}
        >
          {trendText}
        </div>
      ) : null}
    </div>
  );
};

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
      : tone === 'empty'
        ? {
            background: '#ffffff',
            borderColor: '#e2e8f0',
            iconBg: '#f1f5f9',
            iconColor: '#475569',
            titleColor: '#0f172a',
            descriptionColor: '#64748b',
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
      <div
        style={{
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
        }}
      >
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

const MicroStat: React.FC<MicroStatProps> = ({ label, value, tone = 'default' }) => {
  const color =
    tone === 'positive'
      ? '#15803d'
      : tone === 'warning'
        ? '#a16207'
        : tone === 'danger'
          ? '#b91c1c'
          : '#0f172a';

  return (
    <div
      style={{
        ...subtleSurfaceStyle,
        padding: 12,
      }}
    >
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
      <div
        style={{
          fontSize: 16,
          fontWeight: 900,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
};

const ProgressListItem: React.FC<ProgressListItemProps> = ({
  label,
  sublabel,
  value,
  rightText,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gap: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#0f172a',
            }}
          >
            {label}
          </div>
          {sublabel ? (
            <div
              style={{
                fontSize: 12,
                color: '#64748b',
                marginTop: 4,
              }}
            >
              {sublabel}
            </div>
          ) : null}
        </div>

        {rightText ? (
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: '#0f172a',
            }}
          >
            {rightText}
          </div>
        ) : null}
      </div>

      <ProgressBar value={value} />
    </div>
  );
};

function DataTable<T>({
  data,
  columns,
  emptyMessage = 'No records available.',
}: {
  data: T[];
  columns: TableColumn<T>[];
  emptyMessage?: string;
}) {
  if (!data.length) {
    return (
      <div
        style={{
          ...subtleSurfaceStyle,
          padding: 18,
          color: '#64748b',
          fontSize: 14,
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: 'auto',
        border: '1px solid #e2e8f0',
        borderRadius: 18,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: 760,
        }}
      >
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  textAlign: column.align ?? 'left',
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                  color: '#64748b',
                  padding: '14px 16px',
                  borderBottom: '1px solid #e2e8f0',
                  width: column.width,
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    textAlign: column.align ?? 'left',
                    padding: '14px 16px',
                    borderBottom:
                      rowIndex === data.length - 1 ? 'none' : '1px solid #f1f5f9',
                    fontSize: 14,
                    color: '#0f172a',
                    verticalAlign: 'middle',
                  }}
                >
                  {column.render(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const KPIStatGrid: React.FC<{ cards: DashboardStatCardProps[] }> = ({ cards }) => {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
      }}
    >
      {cards.map((card) => (
        <DashboardStatCard key={card.title} {...card} />
      ))}
    </section>
  );
};

const RevenueTargetAchievementCard: React.FC<{
  items: Array<{
    label: string;
    targetRevenue: number;
    achievedRevenue: number;
    achievementRate: number;
  }>;
}> = ({ items }) => {
  return (
    <AnalyticsChartCard
      eyebrow="Revenue"
      title="Target vs Achievement"
      subtitle="Target tracking for the selected period."
      action={
        <button type="button" style={buttonSecondaryStyle}>
          <Download size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Export
        </button>
      }
    >
      <div style={{ display: 'grid', gap: 14 }}>
        {items.slice(0, 6).map((item) => (
          <ProgressListItem
            key={item.label}
            label={item.label}
            sublabel={`${formatCurrency(item.achievedRevenue)} of ${formatCurrency(item.targetRevenue)}`}
            value={item.achievementRate}
            rightText={formatPercent(item.achievementRate)}
          />
        ))}
      </div>
    </AnalyticsChartCard>
  );
};

const PipelineFunnelCard: React.FC<{
  items: Array<{
    stageId: string;
    stageName: string;
    dealCount: number;
    dealValue: number;
    weightedValue: number;
    averageDaysInStage: number;
    conversionRateToNext: number;
    dropOffRate: number;
  }>;
}> = ({ items }) => {
  return (
    <AnalyticsChartCard
      eyebrow="Pipeline"
      title="Funnel Snapshot"
      subtitle="Stage performance, weighted value, and stage risk."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        {items.slice(0, 5).map((stage) => (
          <div
            key={stage.stageId}
            style={{
              ...subtleSurfaceStyle,
              padding: 14,
            }}
          >
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
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 900,
                    color: '#0f172a',
                  }}
                >
                  {stage.stageName}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#64748b',
                    marginTop: 4,
                  }}
                >
                  {formatNumber(stage.dealCount)} deals · {formatCurrency(stage.dealValue)}
                </div>
              </div>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#0f172a',
                }}
              >
                {formatPercent(stage.conversionRateToNext)}
              </div>
            </div>

            <ProgressBar value={stage.conversionRateToNext} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginTop: 12,
              }}
            >
              <MicroStat label="Weighted" value={formatCompactCurrency(stage.weightedValue)} />
              <MicroStat label="Avg Days" value={formatNumber(stage.averageDaysInStage)} />
              <MicroStat
                label="Drop Off"
                value={formatPercent(stage.dropOffRate)}
                tone={stage.dropOffRate > 30 ? 'danger' : 'warning'}
              />
            </div>
          </div>
        ))}
      </div>
    </AnalyticsChartCard>
  );
};

const RevenueProjectsCard: React.FC<{
  items: Array<{
    projectId: string;
    projectName: string;
    revenue: number;
    collectedRevenue: number;
    dealCount: number;
    achievementRate: number;
  }>;
}> = ({ items }) => {
  return (
    <AnalyticsChartCard
      eyebrow="Projects"
      title="Top Revenue Projects"
      subtitle="Projects with the strongest booked performance."
    >
      <DataTable
        data={items.slice(0, 6)}
        columns={[
          {
            key: 'project',
            header: 'Project',
            render: (item) => (
              <div>
                <div style={{ fontWeight: 900 }}>{item.projectName}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  {formatNumber(item.dealCount)} deals
                </div>
              </div>
            ),
          },
          {
            key: 'revenue',
            header: 'Revenue',
            align: 'right',
            render: (item) => formatCurrency(item.revenue),
          },
          {
            key: 'collected',
            header: 'Collected',
            align: 'right',
            render: (item) => formatCurrency(item.collectedRevenue),
          },
          {
            key: 'achievement',
            header: 'Achievement',
            align: 'right',
            render: (item) => formatPercent(item.achievementRate),
          },
        ]}
      />
    </AnalyticsChartCard>
  );
};

const TeamLeaderboardCard: React.FC<{
  items: Array<{
    rank: number;
    memberId: string;
    memberName: string;
    teamName: string;
    revenue: number;
    dealsWon: number;
    winRate: number;
    productivityScore: number;
  }>;
}> = ({ items }) => {
  return (
    <AnalyticsChartCard
      eyebrow="Team"
      title="Leaderboard"
      subtitle="Top performers by revenue, wins, and output quality."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        {items.slice(0, 5).map((item) => (
          <div
            key={item.memberId}
            style={{
              ...subtleSurfaceStyle,
              padding: 14,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: '#0f172a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                #{item.rank}
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 900,
                    color: '#0f172a',
                  }}
                >
                  {item.memberName}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#64748b',
                    marginTop: 4,
                  }}
                >
                  {item.teamName}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#0f172a',
                }}
              >
                {formatCurrency(item.revenue)}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#64748b',
                  marginTop: 4,
                }}
              >
                {item.dealsWon} wins · {formatPercent(item.winRate)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AnalyticsChartCard>
  );
};

const MarketingChannelsCard: React.FC<{
  items: Array<{
    channelId: string;
    channelName: string;
    spend: number;
    leads: number;
    ctr: number;
    cpl: number;
    roas: number;
  }>;
}> = ({ items }) => {
  return (
    <AnalyticsChartCard
      eyebrow="Marketing"
      title="Channel Performance"
      subtitle="Spend, lead efficiency, and return by channel."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        {items.slice(0, 4).map((item) => (
          <div
            key={item.channelId}
            style={{
              ...subtleSurfaceStyle,
              padding: 14,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.channelName}</div>
              <div style={{ fontWeight: 900, color: '#0f172a' }}>{formatMultiplier(item.roas)}</div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 10,
              }}
            >
              <MicroStat label="Spend" value={formatCurrency(item.spend)} />
              <MicroStat label="Leads" value={formatNumber(item.leads)} />
              <MicroStat label="CTR" value={formatPercent(item.ctr)} tone="positive" />
              <MicroStat label="CPL" value={formatCurrency(item.cpl)} />
            </div>
          </div>
        ))}
      </div>
    </AnalyticsChartCard>
  );
};

const CampaignWinnersCard: React.FC<{
  items: Array<{
    campaignId: string;
    campaignName: string;
    channelName: string;
    revenue: number;
    roas: number;
    leads: number;
    conversionRate: number;
  }>;
}> = ({ items }) => {
  return (
    <AnalyticsChartCard
      eyebrow="Campaigns"
      title="Campaign Winners"
      subtitle="Campaigns driving the strongest revenue output."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        {items.slice(0, 4).map((item) => (
          <div
            key={item.campaignId}
            style={{
              ...subtleSurfaceStyle,
              padding: 14,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: '#0f172a',
                marginBottom: 6,
              }}
            >
              {item.campaignName}
            </div>

            <div
              style={{
                fontSize: 12,
                color: '#64748b',
                marginBottom: 12,
              }}
            >
              {item.channelName}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 10,
              }}
            >
              <MicroStat label="Revenue" value={formatCurrency(item.revenue)} />
              <MicroStat label="ROAS" value={formatMultiplier(item.roas)} tone="positive" />
              <MicroStat label="Leads" value={formatNumber(item.leads)} />
              <MicroStat
                label="Conversion"
                value={formatPercent(item.conversionRate)}
                tone="positive"
              />
            </div>
          </div>
        ))}
      </div>
    </AnalyticsChartCard>
  );
};

const RiskWatchCard: React.FC<{
  items: Array<{
    dealId: string;
    dealName: string;
    stageName: string;
    ownerName: string;
    value: number;
    daysInStage: number;
    riskLevel: string;
  }>;
}> = ({ items }) => {
  return (
    <AnalyticsChartCard
      eyebrow="Risk"
      title="Stuck Deal Watch"
      subtitle="Deals sitting deep in stage and likely needing intervention."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        {items.slice(0, 4).map((item) => {
          const tone =
            item.riskLevel === 'critical'
              ? '#b91c1c'
              : item.riskLevel === 'high'
                ? '#c2410c'
                : item.riskLevel === 'medium'
                  ? '#a16207'
                  : '#15803d';

          return (
            <div
              key={item.dealId}
              style={{
                ...subtleSurfaceStyle,
                padding: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: '#0f172a',
                    }}
                  >
                    {item.dealName}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#64748b',
                      marginTop: 4,
                    }}
                  >
                    {item.stageName} · {item.ownerName}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: tone,
                    textTransform: 'uppercase',
                  }}
                >
                  {item.riskLevel}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  fontSize: 13,
                }}
              >
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{formatCurrency(item.value)}</span>
                <span style={{ color: '#64748b' }}>{formatNumber(item.daysInStage)} days in stage</span>
              </div>
            </div>
          );
        })}
      </div>
    </AnalyticsChartCard>
  );
};

const TeamBreakdownCard: React.FC<{
  items: Array<{
    teamId: string;
    teamName: string;
    totalMembers: number;
    activeMembers: number;
    revenue: number;
    averageWinRate: number;
    targetAchievementRate: number;
  }>;
}> = ({ items }) => {
  return (
    <AnalyticsChartCard
      eyebrow="Operations"
      title="Team Performance Breakdown"
      subtitle="Revenue, activity, and achievement by team."
    >
      <DataTable
        data={items}
        columns={[
          {
            key: 'team',
            header: 'Team',
            render: (item) => (
              <div>
                <div style={{ fontWeight: 900 }}>{item.teamName}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  {item.activeMembers}/{item.totalMembers} active
                </div>
              </div>
            ),
          },
          {
            key: 'revenue',
            header: 'Revenue',
            align: 'right',
            render: (item) => formatCurrency(item.revenue),
          },
          {
            key: 'winRate',
            header: 'Win Rate',
            align: 'right',
            render: (item) => formatPercent(item.averageWinRate),
          },
          {
            key: 'achievement',
            header: 'Achievement',
            align: 'right',
            render: (item) => formatPercent(item.targetAchievementRate),
          },
        ]}
      />
    </AnalyticsChartCard>
  );
};

const ActivityMixCard: React.FC<{
  items: Array<{
    activityType: string;
    count: number;
    percentage: number;
  }>;
}> = ({ items }) => {
  return (
    <AnalyticsChartCard
      eyebrow="Execution"
      title="Activity Mix"
      subtitle="Where operational energy is going right now."
    >
      <div style={{ display: 'grid', gap: 14 }}>
        {items.map((item) => (
          <ProgressListItem
            key={item.activityType}
            label={item.activityType}
            sublabel={`${formatNumber(item.count)} activities`}
            value={item.percentage}
            rightText={formatPercent(item.percentage)}
          />
        ))}
      </div>
    </AnalyticsChartCard>
  );
};

const ExecutiveSnapshotCard: React.FC<{
  revenueForecast: number;
  followUpsCompleted: number;
  wonDeals: number;
  averageResponseTimeHours: number;
}> = ({
  revenueForecast,
  followUpsCompleted,
  wonDeals,
  averageResponseTimeHours,
}) => {
  return (
    <AnalyticsChartCard
      eyebrow="Executive"
      title="Business Snapshot"
      subtitle="The fast pulse of the business in one glance."
      minHeight={200}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        <MicroStat label="Forecast Revenue" value={formatCompactCurrency(revenueForecast)} tone="positive" />
        <MicroStat label="Follow-ups Completed" value={formatNumber(followUpsCompleted)} />
        <MicroStat label="Won Deals" value={formatNumber(wonDeals)} tone="positive" />
        <MicroStat
          label="Avg Response Time"
          value={`${percentFormatter.format(averageResponseTimeHours)}h`}
          tone="warning"
        />
      </div>
    </AnalyticsChartCard>
  );
};

const AnalyticsDashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);
  const [comparePeriod, setComparePeriod] =
    useState<DashboardComparePeriod>(DEFAULT_COMPARE_PERIOD);

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

  const marketingAnalytics = useMarketingAnalytics({
    initialFilters: sharedFilters,
    initialComparePeriod: sharedComparePeriod,
    useMockOnError: true,
  });

  const pipelineAnalytics = usePipelineAnalytics({
    initialFilters: sharedFilters,
    initialComparePeriod: sharedComparePeriod,
    useMockOnError: true,
  });

  const revenueAnalytics = useRevenueAnalytics({
    initialFilters: sharedFilters,
    initialComparePeriod: sharedComparePeriod,
    useMockOnError: true,
  });

  const teamPerformanceAnalytics = useTeamPerformanceAnalytics({
    initialFilters: sharedFilters,
    initialComparePeriod: sharedComparePeriod,
    useMockOnError: true,
  });

  const isLoading =
    marketingAnalytics.isLoading ||
    pipelineAnalytics.isLoading ||
    revenueAnalytics.isLoading ||
    teamPerformanceAnalytics.isLoading;

  const isRefreshing =
    marketingAnalytics.isRefreshing ||
    pipelineAnalytics.isRefreshing ||
    revenueAnalytics.isRefreshing ||
    teamPerformanceAnalytics.isRefreshing;

  const combinedError =
    marketingAnalytics.error ||
    pipelineAnalytics.error ||
    revenueAnalytics.error ||
    teamPerformanceAnalytics.error ||
    null;

  const hasAnyData = Boolean(
    marketingAnalytics.data ||
      pipelineAnalytics.data ||
      revenueAnalytics.data ||
      teamPerformanceAnalytics.data,
  );

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
    await Promise.all([
      marketingAnalytics.refetch(),
      pipelineAnalytics.refetch(),
      revenueAnalytics.refetch(),
      teamPerformanceAnalytics.refetch(),
    ]);
  }, [marketingAnalytics, pipelineAnalytics, revenueAnalytics, teamPerformanceAnalytics]);

  const statCards = useMemo<DashboardStatCardProps[]>(() => {
    const revenueSummary = revenueAnalytics.data?.summary;
    const pipelineSummary = pipelineAnalytics.data?.summary;
    const marketingSummary = marketingAnalytics.data?.summary;
    const teamSummary = teamPerformanceAnalytics.data?.summary;

    return [
      {
        title: 'Total Revenue',
        value: formatCompactCurrency(revenueSummary?.totalRevenue ?? 0),
        subtitle: `Collected ${formatCompactCurrency(revenueSummary?.collectedRevenue ?? 0)}`,
        trendText: `${formatPercent(revenueSummary?.revenueGrowthRate ?? 0)} growth`,
        trendTone: getTrendTone(revenueSummary?.revenueGrowthRate ?? 0),
        icon: <DollarSign size={20} />,
      },
      {
        title: 'Pipeline Value',
        value: formatCompactCurrency(pipelineSummary?.totalPipelineValue ?? 0),
        subtitle: `Weighted ${formatCompactCurrency(pipelineSummary?.weightedPipelineValue ?? 0)}`,
        trendText: `${formatPercent(pipelineSummary?.overallConversionRate ?? 0)} overall conversion`,
        trendTone: 'positive',
        icon: <Briefcase size={20} />,
      },
      {
        title: 'Marketing ROAS',
        value: formatMultiplier(marketingSummary?.returnOnAdSpend ?? 0),
        subtitle: `${formatNumber(marketingSummary?.totalLeads ?? 0)} total leads`,
        trendText: `${formatPercent(marketingSummary?.clickThroughRate ?? 0)} CTR`,
        trendTone: 'positive',
        icon: <Megaphone size={20} />,
      },
      {
        title: 'Team Achievement',
        value: formatPercent(teamSummary?.targetAchievementRate ?? 0),
        subtitle: `${formatNumber(teamSummary?.activeMembers ?? 0)} active members`,
        trendText: `${formatPercent(teamSummary?.averageWinRate ?? 0)} avg win rate`,
        trendTone: 'positive',
        icon: <Users size={20} />,
      },
    ];
  }, [
    marketingAnalytics.data?.summary,
    pipelineAnalytics.data?.summary,
    revenueAnalytics.data?.summary,
    teamPerformanceAnalytics.data?.summary,
  ]);

  return (
    <DashboardShell>
      <DashboardHero
        title="Analytics Dashboard"
        subtitle="Revenue, funnel momentum, team execution, and marketing efficiency — shaped into a cleaner operating picture for sharper decisions."
        dateRangeLabel={getDateRangeLabel(filters.dateRange)}
        compareEnabled={comparePeriod.enabled}
      />

      <DashboardToolbar
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
          title="Loading analytics"
          description="Pulling revenue, pipeline, team, and marketing intelligence into one view."
          tone="loading"
        />
      ) : null}

      {!isLoading && combinedError && !hasAnyData ? (
        <StatusPanel
          title="Unable to load analytics"
          description={combinedError}
          tone="error"
          action={
            <button type="button" onClick={handleRefresh} style={buttonPrimaryStyle}>
              Retry
            </button>
          }
        />
      ) : null}

      {!isLoading && !combinedError && !hasAnyData ? (
        <StatusPanel
          title="No analytics available"
          description="Try changing the current filters or date range to pull in more records."
          tone="empty"
        />
      ) : null}

      {hasAnyData ? (
        <>
          <KPIStatGrid cards={statCards} />

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1.15fr 0.85fr',
              gap: 16,
            }}
          >
            <RevenueTargetAchievementCard
              items={revenueAnalytics.data?.targetVsAchievement ?? []}
            />
            <PipelineFunnelCard items={pipelineAnalytics.data?.funnel ?? []} />
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: 16,
            }}
          >
            <RevenueProjectsCard
              items={revenueAnalytics.data?.projectPerformance ?? []}
            />
            <TeamLeaderboardCard
              items={teamPerformanceAnalytics.data?.leaderboard ?? []}
            />
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 16,
            }}
          >
            <MarketingChannelsCard
              items={marketingAnalytics.data?.channelPerformance ?? []}
            />
            <CampaignWinnersCard
              items={marketingAnalytics.data?.campaignPerformance ?? []}
            />
            <RiskWatchCard items={pipelineAnalytics.data?.stuckDeals ?? []} />
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
            }}
          >
            <TeamBreakdownCard
              items={teamPerformanceAnalytics.data?.teamBreakdown ?? []}
            />
            <ActivityMixCard
              items={teamPerformanceAnalytics.data?.activityDistribution ?? []}
            />
          </section>

          <ExecutiveSnapshotCard
            revenueForecast={revenueAnalytics.data?.summary?.forecastRevenue ?? 0}
            followUpsCompleted={teamPerformanceAnalytics.data?.summary?.followUpsCompleted ?? 0}
            wonDeals={revenueAnalytics.data?.summary?.wonDealsCount ?? 0}
            averageResponseTimeHours={
              teamPerformanceAnalytics.data?.summary?.averageResponseTimeHours ?? 0
            }
          />
        </>
      ) : null}
    </DashboardShell>
  );
};

export default AnalyticsDashboardPage;