"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface AccelerometerData {
  timestamp: number
  accelerometer1: { x: number; y: number; z: number }
  accelerometer2: { x: number; y: number; z: number }
  magnitude1: number
  magnitude2: number
  impactSeverity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
}

interface RealTimeChartProps {
  data: AccelerometerData[]
  currentReading: AccelerometerData | null
}

export function RealTimeChart({ data, currentReading }: RealTimeChartProps) {
  const chartData = data.slice(-100).map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString(),
    magnitude1: d.magnitude1,
    magnitude2: d.magnitude2,
    timestamp: d.timestamp,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Magnitude Chart */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Impact Magnitude (Real-time)</CardTitle>
          <CardDescription>
            Acceleration magnitude from both sensors. Red line indicates potential concussion threshold (100g)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                <YAxis label={{ value: "Acceleration (g)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(2)}g`,
                    name === "magnitude1" ? "Sensor 1" : "Sensor 2",
                  ]}
                />
                
                <Line
                  type="monotone"
                  dataKey="magnitude1"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  name="Sensor 1"
                />
                <Line
                  type="monotone"
                  dataKey="magnitude2"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={false}
                  name="Sensor 2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Current Readings */}
      <Card>
        <CardHeader>
          <CardTitle>Sensor 1 (Front)</CardTitle>
          <CardDescription>Current acceleration values</CardDescription>
        </CardHeader>
        <CardContent>
          {currentReading ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">X-axis:</span>
                <span className="font-mono">{currentReading.accelerometer1.x.toFixed(2)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Y-axis:</span>
                <span className="font-mono">{currentReading.accelerometer1.y.toFixed(2)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Z-axis:</span>
                <span className="font-mono">{currentReading.accelerometer1.z.toFixed(2)}g</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Magnitude:</span>
                <span className="font-mono font-bold">{currentReading.magnitude1.toFixed(2)}g</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sensor 2 (Back)</CardTitle>
          <CardDescription>Current acceleration values</CardDescription>
        </CardHeader>
        <CardContent>
          {currentReading ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">X-axis:</span>
                <span className="font-mono">{currentReading.accelerometer2.x.toFixed(2)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Y-axis:</span>
                <span className="font-mono">{currentReading.accelerometer2.y.toFixed(2)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Z-axis:</span>
                <span className="font-mono">{currentReading.accelerometer2.z.toFixed(2)}g</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Magnitude:</span>
                <span className="font-mono font-bold">{currentReading.magnitude2.toFixed(2)}g</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
