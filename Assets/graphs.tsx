import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import Svg, {
  Line,
  Path,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
  Text as SvgText,
  Polygon,
} from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format large numbers with K, M, B suffixes
 */
const formatNumber = (value: number, decimals: number = 1): string => {
  if (value >= 1e9) return (value / 1e9).toFixed(decimals) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(decimals) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(decimals) + 'K';
  return value.toFixed(2);
};

/**
 * Get safe Y-scale with zero-range protection
 */
const getSafeYScale = (minValue: number, maxValue: number, innerHeight: number) => {
  let min = minValue;
  let max = maxValue;

  // Handle zero-range: add 5% buffer
  if (Math.abs(max - min) < 0.01) {
    const buffer = Math.max(Math.abs(max) * 0.05, 0.1);
    min = max - buffer;
    max = max + buffer;
  }

  const range = max - min || 1;

  return {
    yScale: (value: number) => innerHeight - ((value - min) / range) * innerHeight,
    min,
    max,
    range,
  };
};

/**
 * Get safe X-scale for single or multiple data points
 */
const getSafeXScale = (dataLength: number, innerWidth: number) => {
  if (dataLength === 1) {
    return (index: number) => innerWidth / 2;
  }
  return (index: number) => (index / (dataLength - 1)) * innerWidth;
};

// ============================================================================
// COLOR SCHEMES
// ============================================================================

export const COLOR_SCHEMES = {
  default: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'],
  ocean: ['#0369a1', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981'],
  sunset: ['#dc2626', '#f97316', '#f59e0b', '#eab308', '#ca8a04'],
  forest: ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac'],
  purple: ['#6b21a8', '#9333ea', '#a855f7', '#c084fc', '#e9d5ff'],
  pastel: ['#fbbf24', '#fb7185', '#a78bfa', '#86efac', '#60a5fa'],
  neon: ['#ff006e', '#00d9ff', '#00ff00', '#ffbe0b', '#ff006e'],
  cyberpunk: ['#00f5ff', '#ff00ff', '#00ff00', '#ffff00', '#ff0080'],
  earthy: ['#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24'],
  cool: ['#06b6d4', '#0891b2', '#0e7490', '#164e63', '#083344'],
};

const BASE_COLORS = {
  background: '#111111',
  surface: '#1a1a1a',
  border: '#333333',
  text: '#D9D9D9',
  textLight: '#888888',
  gridLine: '#2a2a2a',
};

// Animated wrapper component
const AnimatedChart: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, delay]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BASE_COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: BASE_COLORS.border,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5F48F5',
    marginBottom: 4,
    letterSpacing: 1.5,
    fontFamily: 'Jura-Bold',
  },
  subtitle: {
    fontSize: 11,
    color: BASE_COLORS.textLight,
    marginBottom: 16,
    fontFamily: 'Jura-Bold',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: BASE_COLORS.text,
    fontFamily: 'Jura-Bold',
  },
  tooltip: {
    backgroundColor: BASE_COLORS.text,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  tooltipText: {
    color: BASE_COLORS.background,
    fontSize: 12,
    fontWeight: '500',
  },
});

// ============================================================================
// AREA CHART
// ============================================================================

interface AreaChartProps {
  data: Array<{ name: string; value: number; secondary?: number }>;
  title?: string;
  subtitle?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  title = 'Area Chart',
  subtitle,
  height = 300,
  showGrid = true,
  showLegend = true,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const chartWidth = screenWidth - 80;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.secondary || 0)));
  const { yScale, min, max, range } = getSafeYScale(0, maxValue, innerHeight);
  const xScale = getSafeXScale(data.length, innerWidth);

  const generatePath = (accessor: (d: any) => number) => {
    let path = `M ${padding.left} ${padding.top + yScale(accessor(data[0]))}`;
    data.forEach((d, i) => {
      path += ` L ${padding.left + xScale(i)} ${padding.top + yScale(accessor(d))}`;
    });
    path += ` L ${padding.left + innerWidth} ${padding.top + innerHeight}`;
    path += ` L ${padding.left} ${padding.top + innerHeight} Z`;
    return path;
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={height}>
          <Defs>
            <LinearGradient id="areaGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={chartColors[0]} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={chartColors[0]} stopOpacity="0.02" />
            </LinearGradient>
            <LinearGradient id="areaGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={chartColors[1]} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={chartColors[1]} stopOpacity="0.01" />
            </LinearGradient>
          </Defs>

          {showGrid &&
            Array.from({ length: 5 }).map((_, i) => (
              <Line
                key={`grid-${i}`}
                x1={padding.left}
                y1={padding.top + (i * innerHeight) / 4}
                x2={padding.left + innerWidth}
                y2={padding.top + (i * innerHeight) / 4}
                stroke={BASE_COLORS.gridLine}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            ))}

          {Array.from({ length: 5 }).map((_, i) => {
            const value = Math.round((maxValue * (4 - i)) / 4);
            return (
              <SvgText
                key={`y-label-${i}`}
                x={padding.left - 8}
                y={padding.top + (i * innerHeight) / 4 + 5}
                fontSize="11"
                fill={BASE_COLORS.textLight}
                textAnchor="end"
              >
                {value}
              </SvgText>
            );
          })}

          <Path d={generatePath(d => d.value)} fill="url(#areaGrad1)" />
          {data.some(d => d.secondary) && (
            <Path d={generatePath(d => d.secondary || 0)} fill="url(#areaGrad2)" />
          )}

          <Path
            d={`M ${padding.left} ${padding.top + yScale(data[0].value)} ${data
              .map((d, i) => `L ${padding.left + xScale(i)} ${padding.top + yScale(d.value)}`)
              .join(' ')}`}
            stroke={chartColors[0]}
            strokeWidth="2"
            fill="none"
          />

          {data.some(d => d.secondary) && (
            <Path
              d={`M ${padding.left} ${padding.top + yScale(data[0].secondary || 0)} ${data
                .map((d, i) => `L ${padding.left + xScale(i)} ${padding.top + yScale(d.secondary || 0)}`)
                .join(' ')}`}
              stroke={chartColors[1]}
              strokeWidth="2"
              fill="none"
            />
          )}

          {data.map((d, i) => (
            <Circle
              key={`point-${i}`}
              cx={padding.left + xScale(i)}
              cy={padding.top + yScale(d.value)}
              r="3"
              fill="#fff"
              stroke={chartColors[0]}
              strokeWidth="2"
            />
          ))}

          {data.map((d, i) => (
            <SvgText
              key={`x-label-${i}`}
              x={padding.left + xScale(i)}
              y={padding.top + innerHeight + 20}
              fontSize="11"
              fill={BASE_COLORS.textLight}
              textAnchor="middle"
            >
              {d.name}
            </SvgText>
          ))}
        </Svg>
      </View>

      {showLegend && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: chartColors[0] }]} />
            <Text style={styles.legendText}>Primary</Text>
          </View>
          {data.some(d => d.secondary) && (
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: chartColors[1] }]} />
              <Text style={styles.legendText}>Secondary</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// ============================================================================
// BAR CHART
// ============================================================================

interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  subtitle?: string;
  height?: number;
  showLegend?: boolean;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
  variant?: 'vertical' | 'horizontal';
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title = 'Bar Chart',
  subtitle,
  height = 300,
  showLegend = true,
  colors,
  colorScheme = 'default',
  variant = 'vertical',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const chartWidth = screenWidth - 80;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (innerWidth / data.length) * 0.7;
  const barSpacing = innerWidth / data.length;
  const yScale = (value: number) => innerHeight - (value / maxValue) * innerHeight;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={height}>
          <Defs>
            <LinearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={chartColors[0]} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={chartColors[0]} stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {Array.from({ length: 5 }).map((_, i) => (
            <Line
              key={`grid-${i}`}
              x1={padding.left}
              y1={padding.top + (i * innerHeight) / 4}
              x2={padding.left + innerWidth}
              y2={padding.top + (i * innerHeight) / 4}
              stroke={BASE_COLORS.gridLine}
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}

          {Array.from({ length: 5 }).map((_, i) => {
            const value = Math.round((maxValue * (4 - i)) / 4);
            return (
              <SvgText
                key={`y-label-${i}`}
                x={padding.left - 8}
                y={padding.top + (i * innerHeight) / 4 + 5}
                fontSize="11"
                fill={BASE_COLORS.textLight}
                textAnchor="end"
              >
                {value}
              </SvgText>
            );
          })}

          {data.map((d, i) => {
            const barHeight = yScale(d.value);
            const xPosition = padding.left + i * barSpacing + (barSpacing - barWidth) / 2;
            const yPosition = padding.top + barHeight;
            return (
              <G key={`bar-${i}`}>
                <Rect
                  x={xPosition}
                  y={yPosition}
                  width={barWidth}
                  height={innerHeight - barHeight}
                  fill="url(#barGrad)"
                  rx="4"
                />
                <SvgText
                  x={xPosition + barWidth / 2}
                  y={padding.top + innerHeight + 20}
                  fontSize="11"
                  fill={BASE_COLORS.textLight}
                  textAnchor="middle"
                >
                  {d.name}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      {showLegend && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: chartColors[0] }]} />
            <Text style={styles.legendText}>Values</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// ============================================================================
// HORIZONTAL BAR CHART
// ============================================================================

interface HorizontalBarChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  subtitle?: string;
  width?: number;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  title = 'Horizontal Bar Chart',
  subtitle,
  width = screenWidth - 32,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const height = data.length * 50 + 60;
  const padding = { top: 10, right: 60, bottom: 20, left: 110 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const barHeight = (innerHeight / data.length) * 0.7;
  const barSpacing = innerHeight / data.length;
  const xScale = (value: number) => (value / maxValue) * innerWidth;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={[styles.chartContainer, { alignItems: 'flex-start' }]}>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="hBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={chartColors[0]} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={chartColors[0]} stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {Array.from({ length: 5 }).map((_, i) => (
            <Line
              key={`grid-${i}`}
              x1={padding.left + (i * innerWidth) / 4}
              y1={padding.top}
              x2={padding.left + (i * innerWidth) / 4}
              y2={padding.top + innerHeight}
              stroke={BASE_COLORS.gridLine}
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}

          {Array.from({ length: 5 }).map((_, i) => {
            const value = Math.round((maxValue * i) / 4);
            return (
              <SvgText
                key={`x-label-${i}`}
                x={padding.left + (i * innerWidth) / 4}
                y={padding.top + innerHeight + 15}
                fontSize="11"
                fill={BASE_COLORS.textLight}
                textAnchor="middle"
              >
                {value}
              </SvgText>
            );
          })}

          {data.map((d, i) => {
            const barWidth = xScale(d.value);
            const yPosition = padding.top + i * barSpacing + (barSpacing - barHeight) / 2;
            return (
              <G key={`bar-${i}`}>
                <Rect
                  x={padding.left}
                  y={yPosition}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#hBarGrad)"
                  rx="4"
                />
                <SvgText
                  x={padding.left - 10}
                  y={yPosition + barHeight / 2 + 4}
                  fontSize="12"
                  fill={BASE_COLORS.text}
                  textAnchor="end"
                  fontWeight="500"
                >
                  {d.name}
                </SvgText>
                <SvgText
                  x={padding.left + barWidth + 8}
                  y={yPosition + barHeight / 2 + 4}
                  fontSize="11"
                  fill={BASE_COLORS.textLight}
                  fontWeight="500"
                >
                  {d.value}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

// ============================================================================
// MULTIPLE BAR CHART
// ============================================================================

interface MultipleBarChartProps {
  data: Array<{ name: string; [key: string]: number | string }>;
  keys: string[];
  title?: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const MultipleBarChart: React.FC<MultipleBarChartProps> = ({
  data,
  keys,
  title = 'Multiple Bar Chart',
  subtitle,
  height = 300,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const chartWidth = screenWidth - 80;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.flatMap(d => keys.map(k => (typeof d[k] === 'number' ? (d[k] as number) : 0))));
  const groupWidth = (innerWidth / data.length) * 0.8;
  const groupSpacing = innerWidth / data.length;
  const barWidth = groupWidth / keys.length;
  const yScale = (value: number) => innerHeight - (value / maxValue) * innerHeight;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={height}>
          <Defs>
            {keys.map((_, idx) => (
              <LinearGradient key={`mBarGrad-${idx}`} id={`mBarGrad${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={chartColors[idx % chartColors.length]} stopOpacity="0.8" />
                <Stop offset="100%" stopColor={chartColors[idx % chartColors.length]} stopOpacity="1" />
              </LinearGradient>
            ))}
          </Defs>

          {Array.from({ length: 5 }).map((_, i) => (
            <Line
              key={`grid-${i}`}
              x1={padding.left}
              y1={padding.top + (i * innerHeight) / 4}
              x2={padding.left + innerWidth}
              y2={padding.top + (i * innerHeight) / 4}
              stroke={BASE_COLORS.gridLine}
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}

          {Array.from({ length: 5 }).map((_, i) => {
            const value = Math.round((maxValue * (4 - i)) / 4);
            return (
              <SvgText
                key={`y-label-${i}`}
                x={padding.left - 8}
                y={padding.top + (i * innerHeight) / 4 + 5}
                fontSize="11"
                fill={BASE_COLORS.textLight}
                textAnchor="end"
              >
                {value}
              </SvgText>
            );
          })}

          {data.map((d, groupIdx) => (
            <G key={`group-${groupIdx}`}>
              {keys.map((key, keyIdx) => {
                const value = typeof d[key] === 'number' ? (d[key] as number) : 0;
                const barHeight = yScale(value);
                const xPosition =
                  padding.left + groupIdx * groupSpacing + (groupSpacing - groupWidth) / 2 + keyIdx * barWidth;
                const yPosition = padding.top + barHeight;
                return (
                  <Rect
                    key={`bar-${groupIdx}-${keyIdx}`}
                    x={xPosition}
                    y={yPosition}
                    width={barWidth - 2}
                    height={innerHeight - barHeight}
                    fill={`url(#mBarGrad${keyIdx})`}
                    rx="3"
                  />
                );
              })}
              <SvgText
                x={padding.left + groupIdx * groupSpacing + groupSpacing / 2}
                y={padding.top + innerHeight + 20}
                fontSize="11"
                fill={BASE_COLORS.textLight}
                textAnchor="middle"
              >
                {d.name}
              </SvgText>
            </G>
          ))}
        </Svg>
      </View>

      <View style={styles.legend}>
        {keys.map((key, idx) => (
          <View key={`legend-${idx}`} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: chartColors[idx % chartColors.length] }]} />
            <Text style={styles.legendText}>{key}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// STACKED BAR CHART
// ============================================================================

interface StackedBarChartProps {
  data: Array<{ name: string; [key: string]: number | string }>;
  keys: string[];
  title?: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  keys,
  title = 'Stacked Bar Chart',
  subtitle,
  height = 300,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const chartWidth = screenWidth - 80;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const barWidth = (innerWidth / data.length) * 0.7;
  const barSpacing = innerWidth / data.length;

  const maxValue = Math.max(
    ...data.map(d => keys.reduce((sum, key) => sum + (typeof d[key] === 'number' ? (d[key] as number) : 0), 0))
  );

  const yScale = (value: number) => innerHeight - (value / maxValue) * innerHeight;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={height}>
          <Defs>
            {keys.map((_, idx) => (
              <LinearGradient key={`sBarGrad-${idx}`} id={`sBarGrad${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={chartColors[idx % chartColors.length]} stopOpacity="0.8" />
                <Stop offset="100%" stopColor={chartColors[idx % chartColors.length]} stopOpacity="1" />
              </LinearGradient>
            ))}
          </Defs>

          {Array.from({ length: 5 }).map((_, i) => (
            <Line
              key={`grid-${i}`}
              x1={padding.left}
              y1={padding.top + (i * innerHeight) / 4}
              x2={padding.left + innerWidth}
              y2={padding.top + (i * innerHeight) / 4}
              stroke={BASE_COLORS.gridLine}
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}

          {Array.from({ length: 5 }).map((_, i) => {
            const value = Math.round((maxValue * (4 - i)) / 4);
            return (
              <SvgText
                key={`y-label-${i}`}
                x={padding.left - 8}
                y={padding.top + (i * innerHeight) / 4 + 5}
                fontSize="11"
                fill={BASE_COLORS.textLight}
                textAnchor="end"
              >
                {value}
              </SvgText>
            );
          })}

          {data.map((d, groupIdx) => {
            let yOffset = 0;
            return (
              <G key={`group-${groupIdx}`}>
                {keys.map((key, keyIdx) => {
                  const value = typeof d[key] === 'number' ? (d[key] as number) : 0;
                  const segmentHeight = yScale(value) - (innerHeight - yScale(yOffset));
                  const xPosition = padding.left + groupIdx * barSpacing + (barSpacing - barWidth) / 2;
                  const yPosition = padding.top + innerHeight - yScale(yOffset) - segmentHeight;

                  yOffset += value;

                  return (
                    <Rect
                      key={`segment-${groupIdx}-${keyIdx}`}
                      x={xPosition}
                      y={yPosition}
                      width={barWidth}
                      height={segmentHeight}
                      fill={`url(#sBarGrad${keyIdx})`}
                      rx={keyIdx === 0 ? 4 : 0}
                    />
                  );
                })}
                <SvgText
                  x={padding.left + groupIdx * barSpacing + barSpacing / 2}
                  y={padding.top + innerHeight + 20}
                  fontSize="11"
                  fill={BASE_COLORS.textLight}
                  textAnchor="middle"
                >
                  {d.name}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      <View style={styles.legend}>
        {keys.map((key, idx) => (
          <View key={`legend-${idx}`} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: chartColors[idx % chartColors.length] }]} />
            <Text style={styles.legendText}>{key}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// MIXED BAR CHART (Bar + Line)
// ============================================================================

interface MixedBarChartProps {
  data: Array<{ name: string; bar: number; line: number }>;
  title?: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const MixedBarChart: React.FC<MixedBarChartProps> = ({
  data,
  title = 'Mixed Bar Chart',
  subtitle,
  height = 300,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const chartWidth = screenWidth - 80;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxBarValue = Math.max(...data.map(d => d.bar));
  const maxLineValue = Math.max(...data.map(d => d.line));
  const barYScale = (value: number) => innerHeight - (value / maxBarValue) * innerHeight;
  const lineYScale = (value: number) => innerHeight - (value / maxLineValue) * innerHeight;
  const barWidth = (innerWidth / data.length) * 0.5;
  const barSpacing = innerWidth / data.length;
  const xScale = (index: number) => (index / (data.length - 1)) * innerWidth;

  const linePath = `M ${padding.left} ${padding.top + lineYScale(data[0].line)} ${data
    .map((d, i) => `L ${padding.left + xScale(i)} ${padding.top + lineYScale(d.line)}`)
    .join(' ')}`;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={height}>
          <Defs>
            <LinearGradient id="mixedBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={chartColors[0]} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={chartColors[0]} stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="mixedLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={chartColors[1]} stopOpacity="0.2" />
              <Stop offset="100%" stopColor={chartColors[1]} stopOpacity="0.01" />
            </LinearGradient>
          </Defs>

          {Array.from({ length: 5 }).map((_, i) => (
            <Line
              key={`grid-${i}`}
              x1={padding.left}
              y1={padding.top + (i * innerHeight) / 4}
              x2={padding.left + innerWidth}
              y2={padding.top + (i * innerHeight) / 4}
              stroke={BASE_COLORS.gridLine}
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}

          {Array.from({ length: 5 }).map((_, i) => {
            const value = Math.round((maxBarValue * (4 - i)) / 4);
            return (
              <SvgText
                key={`y-label-${i}`}
                x={padding.left - 8}
                y={padding.top + (i * innerHeight) / 4 + 5}
                fontSize="11"
                fill={BASE_COLORS.textLight}
                textAnchor="end"
              >
                {value}
              </SvgText>
            );
          })}

          {data.map((d, i) => {
            const barHeight = barYScale(d.bar);
            const xPosition = padding.left + i * barSpacing + (barSpacing - barWidth) / 2;
            const yPosition = padding.top + barHeight;
            return (
              <Rect
                key={`bar-${i}`}
                x={xPosition}
                y={yPosition}
                width={barWidth}
                height={innerHeight - barHeight}
                fill="url(#mixedBarGrad)"
                rx="4"
              />
            );
          })}

          <Path
            d={`${linePath} L ${padding.left + innerWidth} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`}
            fill="url(#mixedLineGrad)"
          />

          <Path
            d={linePath}
            stroke={chartColors[1]}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((d, i) => (
            <Circle
              key={`dot-${i}`}
              cx={padding.left + xScale(i)}
              cy={padding.top + lineYScale(d.line)}
              r="4"
              fill="#fff"
              stroke={chartColors[1]}
              strokeWidth="2"
            />
          ))}

          {data.map((d, i) => (
            <SvgText
              key={`x-label-${i}`}
              x={padding.left + i * barSpacing + barSpacing / 2}
              y={padding.top + innerHeight + 20}
              fontSize="11"
              fill={BASE_COLORS.textLight}
              textAnchor="middle"
            >
              {d.name}
            </SvgText>
          ))}
        </Svg>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: chartColors[0] }]} />
          <Text style={styles.legendText}>Bar Values</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: chartColors[1] }]} />
          <Text style={styles.legendText}>Line Trend</Text>
        </View>
      </View>
    </View>
  );
};

// ============================================================================
// PIE CHART WITH LABELS
// ============================================================================

interface PieChartLabelProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  subtitle?: string;
  size?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const PieChartLabel: React.FC<PieChartLabelProps> = ({
  data,
  title = 'Pie Chart',
  subtitle,
  size = 320,
  showLegend = true,
  showLabels = true,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 50;
  const labelRadius = radius + 50;

  let startAngle = -90;
  const slices = data.map((d, i) => {
    const sliceAngle = (d.value / total) * 360;
    const endAngle = startAngle + sliceAngle;
    const midAngle = startAngle + sliceAngle / 2;

    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const labelX = centerX + labelRadius * Math.cos((midAngle * Math.PI) / 180);
    const labelY = centerY + labelRadius * Math.sin((midAngle * Math.PI) / 180);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const result = {
      path,
      color: chartColors[i % chartColors.length],
      percentage: ((d.value / total) * 100).toFixed(1),
      labelX,
      labelY,
      midAngle,
    };
    startAngle = endAngle;
    return result;
  });

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          {slices.map((slice, i) => (
            <Path key={`slice-${i}`} d={slice.path} fill={slice.color} stroke="#fff" strokeWidth="2" />
          ))}

          {showLabels &&
            slices.map((slice, i) => (
              <G key={`label-${i}`}>
                <SvgText
                  x={slice.labelX}
                  y={slice.labelY}
                  fontSize="12"
                  fill={BASE_COLORS.text}
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {slice.percentage}%
                </SvgText>
                <SvgText
                  x={slice.labelX}
                  y={slice.labelY + 14}
                  fontSize="10"
                  fill={BASE_COLORS.textLight}
                  textAnchor="middle"
                >
                  {data[i].name}
                </SvgText>
              </G>
            ))}

          <Circle
            cx={centerX}
            cy={centerY}
            r="40"
            fill={BASE_COLORS.background}
            stroke={BASE_COLORS.border}
            strokeWidth="1"
          />
        </Svg>
      </View>

      {showLegend && (
        <View style={styles.legend}>
          {data.map((d, i) => (
            <View key={`legend-${i}`} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: slices[i].color }]} />
              <Text style={styles.legendText}>
                {d.name} ({slices[i].percentage}%)
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// ============================================================================
// LINE CHART
// ============================================================================

interface LineChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  subtitle?: string;
  height?: number;
  showDots?: boolean;
  showArea?: boolean;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title = 'Line Chart',
  subtitle,
  height = 300,
  showDots = true,
  showArea = true,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const chartWidth = screenWidth - 80;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.subtitle}>No data available</Text>
      </View>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const { yScale, min, max, range } = getSafeYScale(minValue, maxValue, innerHeight);
  const xScale = getSafeXScale(data.length, innerWidth);

  const linePath = `M ${padding.left} ${padding.top + yScale(data[0].value)} ${data
    .map((d, i) => `L ${padding.left + xScale(i)} ${padding.top + yScale(d.value)}`)
    .join(' ')}`;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={height}>
          <Defs>
            <LinearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={chartColors[0]} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={chartColors[0]} stopOpacity="0.01" />
            </LinearGradient>
          </Defs>

          {Array.from({ length: 5 }).map((_, i) => (
            <Line
              key={`grid-${i}`}
              x1={padding.left}
              y1={padding.top + (i * innerHeight) / 4}
              x2={padding.left + innerWidth}
              y2={padding.top + (i * innerHeight) / 4}
              stroke={BASE_COLORS.gridLine}
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}

          {Array.from({ length: 5 }).map((_, i) => {
            const value = min + (range * (4 - i)) / 4;
            return (
              <SvgText
                key={`y-label-${i}`}
                x={padding.left - 8}
                y={padding.top + (i * innerHeight) / 4 + 5}
                fontSize="11"
                fill={BASE_COLORS.textLight}
                textAnchor="end"
              >
                {formatNumber(value, 2)}
              </SvgText>
            );
          })}

          <Path
            d={linePath}
            stroke={chartColors[0]}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {showArea && (
            <Path
              d={`${linePath} L ${padding.left + innerWidth} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`}
              fill="url(#lineGrad)"
            />
          )}

          {showDots &&
            data.map((d, i) => (
              <Circle
                key={`dot-${i}`}
                cx={padding.left + xScale(i)}
                cy={padding.top + yScale(d.value)}
                r="4"
                fill="#fff"
                stroke={chartColors[0]}
                strokeWidth="2"
              />
            ))}

          {data.map((d, i) => (
            <SvgText
              key={`x-label-${i}`}
              x={padding.left + xScale(i)}
              y={padding.top + innerHeight + 20}
              fontSize="11"
              fill={BASE_COLORS.textLight}
              textAnchor="middle"
            >
              {d.name}
            </SvgText>
          ))}
        </Svg>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: chartColors[0] }]} />
          <Text style={styles.legendText}>Trend</Text>
        </View>
      </View>
    </View>
  );
};

// ============================================================================
// PIE CHART
// ============================================================================

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  subtitle?: string;
  size?: number;
  showLegend?: boolean;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title = 'Pie Chart',
  subtitle,
  size = 280,
  showLegend = true,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 40;

  let startAngle = -90;
  const slices = data.map((d, i) => {
    const sliceAngle = (d.value / total) * 360;
    const endAngle = startAngle + sliceAngle;

    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const result = {
      path,
      color: chartColors[i % chartColors.length],
      percentage: ((d.value / total) * 100).toFixed(1),
    };
    startAngle = endAngle;
    return result;
  });

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          {slices.map((slice, i) => (
            <Path key={`slice-${i}`} d={slice.path} fill={slice.color} stroke="#fff" strokeWidth="2" />
          ))}
          <Circle
            cx={centerX}
            cy={centerY}
            r="60"
            fill={BASE_COLORS.background}
            stroke={BASE_COLORS.border}
            strokeWidth="1"
          />
        </Svg>
      </View>

      {showLegend && (
        <View style={styles.legend}>
          {data.map((d, i) => (
            <View key={`legend-${i}`} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: slices[i].color }]} />
              <Text style={styles.legendText}>
                {d.name} ({slices[i].percentage}%)
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// ============================================================================
// RADAR CHART
// ============================================================================

interface RadarChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  subtitle?: string;
  size?: number;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  title = 'Radar Chart',
  subtitle,
  size = 300,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const centerX = size / 2;
  const centerY = size / 2;
  const maxValue = Math.max(...data.map(d => d.value));
  const levels = 5;
  const angle = (Math.PI * 2) / data.length;

  const getCoordinates = (index: number, value: number) => {
    const x = centerX + (value / maxValue) * 80 * Math.cos(angle * index - Math.PI / 2);
    const y = centerY + (value / maxValue) * 80 * Math.sin(angle * index - Math.PI / 2);
    return { x, y };
  };

  const points = data.map((d, i) => getCoordinates(i, d.value));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={chartColors[0]} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={chartColors[0]} stopOpacity="0.1" />
            </LinearGradient>
          </Defs>

          {Array.from({ length: levels }).map((_, i) => {
            const radius = ((i + 1) / levels) * 80;
            return (
              <Circle
                key={`level-${i}`}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={BASE_COLORS.gridLine}
                strokeWidth="1"
              />
            );
          })}

          {data.map((_, i) => {
            const coord = getCoordinates(i, maxValue);
            return (
              <Line
                key={`axis-${i}`}
                x1={centerX}
                y1={centerY}
                x2={coord.x}
                y2={coord.y}
                stroke={BASE_COLORS.gridLine}
                strokeWidth="1"
              />
            );
          })}

          <Path d={pathData} fill="url(#radarGrad)" stroke={chartColors[0]} strokeWidth="2" />

          {points.map((p, i) => (
            <Circle key={`point-${i}`} cx={p.x} cy={p.y} r="4" fill="#fff" stroke={chartColors[0]} strokeWidth="2" />
          ))}

          {data.map((d, i) => {
            const labelCoord = getCoordinates(i, maxValue * 1.2);
            return (
              <SvgText
                key={`label-${i}`}
                x={labelCoord.x}
                y={labelCoord.y}
                fontSize="11"
                fill={BASE_COLORS.text}
                textAnchor="middle"
              >
                {d.name}
              </SvgText>
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

// ============================================================================
// SCATTER CHART
// ============================================================================

interface ScatterChartProps {
  data: Array<{ name: string; x: number; y: number }>;
  title?: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const ScatterChart: React.FC<ScatterChartProps> = ({
  data,
  title = 'Scatter Chart',
  subtitle,
  height = 300,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const chartWidth = screenWidth - 80;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxX = Math.max(...data.map(d => d.x));
  const maxY = Math.max(...data.map(d => d.y));

  const xScale = (value: number) => (value / maxX) * innerWidth;
  const yScale = (value: number) => innerHeight - (value / maxY) * innerHeight;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={height}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Line
              key={`grid-x-${i}`}
              x1={padding.left + (i * innerWidth) / 4}
              y1={padding.top}
              x2={padding.left + (i * innerWidth) / 4}
              y2={padding.top + innerHeight}
              stroke={BASE_COLORS.gridLine}
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}

          {Array.from({ length: 5 }).map((_, i) => (
            <Line
              key={`grid-y-${i}`}
              x1={padding.left}
              y1={padding.top + (i * innerHeight) / 4}
              x2={padding.left + innerWidth}
              y2={padding.top + (i * innerHeight) / 4}
              stroke={BASE_COLORS.gridLine}
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}

          {data.map((d, i) => (
            <Circle
              key={`point-${i}`}
              cx={padding.left + xScale(d.x)}
              cy={padding.top + yScale(d.y)}
              r="5"
              fill={chartColors[i % chartColors.length]}
              opacity="0.7"
            />
          ))}

          <Line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={padding.left + innerWidth}
            y2={padding.top + innerHeight}
            stroke={BASE_COLORS.text}
            strokeWidth="2"
          />
          <Line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + innerHeight}
            stroke={BASE_COLORS.text}
            strokeWidth="2"
          />
        </Svg>
      </View>
    </View>
  );
};

// ============================================================================
// DONUT CHART
// ============================================================================

interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  subtitle?: string;
  size?: number;
  innerRadius?: number;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title = 'Donut Chart',
  subtitle,
  size = 280,
  innerRadius = 60,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 40;

  let startAngle = -90;
  const slices = data.map((d, i) => {
    const sliceAngle = (d.value / total) * 360;
    const endAngle = startAngle + sliceAngle;

    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const ix1 = centerX + innerRadius * Math.cos((startAngle * Math.PI) / 180);
    const iy1 = centerY + innerRadius * Math.sin((startAngle * Math.PI) / 180);
    const ix2 = centerX + innerRadius * Math.cos((endAngle * Math.PI) / 180);
    const iy2 = centerY + innerRadius * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;

    const result = {
      path,
      color: chartColors[i % chartColors.length],
      percentage: ((d.value / total) * 100).toFixed(1),
    };
    startAngle = endAngle;
    return result;
  });

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          {slices.map((slice, i) => (
            <Path key={`slice-${i}`} d={slice.path} fill={slice.color} stroke="#fff" strokeWidth="2" />
          ))}
        </Svg>
      </View>

      <View style={styles.legend}>
        {data.map((d, i) => (
          <View key={`legend-${i}`} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: slices[i].color }]} />
            <Text style={styles.legendText}>
              {d.name} ({slices[i].percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// GAUGE CHART
// ============================================================================

interface GaugeChartProps {
  value: number;
  maxValue?: number;
  title?: string;
  subtitle?: string;
  size?: number;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value = 0,
  maxValue = 100,
  title = 'Gauge Chart',
  subtitle,
  size = 280,
  colors,
  colorScheme = 'default',
}) => {
  const safeValue = Math.max(0, Math.min(value, maxValue));
  const safeMaxValue = Math.max(1, maxValue);
  const percentage = (safeValue / safeMaxValue) * 100;
  const angle = (percentage / 100) * 180;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = Math.max(40, size / 2 - 40);
  const arcRadius = Math.max(30, radius - 10);

  const endX = centerX + arcRadius * Math.cos(((angle - 180) * Math.PI) / 180);
  const endY = centerY + arcRadius * Math.sin(((angle - 180) * Math.PI) / 180);

  // Dynamic red → yellow → green interpolation based on percentage
  const getDynamicColor = (pct: number): string => {
    if (colors) return colors[0]; // respect explicit color override
    if (pct <= 50) {
      const t = pct / 50;
      const r = Math.round(239 + (255 - 239) * t);
      const g = Math.round(68  + (215 - 68)  * t);
      const b = Math.round(68  + (0   - 68)  * t);
      return `rgb(${r},${g},${b})`;
    } else {
      const t = (pct - 50) / 50;
      const r = Math.round(255 + (67  - 255) * t);
      const g = Math.round(215 + (251 - 215) * t);
      const b = 0;
      return `rgb(${r},${g},${b})`;
    }
  };

  const arcColor = getDynamicColor(percentage);

  return (
    <AnimatedChart>
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        <View style={styles.chartContainer}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>

            {/* Background arc */}
            <Path
              d={`M ${centerX - arcRadius} ${centerY} A ${arcRadius} ${arcRadius} 0 0 1 ${centerX + arcRadius} ${centerY}`}
              fill="none"
              stroke={BASE_COLORS.gridLine}
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Progress arc — dynamic color */}
            {angle > 0 && (
              <Path
                d={`M ${centerX - arcRadius} ${centerY} A ${arcRadius} ${arcRadius} 0 ${angle > 90 ? 1 : 0} 1 ${endX} ${endY}`}
                fill="none"
                stroke={arcColor}
                strokeWidth="10"
                strokeLinecap="round"
              />
            )}

            {/* Center circle */}
            <Circle
              cx={centerX}
              cy={centerY}
              r="50"
              fill={BASE_COLORS.background}
              stroke={arcColor}
              strokeWidth="1.5"
            />

            {/* Percentage text */}
            <SvgText
              x={120}
              y={centerY}
              fontSize="26"
              fontWeight="700"
              fill={arcColor}
              textAnchor="middle"
              alignmentBaseline="central"
            >
              {Math.round(percentage)} %
            </SvgText>
          </Svg>
        </View>
      </View>
    </AnimatedChart>
  );
};

// ============================================================================
// FUNNEL CHART
// ============================================================================

interface FunnelChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({
  data,
  title = 'Funnel Chart',
  subtitle,
  height = 350,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const chartWidth = screenWidth - 80;
  const padding = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const segmentHeight = innerHeight / data.length;

  return (
    <AnimatedChart>
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        <View style={styles.chartContainer}>
          <Svg width={chartWidth} height={height}>
            {data.map((d, i) => {
              const percentage = (d.value / maxValue) * 100;
              const width = (percentage / 100) * innerWidth;
              const xOffset = (innerWidth - width) / 2;
              const yPosition = padding.top + i * segmentHeight;

              return (
                <G key={`funnel-${i}`}>
                  <Rect
                    x={padding.left + xOffset}
                    y={yPosition}
                    width={width}
                    height={segmentHeight - 4}
                    fill={chartColors[i % chartColors.length]}
                    opacity="0.8"
                    rx="2"
                  />
                  <SvgText
                    x={padding.left + innerWidth / 2}
                    y={yPosition + segmentHeight / 2 + 6}
                    fontSize="13"
                    fill={BASE_COLORS.text}
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {d.name}
                  </SvgText>
                  <SvgText
                    x={padding.left + innerWidth / 2 + width / 2 + 10}
                    y={yPosition + segmentHeight / 2 + 6}
                    fontSize="11"
                    fill={BASE_COLORS.textLight}
                    fontWeight="500"
                  >
                    {d.value}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View>
      </View>
    </AnimatedChart>
  );
};

// ============================================================================
// WATERFALL CHART
// ============================================================================

interface WaterfallChartProps {
  data: Array<{ name: string; value: number; isTotal?: boolean }>;
  title?: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  colorScheme?: keyof typeof COLOR_SCHEMES;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  data,
  title = 'Waterfall Chart',
  subtitle,
  height = 300,
  colors,
  colorScheme = 'default',
}) => {
  const chartColors = colors || COLOR_SCHEMES[colorScheme];
  const chartWidth = screenWidth - 80;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => Math.abs(d.value)));
  const barWidth = (innerWidth / data.length) * 0.7;
  const barSpacing = innerWidth / data.length;

  let cumulativeValue = 0;
  const yScale = (value: number) => innerHeight - (value / maxValue) * innerHeight;

  return (
    <AnimatedChart>
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        <View style={styles.chartContainer}>
          <Svg width={chartWidth} height={height}>
            <Defs>
              <LinearGradient id="waterfallPos" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={chartColors[0]} stopOpacity="0.8" />
                <Stop offset="100%" stopColor={chartColors[0]} stopOpacity="1" />
              </LinearGradient>
              <LinearGradient id="waterfallNeg" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={chartColors[2]} stopOpacity="0.8" />
                <Stop offset="100%" stopColor={chartColors[2]} stopOpacity="1" />
              </LinearGradient>
            </Defs>

            {Array.from({ length: 5 }).map((_, i) => (
              <Line
                key={`grid-${i}`}
                x1={padding.left}
                y1={padding.top + (i * innerHeight) / 4}
                x2={padding.left + innerWidth}
                y2={padding.top + (i * innerHeight) / 4}
                stroke={BASE_COLORS.gridLine}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            ))}

            {data.map((d, i) => {
              const xPosition = padding.left + i * barSpacing + (barSpacing - barWidth) / 2;
              const isPositive = d.value >= 0;
              const barHeight = yScale(Math.abs(d.value));
              let yPosition = padding.top + innerHeight - barHeight;

              if (!d.isTotal && i > 0) {
                yPosition = padding.top + innerHeight - yScale(cumulativeValue + d.value);
              }

              cumulativeValue += d.value;

              return (
                <G key={`bar-${i}`}>
                  <Rect
                    x={xPosition}
                    y={yPosition}
                    width={barWidth}
                    height={barHeight}
                    fill={d.isTotal || isPositive ? 'url(#waterfallPos)' : 'url(#waterfallNeg)'}
                    rx="3"
                  />
                  {i < data.length - 1 && (
                    <Line
                      x1={xPosition + barWidth}
                      y1={yPosition}
                      x2={padding.left + (i + 1) * barSpacing + (barSpacing - barWidth) / 2}
                      y2={yPosition}
                      stroke={BASE_COLORS.gridLine}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  )}
                  <SvgText
                    x={xPosition + barWidth / 2}
                    y={padding.top + innerHeight + 20}
                    fontSize="11"
                    fill={BASE_COLORS.textLight}
                    textAnchor="middle"
                  >
                    {d.name}
                  </SvgText>
                  <SvgText
                    x={xPosition + barWidth / 2}
                    y={yPosition - 5}
                    fontSize="10"
                    fill={BASE_COLORS.text}
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {d.value}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View>
      </View>
    </AnimatedChart>
  );
};

// ============================================================================
// CANDLESTICK CHART (Stock/OHLC)
// ============================================================================

interface CandleData {
  name: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  // Flexible OHLC structure support
  opening?: number;
  closing?: number;
}

interface CandlestickChartProps {
  data: CandleData[];
  title?: string;
  subtitle?: string;
  height?: number;
  colors?: { up: string; down: string };
}

/**
 * Normalize candle data to standard structure
 */
const normalizeCandleData = (data: CandleData[]) => {
  return data.map(d => ({
    name: d.name,
    open: d.open ?? d.opening ?? 0,
    high: d.high ?? 0,
    low: d.low ?? 0,
    close: d.close ?? d.closing ?? 0,
  }));
};

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  title = 'Candlestick Chart',
  subtitle,
  height = 320,
  colors = { up: '#10b981', down: '#ef4444' },
}) => {
  if (!data || data.length === 0) {
    return (
      <AnimatedChart>
        <View style={styles.container}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.subtitle}>No data available</Text>
        </View>
      </AnimatedChart>
    );
  }

  const normalizedData = normalizeCandleData(data);
  const chartWidth = screenWidth - 80;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxHigh = Math.max(...normalizedData.map(d => d.high));
  const minLow = Math.min(...normalizedData.map(d => d.low));
  const { yScale, min, max, range } = getSafeYScale(minLow, maxHigh, innerHeight);
  const candleWidth = Math.max(4, (innerWidth / normalizedData.length) * 0.6);
  const candleSpacing = innerWidth / normalizedData.length;

  return (
    <AnimatedChart>
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        <View style={styles.chartContainer}>
          <Svg width={chartWidth} height={height}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Line
                key={`grid-${i}`}
                x1={padding.left}
                y1={padding.top + (i * innerHeight) / 4}
                x2={padding.left + innerWidth}
                y2={padding.top + (i * innerHeight) / 4}
                stroke={BASE_COLORS.gridLine}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            ))}

            {Array.from({ length: 5 }).map((_, i) => {
              const value = min + (range * (4 - i)) / 4;
              return (
                <SvgText
                  key={`y-label-${i}`}
                  x={padding.left - 8}
                  y={padding.top + (i * innerHeight) / 4 + 5}
                  fontSize="11"
                  fill={BASE_COLORS.textLight}
                  textAnchor="end"
                >
                  {formatNumber(value, 2)}
                </SvgText>
              );
            })}

            {normalizedData.map((d, i) => {
              const xCenter = padding.left + (i + 0.5) * candleSpacing;
              const isUp = d.close >= d.open;
              const candleColor = isUp ? colors.up : colors.down;

              const highY = padding.top + yScale(d.high);
              const lowY = padding.top + yScale(d.low);
              const openY = padding.top + yScale(d.open);
              const closeY = padding.top + yScale(d.close);

              const topY = Math.min(openY, closeY);
              const bottomY = Math.max(openY, closeY);
              const bodyHeight = Math.max(1, bottomY - topY);

              return (
                <G key={`candle-${i}`}>
                  {/* Wick */}
                  <Line x1={xCenter} y1={highY} x2={xCenter} y2={lowY} stroke={candleColor} strokeWidth="1" opacity="0.6" />

                  {/* Body */}
                  <Rect
                    x={xCenter - candleWidth / 2}
                    y={topY}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={candleColor}
                    stroke={candleColor}
                    strokeWidth="0.5"
                    opacity={isUp ? 0.7 : 0.9}
                    rx="1"
                  />

                  {/* Label */}
                  <SvgText
                    x={xCenter}
                    y={padding.top + innerHeight + 20}
                    fontSize="10"
                    fill={BASE_COLORS.textLight}
                    textAnchor="middle"
                  >
                    {d.name}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.up }]} />
            <Text style={styles.legendText}>Up</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.down }]} />
            <Text style={styles.legendText}>Down</Text>
          </View>
        </View>
      </View>
    </AnimatedChart>
  );
};

// ============================================================================
// TOOLTIP COMPONENT
// ============================================================================

interface TooltipProps {
  visible: boolean;
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ visible, text }) => {
  if (!visible) return null;
  return (
    <View style={styles.tooltip}>
      <Text style={styles.tooltipText}>{text}</Text>
    </View>
  );
};

// ============================================================================
// DEMO SHOWCASE
// ============================================================================

export const ChartShowcase = () => {
  const areaData = [
    { name: 'Jan', value: 400, secondary: 240 },
    { name: 'Feb', value: 300, secondary: 221 },
    { name: 'Mar', value: 200, secondary: 229 },
    { name: 'Apr', value: 278, secondary: 200 },
    { name: 'May', value: 189, secondary: 220 },
  ];

  const barData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
  ];

  const horizontalBarData = [
    { name: 'Product A', value: 420 },
    { name: 'Product B', value: 380 },
    { name: 'Product C', value: 290 },
    { name: 'Product D', value: 450 },
    { name: 'Product E', value: 320 },
  ];

  const multipleBarData = [
    { name: 'Q1', Sales: 400, Revenue: 240, Profit: 120 },
    { name: 'Q2', Sales: 300, Revenue: 221, Profit: 110 },
    { name: 'Q3', Sales: 200, Revenue: 229, Profit: 95 },
    { name: 'Q4', Sales: 278, Revenue: 200, Profit: 140 },
  ];

  const stackedBarData = [
    { name: 'Jan', Desktop: 200, Mobile: 150, Tablet: 100 },
    { name: 'Feb', Desktop: 220, Mobile: 180, Tablet: 120 },
    { name: 'Mar', Desktop: 180, Mobile: 200, Tablet: 140 },
    { name: 'Apr', Desktop: 250, Mobile: 190, Tablet: 160 },
  ];

  const mixedBarData = [
    { name: 'Jan', bar: 400, line: 65 },
    { name: 'Feb', bar: 300, line: 78 },
    { name: 'Mar', bar: 200, line: 90 },
    { name: 'Apr', bar: 278, line: 81 },
    { name: 'May', bar: 189, line: 56 },
  ];

  const lineData = [
    { name: 'Day 1', value: 65 },
    { name: 'Day 2', value: 78 },
    { name: 'Day 3', value: 90 },
    { name: 'Day 4', value: 81 },
    { name: 'Day 5', value: 56 },
    { name: 'Day 6', value: 85 },
    { name: 'Day 7', value: 92 },
  ];

  const pieData = [
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 300 },
    { name: 'Product D', value: 200 },
  ];

  const radarData = [
    { name: 'Speed', value: 72 },
    { name: 'Power', value: 85 },
    { name: 'Range', value: 65 },
    { name: 'Efficiency', value: 78 },
    { name: 'Durability', value: 90 },
  ];

  const scatterData = [
    { name: 'Point A', x: 45, y: 67 },
    { name: 'Point B', x: 78, y: 82 },
    { name: 'Point C', x: 32, y: 45 },
    { name: 'Point D', x: 65, y: 70 },
    { name: 'Point E', x: 88, y: 92 },
    { name: 'Point F', x: 50, y: 38 },
  ];

  const funnelData = [
    { name: 'Visitors', value: 10000 },
    { name: 'Sign Ups', value: 7200 },
    { name: 'Trial Users', value: 4500 },
    { name: 'Paid Users', value: 2800 },
  ];

  const waterfallData = [
    { name: 'Start', value: 1000 },
    { name: 'Revenue', value: 500 },
    { name: 'Costs', value: -300 },
    { name: 'Taxes', value: -100 },
    { name: 'End', value: 0, isTotal: true },
  ];

  const candleData = [
    { name: 'Mon', open: 100, high: 120, low: 95, close: 110 },
    { name: 'Tue', open: 110, high: 125, low: 105, close: 115 },
    { name: 'Wed', open: 115, high: 118, low: 108, close: 112 },
    { name: 'Thu', open: 112, high: 130, low: 110, close: 128 },
    { name: 'Fri', open: 128, high: 132, low: 120, close: 125 },
  ];

  return (
    <ScrollView style={{ backgroundColor: BASE_COLORS.surface, flex: 1 }}>
      <View style={{ paddingVertical: 16, paddingHorizontal: 16 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: BASE_COLORS.text, marginBottom: 4 }}>
            Premium Charts
          </Text>
          <Text style={{ fontSize: 14, color: BASE_COLORS.textLight }}>
            Advanced library with animations
          </Text>
        </View>

        <Text style={{ fontSize: 14, fontWeight: '600', color: BASE_COLORS.text, marginTop: 16, marginBottom: 8 }}>
          BASIC CHARTS
        </Text>
        <AreaChart data={areaData} title="Area Chart" subtitle="Monthly revenue trends" />
        <BarChart data={barData} title="Bar Chart - Vertical" subtitle="Sales performance" />
        <LineChart data={lineData} title="Line Chart" subtitle="Daily analytics" />

        <Text style={{ fontSize: 14, fontWeight: '600', color: BASE_COLORS.text, marginTop: 16, marginBottom: 8 }}>
          BAR CHART VARIANTS
        </Text>
        <HorizontalBarChart data={horizontalBarData} title="Bar Chart - Horizontal" colorScheme="ocean" />
        <MultipleBarChart
          data={multipleBarData}
          keys={['Sales', 'Revenue', 'Profit']}
          title="Bar Chart - Multiple"
          colorScheme="sunset"
        />
        <StackedBarChart
          data={stackedBarData}
          keys={['Desktop', 'Mobile', 'Tablet']}
          title="Bar Chart - Stacked + Legend"
          colorScheme="forest"
        />
        <MixedBarChart data={mixedBarData} title="Bar Chart - Mixed (Bar + Line)" colorScheme="purple" />

        <Text style={{ fontSize: 14, fontWeight: '600', color: BASE_COLORS.text, marginTop: 16, marginBottom: 8 }}>
          PIE CHARTS
        </Text>
        <PieChartLabel data={pieData} title="Pie Chart - Label" colorScheme="ocean" />
        <PieChart data={pieData} title="Pie Chart - Classic" colorScheme="sunset" />
        <DonutChart data={pieData} title="Donut Chart" colorScheme="pastel" />

        <Text style={{ fontSize: 14, fontWeight: '600', color: BASE_COLORS.text, marginTop: 16, marginBottom: 8 }}>
          ADVANCED CHARTS
        </Text>
        <RadarChart data={radarData} title="Radar Chart" colorScheme="forest" />
        <ScatterChart data={scatterData} title="Scatter Chart" colorScheme="neon" />

        <Text style={{ fontSize: 14, fontWeight: '600', color: BASE_COLORS.text, marginTop: 16, marginBottom: 8 }}>
          NEW FEATURES
        </Text>
        <GaugeChart value={75} maxValue={100} title="Gauge Chart" subtitle="Performance metric" colorScheme="ocean" />
        <FunnelChart data={funnelData} title="Funnel Chart" subtitle="Conversion funnel" colorScheme="sunset" />
        <WaterfallChart data={waterfallData} title="Waterfall Chart" subtitle="Financial breakdown" colorScheme="forest" />
        <CandlestickChart data={candleData} title="Candlestick Chart" subtitle="Stock prices (OHLC)" />

        <Text style={{ fontSize: 14, fontWeight: '600', color: BASE_COLORS.text, marginTop: 16, marginBottom: 8 }}>
          CUSTOM COLORS
        </Text>
        <AreaChart data={areaData} title="Custom Colors" colors={['#ff1493', '#00ced1', '#ffd700']} />
      </View>
    </ScrollView>
  );
};

export default ChartShowcase;