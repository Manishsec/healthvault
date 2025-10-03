"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdvancedSearch } from "@/components/advanced-search"
import { Search, ArrowLeft, MapPin, Star, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { useEffect } from "react"

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: number
  rating: number
  location: string
  image: string
  availableSlots: string[]
  consultationFee: number
}

export default function FindDoctor() {
  const { user, isLoading } = useAuth()
  const searchQuery = ""
  const selectedSpecialty = ""
  const selectedLocation = ""

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "patient")) {
      redirect("/")
    }
  }, [user, isLoading])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== "patient") {
    return null
  }

  // Mock doctors data
  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: 15,
      rating: 4.8,
      location: "Heart Care Clinic, Mumbai",
      image: "/female-doctor.png",
      availableSlots: ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM"],
      consultationFee: 800,
    },
    {
      id: "2",
      name: "Dr. Raj Patel",
      specialty: "General Physician",
      experience: 12,
      rating: 4.6,
      location: "City Hospital, Mumbai",
      image: "/male-doctor.png",
      availableSlots: ["10:00 AM", "11:30 AM", "4:00 PM", "5:30 PM"],
      consultationFee: 500,
    },
    {
      id: "3",
      name: "Dr. Priya Sharma",
      specialty: "Dermatologist",
      experience: 8,
      rating: 4.7,
      location: "Skin Care Center, Mumbai",
      image: "/female-dermatologist.png",
      availableSlots: ["9:30 AM", "11:00 AM", "2:30 PM", "4:00 PM"],
      consultationFee: 700,
    },
    {
      id: "4",
      name: "Dr. Amit Kumar",
      specialty: "Orthopedic",
      experience: 20,
      rating: 4.9,
      location: "Bone & Joint Clinic, Mumbai",
      image: "/male-orthopedic-doctor.png",
      availableSlots: ["8:00 AM", "9:30 AM", "1:00 PM", "2:30 PM"],
      consultationFee: 900,
    },
    {
      id: "5",
      name: "Dr. Meera Joshi",
      specialty: "Pediatrician",
      experience: 10,
      rating: 4.5,
      location: "Children's Hospital, Mumbai",
      image: "/female-pediatrician.png",
      availableSlots: ["10:00 AM", "11:30 AM", "3:00 PM", "4:30 PM"],
      consultationFee: 600,
    },
  ]

  // Commented out unused variables
  // const specialties = [
  //   "All Specialties",
  //   "Cardiologist",
  //   "General Physician",
  //   "Dermatologist",
  //   "Orthopedic",
  //   "Pediatrician",
  // ]
  // const locations = ["All Locations", "Mumbai", "Delhi", "Bangalore", "Chennai"]

  // Filter doctors based on search criteria
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty =
      !selectedSpecialty || selectedSpecialty === "All Specialties" || doctor.specialty === selectedSpecialty
    const matchesLocation =
      !selectedLocation || selectedLocation === "All Locations" || doctor.location.includes(selectedLocation)

    return matchesSearch && matchesSpecialty && matchesLocation
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild className="self-start sm:self-auto">
                <Link href="/patient/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-balance">Find a Doctor</h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Search and book appointments with verified healthcare professionals
              </p>
            </div>
          </div>

          {/* Advanced Search */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Find Your Perfect Doctor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdvancedSearch 
                onSearch={(filters) => {
                  console.log('Search with filters:', filters)
                  // Handle search logic here
                }}
                onFiltersChange={(filters) => {
                  console.log('Filters changed:', filters)
                  // Handle filter changes here
                }}
              />
            </CardContent>
          </Card>

          {/* Doctors List */}
          <div className="space-y-4 sm:space-y-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 sm:gap-6">
                      {/* Doctor Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                          <Image
                            src={doctor.image || "/placeholder.svg"}
                            alt={doctor.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto sm:mx-0"
                          />
                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg sm:text-xl font-semibold mb-1">{doctor.name}</h3>
                            <p className="text-primary font-medium mb-2 text-sm sm:text-base">{doctor.specialty}</p>
                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>{doctor.experience} years experience</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                                <span>{doctor.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{doctor.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Consultation Fee:</span>
                          <Badge variant="secondary">₹{doctor.consultationFee}</Badge>
                        </div>
                      </div>

                      {/* Available Slots */}
                      <div className="lg:w-80">
                        <div className="mb-4">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Available Today
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {doctor.availableSlots.map((slot) => (
                              <Button key={slot} variant="outline" size="sm" className="text-xs bg-transparent">
                                {slot}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button className="w-full" asChild>
                            <Link href={`/patient/book-appointment/${doctor.id}`}>
                              <Calendar className="h-4 w-4 mr-2" />
                              Book Appointment
                            </Link>
                          </Button>
                          <Button variant="outline" className="w-full bg-transparent">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or browse all available doctors.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
