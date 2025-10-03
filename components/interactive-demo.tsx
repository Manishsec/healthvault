"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  FileText, 
  User, 
  Heart, 
  Activity, 
  Clock, 
  MapPin,
  CheckCircle,
  Bell,
  TrendingUp,
  Pill,
  Stethoscope,
  ChevronRight,
  X,
  Phone,
  Mail,
  Star,
  MessageSquare,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

export function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState("patient")
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [healthScore, setHealthScore] = useState(0)

  // Simulate health score animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setHealthScore(85)
    }, 500)
    return () => clearTimeout(timer)
  }, [activeTab])

  // Mock data
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "Tomorrow",
      time: "10:30 AM",
      type: "Check-up",
      avatar: "/female-doctor.png"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "Oct 5, 2025",
      time: "2:00 PM",
      type: "Consultation",
      avatar: "/male-doctor.png"
    }
  ]

  const recentRecords = [
    {
      id: 1,
      type: "Lab Report",
      title: "Blood Test Results",
      date: "Sep 28, 2025",
      doctor: "Dr. Sarah Johnson",
      status: "Reviewed"
    },
    {
      id: 2,
      type: "Prescription",
      title: "Medication Plan",
      date: "Sep 25, 2025",
      doctor: "Dr. Michael Chen",
      status: "Active"
    },
    {
      id: 3,
      type: "X-Ray",
      title: "Chest X-Ray",
      date: "Sep 20, 2025",
      doctor: "Dr. Emily Williams",
      status: "Normal"
    }
  ]

  const availableDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 234,
      experience: "15 years",
      nextAvailable: "Today 3:00 PM",
      avatar: "/female-doctor.png"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      rating: 4.8,
      reviews: 189,
      experience: "12 years",
      nextAvailable: "Tomorrow 10:00 AM",
      avatar: "/male-doctor.png"
    },
    {
      id: 3,
      name: "Dr. Emily Williams",
      specialty: "Pediatrician",
      rating: 4.9,
      reviews: 312,
      experience: "18 years",
      nextAvailable: "Today 5:00 PM",
      avatar: "/female-pediatrician.png"
    }
  ]

  const healthMetrics = [
    { label: "Heart Rate", value: "72 bpm", icon: Heart, trend: "normal", color: "text-red-500" },
    { label: "Blood Pressure", value: "120/80", icon: Activity, trend: "normal", color: "text-blue-500" },
    { label: "Temperature", value: "98.6°F", icon: TrendingUp, trend: "normal", color: "text-orange-500" },
    { label: "Medications", value: "2 Active", icon: Pill, trend: "normal", color: "text-purple-500" }
  ]

  const doctorPatients = [
    {
      id: 1,
      name: "John Smith",
      age: 45,
      condition: "Hypertension",
      lastVisit: "2 days ago",
      nextAppointment: "Oct 5",
      status: "Stable",
      avatar: "/placeholder-user.jpg"
    },
    {
      id: 2,
      name: "Emma Davis",
      age: 32,
      condition: "Diabetes Type 2",
      lastVisit: "1 week ago",
      nextAppointment: "Oct 8",
      status: "Monitoring",
      avatar: "/placeholder-user.jpg"
    },
    {
      id: 3,
      name: "Robert Wilson",
      age: 58,
      condition: "Cardiac Care",
      lastVisit: "Yesterday",
      nextAppointment: "Today",
      status: "Follow-up",
      avatar: "/placeholder-user.jpg"
    }
  ]

  const handleBookAppointment = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setShowNotification(true)
      setIsAnimating(false)
      setTimeout(() => setShowNotification(false), 3000)
    }, 1000)
  }

  const handleFeatureClick = (feature: string) => {
    setSelectedFeature(feature === selectedFeature ? null : feature)
  }

  return (
    <div className="w-full bg-gradient-to-br from-background via-muted/20 to-primary/5 rounded-3xl p-6 md:p-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="absolute top-6 right-6 z-50 animate-slide-in-from-top">
          <Card className="border-2 border-green-500 bg-background shadow-2xl">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Appointment Booked!</p>
                <p className="text-xs text-muted-foreground">Confirmation sent to your email</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => setShowNotification(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            Interactive Demo
          </Badge>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Experience HealthVault in Action
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click around and explore the features. This is a real-time interactive simulation of our platform.
          </p>
        </div>

        {/* Role Switcher */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-12">
            <TabsTrigger value="patient" className="text-base">
              <User className="w-4 h-4 mr-2" />
              Patient View
            </TabsTrigger>
            <TabsTrigger value="doctor" className="text-base">
              <Stethoscope className="w-4 h-4 mr-2" />
              Doctor View
            </TabsTrigger>
          </TabsList>

          {/* Patient Dashboard */}
          <TabsContent value="patient" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">John Doe</CardTitle>
                      <CardDescription>Patient ID: #12345</CardDescription>
                      <Badge variant="secondary" className="mt-1">Active</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      john.doe@email.com
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      +1 (555) 123-4567
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      New York, USA
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Score */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Health Score
                  </CardTitle>
                  <CardDescription>Based on recent vitals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - healthScore / 100)}`}
                          className="text-primary transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{healthScore}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Excellent! Keep up the good work.
                  </p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleFeatureClick('book')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleFeatureClick('records')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Records
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleFeatureClick('chat')}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    AI Assistant
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleFeatureClick('notifications')}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                    <Badge variant="destructive" className="ml-auto">3</Badge>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Health Metrics */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Today&apos;s Health Metrics</CardTitle>
                <CardDescription>Real-time health monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {healthMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 cursor-pointer hover:scale-105"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <metric.icon className={cn("w-5 h-5", metric.color)} />
                        <Badge variant="outline" className="text-xs">Normal</Badge>
                      </div>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Content Based on Selection */}
            {selectedFeature === 'book' && (
              <Card className="border-2 border-primary animate-fade-in">
                <CardHeader>
                  <CardTitle>Book an Appointment</CardTitle>
                  <CardDescription>Choose from available doctors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {availableDoctors.map((doctor) => (
                      <Card key={doctor.id} className="border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={doctor.avatar} />
                              <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">{doctor.name}</h4>
                              <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{doctor.rating}</span>
                                <span className="text-xs text-muted-foreground">({doctor.reviews})</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {doctor.experience} experience
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {doctor.nextAvailable}
                            </div>
                          </div>
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => handleBookAppointment()}
                            disabled={isAnimating}
                          >
                            {isAnimating ? 'Booking...' : 'Book Now'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedFeature === 'records' && (
              <Card className="border-2 border-primary animate-fade-in">
                <CardHeader>
                  <CardTitle>Recent Medical Records</CardTitle>
                  <CardDescription>Access your complete health history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{record.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {record.type} • {record.date} • {record.doctor}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{record.status}</Badge>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Appointments */}
            {!selectedFeature && (
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription>Your scheduled visits</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={appointment.avatar} />
                            <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{appointment.doctor}</h4>
                            <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {appointment.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {appointment.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge>{appointment.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Doctor Dashboard */}
          <TabsContent value="doctor" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Doctor Profile */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="/female-doctor.png" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">Dr. Sarah Johnson</CardTitle>
                      <CardDescription>Cardiologist</CardDescription>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Patients Today</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Patients</span>
                      <span className="font-semibold">234</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-semibold">15 years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>October 2, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                      <div>
                        <p className="font-semibold text-sm">Morning Rounds</p>
                        <p className="text-xs text-muted-foreground">8:00 AM - 10:00 AM</p>
                      </div>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                      <div>
                        <p className="font-semibold text-sm">Consultations</p>
                        <p className="text-xs text-muted-foreground">10:30 AM - 2:00 PM</p>
                      </div>
                      <Badge>Upcoming</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                      <div>
                        <p className="font-semibold text-sm">Surgery</p>
                        <p className="text-xs text-muted-foreground">3:00 PM - 5:00 PM</p>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>This week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Appointments</span>
                      <span className="font-semibold">38/40</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Patient Satisfaction</span>
                      <span className="font-semibold">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="font-semibold">&lt; 2 hrs</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patient List */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Patients</CardTitle>
                    <CardDescription>Manage your patient appointments</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    All Patients
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctorPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={patient.avatar} />
                          <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{patient.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} years • {patient.condition}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>Last visit: {patient.lastVisit}</span>
                            <span>•</span>
                            <span>Next: {patient.nextAppointment}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={patient.status === 'Stable' ? 'secondary' : patient.status === 'Monitoring' ? 'outline' : 'default'}
                        >
                          {patient.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          View Chart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: CheckCircle,
                      title: "Lab results reviewed",
                      description: "John Smith's blood test results marked as reviewed",
                      time: "10 minutes ago",
                      color: "text-green-500"
                    },
                    {
                      icon: Bell,
                      title: "New appointment request",
                      description: "Emma Davis requested a consultation for Oct 8",
                      time: "1 hour ago",
                      color: "text-blue-500"
                    },
                    {
                      icon: FileText,
                      title: "Prescription sent",
                      description: "Medication plan sent to Robert Wilson",
                      time: "2 hours ago",
                      color: "text-purple-500"
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-muted", activity.color)}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <Card className="border-2 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Love what you see?</p>
                  <p className="text-sm text-muted-foreground">Start using HealthVault today for free</p>
                </div>
              </div>
              <Button size="lg" className="group">
                Get Started Now
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
