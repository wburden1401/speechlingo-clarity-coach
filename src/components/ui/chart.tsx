
import React from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";

// Define types for our chart data
interface ChartData {
  name: string;
  data: number[];
  color?: string;
}

interface ChartProps {
  data: ChartData[];
  categories?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  height?: number;
}

// Format data for recharts
const formatChartData = (data: ChartData[], categories?: string[]) => {
  if (!data.length) return [];
  
  return data[0].data.map((value, index) => {
    const point: Record<string, any> = {};
    
    // Add category/label if provided
    if (categories && categories[index]) {
      point.name = categories[index];
    } else {
      point.name = String(index + 1);
    }
    
    // Add values from all data series
    data.forEach(series => {
      point[series.name] = series.data[index];
    });
    
    return point;
  });
};

// Default color palette for charts
const defaultColors = [
  "#8b5cf6", // purple
  "#0ea5e9", // blue
  "#f97316", // orange
  "#10b981", // green
  "#ef4444", // red
];

export function LineChart({
  data,
  categories,
  showLegend = true,
  showGrid = true,
  height = 300,
}: ChartProps) {
  const formattedData = formatChartData(data, categories);
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={formattedData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
        <XAxis
          dataKey="name"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <Tooltip />
        {showLegend && <Legend />}
        {data.map((series, index) => (
          <Line
            key={series.name}
            type="monotone"
            dataKey={series.name}
            stroke={series.color || defaultColors[index % defaultColors.length]}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function BarChart({
  data,
  categories,
  showLegend = true,
  showGrid = true,
  height = 300,
}: ChartProps) {
  const formattedData = formatChartData(data, categories);
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={formattedData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
        <XAxis
          dataKey="name"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <Tooltip />
        {showLegend && <Legend />}
        {data.map((series, index) => (
          <Bar
            key={series.name}
            dataKey={series.name}
            fill={series.color || defaultColors[index % defaultColors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function AreaChart({
  data,
  categories,
  showLegend = true,
  showGrid = true,
  height = 300,
}: ChartProps) {
  const formattedData = formatChartData(data, categories);
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={formattedData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
        <XAxis
          dataKey="name"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <Tooltip />
        {showLegend && <Legend />}
        {data.map((series, index) => (
          <Area
            key={series.name}
            type="monotone"
            dataKey={series.name}
            fill={series.color || defaultColors[index % defaultColors.length]}
            stroke={series.color || defaultColors[index % defaultColors.length]}
            fillOpacity={0.2}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
