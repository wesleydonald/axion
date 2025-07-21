"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Play, Pause, RotateCcw, AlertTriangle, Activity } from "lucide-react"
import Image from "next/image"
import { RealTimeChart } from "@/components/real-time-chart"
import { ImpactAnalysis } from "@/components/impact-analysis"
import { DataExport } from "@/components/data-export"
import { PatientInfo } from "@/components/patient-info"

interface AccelerometerData {
  timestamp: number
  accelerometer1: { x: number; y: number; z: number }
  accelerometer2: { x: number; y: number; z: number }
  magnitude1: number
  magnitude2: number
  impactSeverity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
}

export default function AxionDashboard() {
  const [isRecording, setIsRecording] = useState(false)
  const [data, setData] = useState<AccelerometerData[]>([])
  const [currentReading, setCurrentReading] = useState<AccelerometerData | null>(null)
  const [alerts, setAlerts] = useState<string[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate real-time accelerometer data
  const generateMockData = (): AccelerometerData => {
    const baseAccel = () => ({
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4,
      z: 9.8 + (Math.random() - 0.5) * 2,
    })

    const accel1 = baseAccel()
    const accel2 = baseAccel()

    // Occasionally simulate high impact
    if (Math.random() < 0.05) {
      accel1.x *= 5
      accel1.y *= 5
      accel2.x *= 4
      accel2.y *= 4
    }

    const magnitude1 = Math.sqrt(accel1.x ** 2 + accel1.y ** 2 + accel1.z ** 2)
    const magnitude2 = Math.sqrt(accel2.x ** 2 + accel2.y ** 2 + accel2.z ** 2)

    const maxMagnitude = Math.max(magnitude1, magnitude2)
    let impactSeverity: AccelerometerData["impactSeverity"] = "LOW"

    if (maxMagnitude > 50) impactSeverity = "CRITICAL"
    else if (maxMagnitude > 30) impactSeverity = "HIGH"
    else if (maxMagnitude > 15) impactSeverity = "MODERATE"

    return {
      timestamp: Date.now(),
      accelerometer1: accel1,
      accelerometer2: accel2,
      magnitude1,
      magnitude2,
      impactSeverity,
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    intervalRef.current = setInterval(() => {
      const newData = generateMockData()
      setCurrentReading(newData)
      setData((prev) => [...prev.slice(-999), newData]) // Keep last 1000 readings

      if (newData.impactSeverity === "HIGH" || newData.impactSeverity === "CRITICAL") {
        const alertMsg = `${newData.impactSeverity} impact detected at ${new Date(newData.timestamp).toLocaleTimeString()}`
        setAlerts((prev) => [alertMsg, ...prev.slice(0, 4)])
      }
    }, 100) // 10Hz sampling rate
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetData = () => {
    setData([])
    setCurrentReading(null)
    setAlerts([])
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500"
      case "HIGH":
        return "bg-orange-500"
      case "MODERATE":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <Image src="/axion-logo.png" alt="AXION Logo" width={60} height={60} className="rounded-lg" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AXION Concussion Tracker</h1>
              <p className="text-gray-600">Real-time impact monitoring system</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
            >
              {isRecording ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isRecording ? "Stop" : "Start"} Monitoring
            </Button>
            <Button onClick={resetData} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRecording ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                <span className="text-2xl font-bold">{isRecording ? "ACTIVE" : "INACTIVE"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Impact</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className={currentReading ? getSeverityColor(currentReading.impactSeverity) : "bg-gray-300"}>
                  {currentReading?.impactSeverity || "NO DATA"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.length.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Impacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {data.filter((d) => d.impactSeverity === "HIGH" || d.impactSeverity === "CRITICAL").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert, index) => (
              <Alert key={index} className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Impact Alert</AlertTitle>
                <AlertDescription className="text-red-700">{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="realtime" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="realtime">Real-time Data</TabsTrigger>
            <TabsTrigger value="analysis">Impact Analysis</TabsTrigger>
            <TabsTrigger value="patient">Patient Info</TabsTrigger>
            <TabsTrigger value="export">Data Export</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime">
            <RealTimeChart data={data} currentReading={currentReading} />
          </TabsContent>

          <TabsContent value="analysis">
            <ImpactAnalysis data={data} />
          </TabsContent>

          <TabsContent value="patient">
            <PatientInfo />
          </TabsContent>

          <TabsContent value="export">
            <DataExport data={data} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
