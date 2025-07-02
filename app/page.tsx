"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Send, FileText, Users, Package, Droplets, Trash2, Sparkles, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import SignaturePad from "@/components/signature-pad"
import AddressMap from "@/components/address-map"

export default function FSEComplianceSystem() {
  const { toast } = useToast()

  // Background Information (Part 1 - Not scored)
  const [backgroundInfo, setBackgroundInfo] = useState({
    facilityName: "",
    address: "",
    ownerName: "",
    phoneNumber: "",
    email: "",
    inspectorName: "",
    inspectionDate: "",
    facilityType: "",
    coordinates: { lat: 0, lng: 0 },
  })

  // Scoring sections
  const [documentation, setDocumentation] = useState({
    hygieneCertificate: false,
    businessPermit: false,
    suitabilityPermit: false,
    hygienePermit: false,
  })

  const [personalHygiene, setPersonalHygiene] = useState({
    handWashing: "",
    protectiveClothing: "",
    hairCovering: "",
    jewelryRemoval: "",
    healthStatus: "",
  })

  const [materialSourcing, setMaterialSourcing] = useState({
    supplierApproval: "",
    ingredientQuality: "",
    storageConditions: "",
    expiryDateCheck: "",
  })

  const [waterSources, setWaterSources] = useState({
    waterQuality: "",
    storageConditions: "",
  })

  const [wasteDisposal, setWasteDisposal] = useState({
    wasteSegregation: "",
    disposalMethod: "",
    pestControl: "",
    drainageMaintenance: "",
  })

  const [cleaning, setCleaning] = useState({
    cleaningSchedule: "",
    sanitizationProcedures: "",
  })

  const [signatures, setSignatures] = useState({
    inspector: "",
    facilityOwner: "",
  })
  const [showSignatures, setShowSignatures] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const [currentTab, setCurrentTab] = useState("background")
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [starRating, setStarRating] = useState(0)

  const calculateScore = () => {
    if (!signatures.inspector || !signatures.facilityOwner) {
      toast({
        title: "Signatures Required",
        description: "Both inspector and facility owner signatures are required to complete the assessment.",
        variant: "destructive",
      })
      return
    }

    let totalScore = 0

    // Documentation (20 marks - 5 marks each)
    const docScore = Object.values(documentation).filter(Boolean).length * 5

    // Personal Hygiene (20 marks - 4 marks each)
    const hygieneScore = Object.values(personalHygiene).filter((val) => val === "excellent").length * 4

    // Material Sourcing (20 marks - 5 marks each)
    const sourcingScore = Object.values(materialSourcing).filter((val) => val === "excellent").length * 5

    // Water Sources (10 marks - 5 marks each)
    const waterScore = Object.values(waterSources).filter((val) => val === "excellent").length * 5

    // Waste Disposal (20 marks - 5 marks each)
    const wasteScore = Object.values(wasteDisposal).filter((val) => val === "excellent").length * 5

    // Cleaning (10 marks - 5 marks each)
    const cleaningScore = Object.values(cleaning).filter((val) => val === "excellent").length * 5

    totalScore = docScore + hygieneScore + sourcingScore + waterScore + wasteScore + cleaningScore

    // Calculate star rating
    let stars = 1
    if (totalScore >= 90) stars = 5
    else if (totalScore >= 80) stars = 4
    else if (totalScore >= 70) stars = 3
    else if (totalScore >= 60) stars = 2

    setFinalScore(totalScore)
    setStarRating(stars)
    setAssessmentComplete(true)

    // Simulate SMS sending
    sendSMSNotification(totalScore, stars)
  }

  const sendSMSNotification = (score: number, stars: number) => {
    const message = `FSE Assessment Complete for ${backgroundInfo.facilityName}. Score: ${score}/100 (${stars} stars). ${score >= 70 ? "Compliant" : "Requires Improvement"}.`

    toast({
      title: "SMS Sent Successfully",
      description: `Message sent to ${backgroundInfo.phoneNumber}: ${message}`,
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-6 h-6 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getComplianceLevel = (score: number) => {
    if (score >= 90) return { level: "Excellent", color: "bg-green-500" }
    if (score >= 80) return { level: "Good", color: "bg-blue-500" }
    if (score >= 70) return { level: "Satisfactory", color: "bg-yellow-500" }
    if (score >= 60) return { level: "Needs Improvement", color: "bg-orange-500" }
    return { level: "Poor", color: "bg-red-500" }
  }

  const handleLocationSelect = (coordinates: { lat: number; lng: number }, address: string) => {
    setBackgroundInfo({
      ...backgroundInfo,
      coordinates,
      address,
    })
    setShowMap(false)
    toast({
      title: "Location Selected",
      description: "Address and coordinates have been updated.",
    })
  }

  if (assessmentComplete) {
    const compliance = getComplianceLevel(finalScore)

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Assessment Results</CardTitle>
            <CardDescription>{backgroundInfo.facilityName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">{finalScore}/100</div>
              <div className="flex justify-center space-x-1">{renderStars(starRating)}</div>
              <Badge className={`${compliance.color} text-white text-lg px-4 py-2`}>{compliance.level}</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Facility Information</h3>
                <p>
                  <strong>Name:</strong> {backgroundInfo.facilityName}
                </p>
                <p>
                  <strong>Owner:</strong> {backgroundInfo.ownerName}
                </p>
                <p>
                  <strong>Phone:</strong> {backgroundInfo.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong> {backgroundInfo.address}
                </p>
                {backgroundInfo.coordinates.lat !== 0 && (
                  <p>
                    <strong>Coordinates:</strong> {backgroundInfo.coordinates.lat.toFixed(6)},{" "}
                    {backgroundInfo.coordinates.lng.toFixed(6)}
                  </p>
                )}
                <p>
                  <strong>Inspector:</strong> {backgroundInfo.inspectorName}
                </p>
                <p>
                  <strong>Date:</strong> {backgroundInfo.inspectionDate}
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Inspector Signature:</p>
                    <div className="border rounded p-2 bg-gray-50">
                      <img
                        src={signatures.inspector || "/placeholder.svg"}
                        alt="Inspector Signature"
                        className="max-h-16"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Facility Owner Signature:</p>
                    <div className="border rounded p-2 bg-gray-50">
                      <img
                        src={signatures.facilityOwner || "/placeholder.svg"}
                        alt="Facility Owner Signature"
                        className="max-h-16"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Score Breakdown</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Documentation:</span>
                    <span>{Object.values(documentation).filter(Boolean).length * 5}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Personal Hygiene:</span>
                    <span>{Object.values(personalHygiene).filter((val) => val === "excellent").length * 4}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material Sourcing:</span>
                    <span>{Object.values(materialSourcing).filter((val) => val === "excellent").length * 5}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Sources:</span>
                    <span>{Object.values(waterSources).filter((val) => val === "excellent").length * 5}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waste Disposal:</span>
                    <span>{Object.values(wasteDisposal).filter((val) => val === "excellent").length * 5}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning:</span>
                    <span>{Object.values(cleaning).filter((val) => val === "excellent").length * 5}/10</span>
                  </div>
                </div>

                {/* Location Map in Results */}
                {backgroundInfo.coordinates.lat !== 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Facility Location</h4>
                    <div className="h-48 border rounded-lg overflow-hidden">
                      <AddressMap
                        coordinates={backgroundInfo.coordinates}
                        address={backgroundInfo.address}
                        readOnly={true}
                        onLocationSelect={() => {}}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setAssessmentComplete(false)
                  setCurrentTab("background")
                  setSignatures({ inspector: "", facilityOwner: "" })
                  setShowSignatures(false)
                }}
              >
                New Assessment
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                Print Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            FSE Compliance Assessment
          </CardTitle>
          <CardDescription>Food Service Establishment Safety & Compliance Evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="documentation">Docs</TabsTrigger>
              <TabsTrigger value="hygiene">Hygiene</TabsTrigger>
              <TabsTrigger value="sourcing">Sourcing</TabsTrigger>
              <TabsTrigger value="water">Water</TabsTrigger>
              <TabsTrigger value="waste">Waste</TabsTrigger>
              <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
            </TabsList>

            <TabsContent value="background" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Part 1: Background Information</h3>
                <Badge variant="secondary">Not Scored</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facilityName">Facility Name</Label>
                  <Input
                    id="facilityName"
                    value={backgroundInfo.facilityName}
                    onChange={(e) => setBackgroundInfo({ ...backgroundInfo, facilityName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner/Manager Name</Label>
                  <Input
                    id="ownerName"
                    value={backgroundInfo.ownerName}
                    onChange={(e) => setBackgroundInfo({ ...backgroundInfo, ownerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={backgroundInfo.phoneNumber}
                    onChange={(e) => setBackgroundInfo({ ...backgroundInfo, phoneNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={backgroundInfo.email}
                    onChange={(e) => setBackgroundInfo({ ...backgroundInfo, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspectorName">Inspector Name</Label>
                  <Input
                    id="inspectorName"
                    value={backgroundInfo.inspectorName}
                    onChange={(e) => setBackgroundInfo({ ...backgroundInfo, inspectorName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspectionDate">Inspection Date</Label>
                  <Input
                    id="inspectionDate"
                    type="date"
                    value={backgroundInfo.inspectionDate}
                    onChange={(e) => setBackgroundInfo({ ...backgroundInfo, inspectionDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="address">Facility Address</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMap(true)}
                    className="flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Select on Map
                  </Button>
                </div>
                <Textarea
                  id="address"
                  value={backgroundInfo.address}
                  onChange={(e) => setBackgroundInfo({ ...backgroundInfo, address: e.target.value })}
                  placeholder="Enter facility address or use map to select location"
                />
                {backgroundInfo.coordinates.lat !== 0 && (
                  <div className="text-sm text-muted-foreground">
                    Coordinates: {backgroundInfo.coordinates.lat.toFixed(6)},{" "}
                    {backgroundInfo.coordinates.lng.toFixed(6)}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documentation" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Part 2: Documentation</h3>
                <Badge>20 Marks</Badge>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hygieneCertificate"
                    checked={documentation.hygieneCertificate}
                    onCheckedChange={(checked) =>
                      setDocumentation({ ...documentation, hygieneCertificate: checked as boolean })
                    }
                  />
                  <Label htmlFor="hygieneCertificate">Hygiene Certificate of Food Handlers (5 marks)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="businessPermit"
                    checked={documentation.businessPermit}
                    onCheckedChange={(checked) =>
                      setDocumentation({ ...documentation, businessPermit: checked as boolean })
                    }
                  />
                  <Label htmlFor="businessPermit">Business Operating Permit (5 marks)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="suitabilityPermit"
                    checked={documentation.suitabilityPermit}
                    onCheckedChange={(checked) =>
                      setDocumentation({ ...documentation, suitabilityPermit: checked as boolean })
                    }
                  />
                  <Label htmlFor="suitabilityPermit">Suitability Permit (5 marks)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hygienePermit"
                    checked={documentation.hygienePermit}
                    onCheckedChange={(checked) =>
                      setDocumentation({ ...documentation, hygienePermit: checked as boolean })
                    }
                  />
                  <Label htmlFor="hygienePermit">Hygiene Permit (5 marks)</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hygiene" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Part 3: Personal Hygiene of Food Handlers</h3>
                <Badge>20 Marks</Badge>
              </div>
              <div className="space-y-6">
                {[
                  { key: "handWashing", label: "Hand Washing Practices" },
                  { key: "protectiveClothing", label: "Protective Clothing" },
                  { key: "hairCovering", label: "Hair Covering" },
                  { key: "jewelryRemoval", label: "Jewelry Removal" },
                  { key: "healthStatus", label: "Health Status Monitoring" },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label>{item.label} (4 marks)</Label>
                    <RadioGroup
                      value={personalHygiene[item.key as keyof typeof personalHygiene]}
                      onValueChange={(value) => setPersonalHygiene({ ...personalHygiene, [item.key]: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id={`${item.key}-excellent`} />
                        <Label htmlFor={`${item.key}-excellent`}>Excellent (4 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id={`${item.key}-good`} />
                        <Label htmlFor={`${item.key}-good`}>Good (3 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id={`${item.key}-fair`} />
                        <Label htmlFor={`${item.key}-fair`}>Fair (2 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id={`${item.key}-poor`} />
                        <Label htmlFor={`${item.key}-poor`}>Poor (0 marks)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sourcing" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Part 4: Material Sourcing</h3>
                <Badge>20 Marks</Badge>
              </div>
              <div className="space-y-6">
                {[
                  { key: "supplierApproval", label: "Supplier Approval Process" },
                  { key: "ingredientQuality", label: "Ingredient Quality Control" },
                  { key: "storageConditions", label: "Storage Conditions" },
                  { key: "expiryDateCheck", label: "Expiry Date Monitoring" },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label>{item.label} (5 marks)</Label>
                    <RadioGroup
                      value={materialSourcing[item.key as keyof typeof materialSourcing]}
                      onValueChange={(value) => setMaterialSourcing({ ...materialSourcing, [item.key]: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id={`${item.key}-excellent`} />
                        <Label htmlFor={`${item.key}-excellent`}>Excellent (5 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id={`${item.key}-good`} />
                        <Label htmlFor={`${item.key}-good`}>Good (3 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id={`${item.key}-fair`} />
                        <Label htmlFor={`${item.key}-fair`}>Fair (2 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id={`${item.key}-poor`} />
                        <Label htmlFor={`${item.key}-poor`}>Poor (0 marks)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="water" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Part 5: Water Sources and Storage</h3>
                <Badge>10 Marks</Badge>
              </div>
              <div className="space-y-6">
                {[
                  { key: "waterQuality", label: "Water Quality Testing" },
                  { key: "storageConditions", label: "Water Storage Conditions" },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label>{item.label} (5 marks)</Label>
                    <RadioGroup
                      value={waterSources[item.key as keyof typeof waterSources]}
                      onValueChange={(value) => setWaterSources({ ...waterSources, [item.key]: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id={`water-${item.key}-excellent`} />
                        <Label htmlFor={`water-${item.key}-excellent`}>Excellent (5 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id={`water-${item.key}-good`} />
                        <Label htmlFor={`water-${item.key}-good`}>Good (3 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id={`water-${item.key}-fair`} />
                        <Label htmlFor={`water-${item.key}-fair`}>Fair (2 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id={`water-${item.key}-poor`} />
                        <Label htmlFor={`water-${item.key}-poor`}>Poor (0 marks)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="waste" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Part 6: Waste Disposal</h3>
                <Badge>20 Marks</Badge>
              </div>
              <div className="space-y-6">
                {[
                  { key: "wasteSegregation", label: "Waste Segregation" },
                  { key: "disposalMethod", label: "Disposal Methods" },
                  { key: "pestControl", label: "Pest Control Measures" },
                  { key: "drainageMaintenance", label: "Drainage Maintenance" },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label>{item.label} (5 marks)</Label>
                    <RadioGroup
                      value={wasteDisposal[item.key as keyof typeof wasteDisposal]}
                      onValueChange={(value) => setWasteDisposal({ ...wasteDisposal, [item.key]: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id={`waste-${item.key}-excellent`} />
                        <Label htmlFor={`waste-${item.key}-excellent`}>Excellent (5 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id={`waste-${item.key}-good`} />
                        <Label htmlFor={`waste-${item.key}-good`}>Good (3 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id={`waste-${item.key}-fair`} />
                        <Label htmlFor={`waste-${item.key}-fair`}>Fair (2 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id={`waste-${item.key}-poor`} />
                        <Label htmlFor={`waste-${item.key}-poor`}>Poor (0 marks)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cleaning" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Part 7: Cleaning</h3>
                <Badge>10 Marks</Badge>
              </div>
              <div className="space-y-6">
                {[
                  { key: "cleaningSchedule", label: "Cleaning Schedule Adherence" },
                  { key: "sanitizationProcedures", label: "Sanitization Procedures" },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label>{item.label} (5 marks)</Label>
                    <RadioGroup
                      value={cleaning[item.key as keyof typeof cleaning]}
                      onValueChange={(value) => setCleaning({ ...cleaning, [item.key]: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id={`cleaning-${item.key}-excellent`} />
                        <Label htmlFor={`cleaning-${item.key}-excellent`}>Excellent (5 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id={`cleaning-${item.key}-good`} />
                        <Label htmlFor={`cleaning-${item.key}-good`}>Good (3 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id={`cleaning-${item.key}-fair`} />
                        <Label htmlFor={`cleaning-${item.key}-fair`}>Fair (2 marks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id={`cleaning-${item.key}-poor`} />
                        <Label htmlFor={`cleaning-${item.key}-poor`}>Poor (0 marks)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => {
                const tabs = ["background", "documentation", "hygiene", "sourcing", "water", "waste", "cleaning"]
                const currentIndex = tabs.indexOf(currentTab)
                if (currentIndex > 0) {
                  setCurrentTab(tabs[currentIndex - 1])
                }
              }}
              disabled={currentTab === "background"}
            >
              Previous
            </Button>

            {currentTab === "cleaning" ? (
              <Button onClick={() => setShowSignatures(true)} className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Proceed to Signatures
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const tabs = ["background", "documentation", "hygiene", "sourcing", "water", "waste", "cleaning"]
                  const currentIndex = tabs.indexOf(currentTab)
                  if (currentIndex < tabs.length - 1) {
                    setCurrentTab(tabs[currentIndex + 1])
                  }
                }}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Select Facility Location
              </CardTitle>
              <CardDescription>
                Click on the map to select the facility location or search for an address
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96">
                <AddressMap
                  coordinates={backgroundInfo.coordinates.lat !== 0 ? backgroundInfo.coordinates : undefined}
                  address={backgroundInfo.address}
                  onLocationSelect={handleLocationSelect}
                />
              </div>
              <div className="p-4 border-t">
                <Button variant="outline" onClick={() => setShowMap(false)} className="w-full">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Signatures Modal */}
      {showSignatures && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Digital Signatures Required</CardTitle>
              <CardDescription>Both inspector and facility owner must sign to complete the assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SignaturePad
                title="Inspector Signature"
                subtitle={`Inspector: ${backgroundInfo.inspectorName}`}
                onSignature={(signature) => setSignatures((prev) => ({ ...prev, inspector: signature }))}
                signature={signatures.inspector}
              />

              <SignaturePad
                title="Facility Owner Signature"
                subtitle={`Owner/Manager: ${backgroundInfo.ownerName}`}
                onSignature={(signature) => setSignatures((prev) => ({ ...prev, facilityOwner: signature }))}
                signature={signatures.facilityOwner}
              />

              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setShowSignatures(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowSignatures(false)
                    calculateScore()
                  }}
                  disabled={!signatures.inspector || !signatures.facilityOwner}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Complete Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
