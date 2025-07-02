import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// const chartConfig = {
//   passedPercentage: {
//     label: "Tỷ lệ đạt",
//     color: "#2563eb",
//   },

//   cloName: {
//     label: "CLO",
//     color: "#4b5563",
//   },
// };

export function PercentageChart({ chartData, chartConfig, dataKey }) {
  console.log("chartData: ", chartData);
  const yAxisTicks = Array.from({ length: 11 }, (_, i) => i * 10);
  return (
    <ChartContainer config={chartConfig} className="min-h-[150px] w-full max-w-[600px] mx-auto">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 10, right: 30, left: 20, bottom: 20 }} // Add margins to reduce chart size
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={dataKey}
          tickLine={false}
          tickMargin={10}
          tickFormatter={(value) => value}
          height={20} // Reduce X-axis height
        />
        <YAxis
          tickFormatter={(value) => `${value}%`}
          ticks={yAxisTicks}
          domain={[0, 100]}
          width={45} // Reduce Y-axis width
          label={{ value: 'Tỷ lệ đạt', angle: -90, position: 'insideLeft', dy: 10 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="passedPercentage"
          fill="var(--color-passedPercentage)"
          radius={4}
          barSize={40} // Reduce bar width (default is around 32)
        />
        <ReferenceLine
          y={50}
          stroke="#ff7300"
          strokeDasharray="3 3"
          label={{
            value: 'Chỉ tiêu đạt',
            position: 'insideTopRight',
            fill: '#ff7300',
            fontSize: 11 // Smaller font size for label
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
