"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { User, FileText } from "lucide-react"

export function PatientInfo() {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    position: "",
    team: "",
    previousConcussions: "",
    currentSymptoms: [] as string[],
    notes: "",
  })

  const symptoms = [
    "Headache",
    "Dizziness",
    "Nausea",
    "Confusion",
    "Memory problems",
    "Balance issues",
    "Sensitivity to light",
    "Sensitivity to noise",
    "Fatigue",
    "Irritability",
  ]

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setPatientData((prev) => ({
      ...prev,
      currentSymptoms: checked ? [...prev.currentSymptoms, symptom] : prev.currentSymptoms.filter((s) => s !== symptom),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Player Information</span>
            </CardTitle>
            <CardDescription>Basic player details and medical history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={patientData.name}
                  onChange={(e) => setPatientData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter player name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={patientData.age}
                  onChange={(e) => setPatientData((prev) => ({ ...prev, age: e.target.value }))}
                  placeholder="Age"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Select onValueChange={(value) => setPatientData((prev) => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prop">Prop</SelectItem>
                    <SelectItem value="hooker">Hooker</SelectItem>
                    <SelectItem value="lock">Lock</SelectItem>
                    <SelectItem value="flanker">Flanker</SelectItem>
                    <SelectItem value="number8">Number 8</SelectItem>
                    <SelectItem value="scrumhalf">Scrum Half</SelectItem>
                    <SelectItem value="flyhalf">Fly Half</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="wing">Wing</SelectItem>
                    <SelectItem value="fullback">Fullback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="team">Team</Label>
                <Input
                  id="team"
                  value={patientData.team}
                  onChange={(e) => setPatientData((prev) => ({ ...prev, team: e.target.value }))}
                  placeholder="Team name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="previous">Previous Concussions</Label>
              <Input
                id="previous"
                value={patientData.previousConcussions}
                onChange={(e) => setPatientData((prev) => ({ ...prev, previousConcussions: e.target.value }))}
                placeholder="Number of previous concussions"
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Symptoms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Current Symptoms</span>
            </CardTitle>
            <CardDescription>Check all symptoms currently experienced</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {symptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={patientData.currentSymptoms.includes(symptom)}
                    onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                  />
                  <Label htmlFor={symptom} className="text-sm">
                    {symptom}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes and Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Notes & Assessment</CardTitle>
          <CardDescription>Additional observations and medical assessment notes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Clinical Notes</Label>
            <Textarea
              id="notes"
              value={patientData.notes}
              onChange={(e) => setPatientData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter clinical observations, test results, and assessment notes..."
              rows={6}
            />
          </div>

          <div className="flex space-x-4">
            <Button>Save Patient Data</Button>
            <Button variant="outline">Generate Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Assessment Summary */}
      {(patientData.name || patientData.currentSymptoms.length > 0) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-blue-700">
              {patientData.name && (
                <p>
                  <strong>Player:</strong> {patientData.name}
                </p>
              )}
              {patientData.position && (
                <p>
                  <strong>Position:</strong> {patientData.position}
                </p>
              )}
              {patientData.currentSymptoms.length > 0 && (
                <p>
                  <strong>Symptoms:</strong> {patientData.currentSymptoms.join(", ")}
                </p>
              )}
              {patientData.currentSymptoms.length >= 3 && (
                <p className="text-red-600 font-semibold">
                  ⚠️ Multiple symptoms present - Consider immediate assessment
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
