"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertTriangle, TrendingUp } from "lucide-react"

interface AccelerometerData {
  timestamp: number
  accelerometer1: { x: number; y: number; z: number }
  accelerometer2: { x: number; y: number; z: number }
  magnitude1: number
  magnitude2: number
  impactSeverity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
}

interface ImpactAnalysisProps {
  data: AccelerometerData[]
}

export function ImpactAnalysis({ data }: ImpactAnalysisProps) {
  const highImpacts = data.filter((d) => d.impactSeverity === "HIGH" || d.impactSeverity === "CRITICAL")
  const maxImpact = Math.max(...data.map((d) => Math.max(d.magnitude1, d.magnitude2)), 0)

  const severityCount = {
    LOW: data.filter((d) => d.impactSeverity === "LOW").length,
    MODERATE: data.filter((d) => d.impactSeverity === "MODERATE").length,
    HIGH: data.filter((d) => d.impactSeverity === "HIGH").length,
    CRITICAL: data.filter((d) => d.impactSeverity === "CRITICAL").length,
  }

  const pieData = [
    { name: "Low", value: severityCount.LOW, color: "#22c55e" },
    { name: "Moderate", value: severityCount.MODERATE, color: "#eab308" },
    { name: "High", value: severityCount.HIGH, color: "#f97316" },
    { name: "Critical", value: severityCount.CRITICAL, color: "#ef4444" },
  ].filter((item) => item.value > 0)

  const timelineData = highImpacts.slice(-10).map((impact) => ({
    time: new Date(impact.timestamp).toLocaleTimeString(),
    magnitude: Math.max(impact.magnitude1, impact.magnitude2),
    severity: impact.impactSeverity,
  }))

  const getConcussionRisk = () => {
    const criticalCount = severityCount.CRITICAL
    const highCount = severityCount.HIGH

    if (criticalCount > 0)
      return { level: "CRITICAL", color: "bg-red-500", text: "Immediate medical attention required" }
    if (highCount >= 3) return { level: "HIGH", color: "bg-orange-500", text: "Multiple high impacts detected" }
    if (highCount >= 1) return { level: "MODERATE", color: "bg-yellow-500", text: "Monitor for symptoms" }
    return { level: "LOW", color: "bg-green-500", text: "No significant impacts detected" }
  }

  const risk = getConcussionRisk()

  return (
    <div className="space-y-6">
      {/* Risk Assessment */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Concussion Risk Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge className={`${risk.color} text-white text-lg px-4 py-2`}>{risk.level} RISK</Badge>
              <p className="text-gray-600 mt-2">{risk.text}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{maxImpact.toFixed(1)}g</div>
              <div className="text-sm text-gray-500">Peak Impact</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Medical Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {risk.level === "CRITICAL" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800">Immediate Action Required</h4>
                <ul className="mt-2 text-red-700 space-y-1">
                  <li>• Remove player from field immediately</li>
                  <li>• Conduct comprehensive neurological assessment</li>
                  <li>• Monitor for concussion symptoms</li>
                  <li>• Do not allow return to play without medical clearance</li>
                </ul>
              </div>
            )}

            {risk.level === "HIGH" && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-800">Caution Advised</h4>
                <ul className="mt-2 text-orange-700 space-y-1">
                  <li>• Consider removing player for assessment</li>
                  <li>• Monitor closely for symptoms</li>
                  <li>• Baseline cognitive testing recommended</li>
                </ul>
              </div>
            )}

            {risk.level === "MODERATE" && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Monitor Closely</h4>
                <ul className="mt-2 text-yellow-700 space-y-1">
                  <li>• Continue monitoring during play</li>
                  <li>• Watch for delayed symptoms</li>
                  <li>• Consider sideline assessment if symptoms appear</li>
                </ul>
              </div>
            )}

            {risk.level === "LOW" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800">Normal Activity</h4>
                <p className="mt-2 text-green-700">No immediate concerns. Continue normal monitoring protocols.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Severity Distribution</CardTitle>
            <CardDescription>Breakdown of impact levels during session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* High Impact Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>High Impact Events</CardTitle>
            <CardDescription>Timeline of significant impacts (≥100g)</CardDescription>
          </CardHeader>
          <CardContent>
            {timelineData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis label={{ value: "Magnitude (g)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value: number) => [`${value.toFixed(2)}g`, "Impact"]} />
                    <Bar
                      dataKey="magnitude"
                      //fill={(entry: any) => (entry?.severity === "CRITICAL" ? "#ef4444" : "#f97316")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">No high impact events recorded</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

