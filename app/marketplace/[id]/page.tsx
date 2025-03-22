"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  Truck,
  User,
  Factory,
  Package,
  Warehouse,
  Shield,
} from "lucide-react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"

// Mock data for factories
const factories = [
  {
    id: "factory-001",
    name: "Global Logistics Solutions",
    type: "Shipping",
    location: "Singapore",
    address: "123 Shipping Lane, Singapore 123456",
    rating: 4.8,
    reviews: 124,
    specialties: ["International Shipping", "Express Delivery", "Customs Handling"],
    description:
      "Global Logistics Solutions is a leading provider of international shipping services with over 15 years of experience. We specialize in efficient and secure transportation of goods across borders, with expertise in customs clearance and regulatory compliance.",
    services: [
      {
        name: "International Shipping",
        description: "Door-to-door shipping services for international cargo with real-time tracking.",
        price: "Custom quote based on weight and destination",
      },
      {
        name: "Express Delivery",
        description: "Expedited shipping options for time-sensitive cargo with guaranteed delivery times.",
        price: "Starting at $500 per shipment",
      },
      {
        name: "Customs Handling",
        description: "Complete customs documentation and clearance services to ensure smooth border crossings.",
        price: "$200 per shipment",
      },
    ],
    contactInfo: {
      email: "info@globallogistics.com",
      phone: "+65 1234 5678",
      website: "www.globallogistics.com",
    },
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    verified: true,
    yearEstablished: 2008,
    employeeCount: "100-250",
    certifications: ["ISO 9001", "ISO 14001", "C-TPAT Certified"],
    testimonials: [
      {
        name: "Sarah Johnson",
        company: "Tech Innovations Inc.",
        comment:
          "Global Logistics has been our shipping partner for over 5 years. Their attention to detail and reliability have been crucial for our international operations.",
        rating: 5,
      },
      {
        name: "Michael Chen",
        company: "Chen Manufacturing",
        comment:
          "Their customs handling expertise saved us countless hours and prevented delays at borders. Highly recommended for international shipping needs.",
        rating: 4,
      },
    ],
  },
  {
    id: "factory-002",
    name: "FastTrack Manufacturing",
    type: "Manufacturing",
    location: "Shenzhen, China",
    address: "456 Industrial Zone, Shenzhen, China",
    rating: 4.6,
    reviews: 89,
    specialties: ["Electronics Assembly", "Rapid Prototyping", "Quality Control"],
    description:
      "FastTrack Manufacturing is a high-tech manufacturing facility specializing in electronics assembly and rapid prototyping. With state-of-the-art equipment and skilled technicians, we deliver high-quality products with quick turnaround times.",
    services: [
      {
        name: "Electronics Assembly",
        description: "Full PCB assembly services with SMT and through-hole capabilities.",
        price: "Starting at $1,000 per batch",
      },
      {
        name: "Rapid Prototyping",
        description: "Quick turnaround prototyping services for product development and testing.",
        price: "$500-$2,000 depending on complexity",
      },
      {
        name: "Quality Control",
        description: "Comprehensive quality assurance and testing for all manufactured products.",
        price: "Included with manufacturing services",
      },
    ],
    contactInfo: {
      email: "info@fasttrackmanufacturing.com",
      phone: "+86 755 1234 5678",
      website: "www.fasttrackmanufacturing.com",
    },
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    verified: true,
    yearEstablished: 2012,
    employeeCount: "250-500",
    certifications: ["ISO 9001", "ISO 14001", "RoHS Compliant"],
    testimonials: [
      {
        name: "David Rodriguez",
        company: "NextGen Devices",
        comment:
          "FastTrack's rapid prototyping services helped us iterate quickly and get our product to market months ahead of schedule.",
        rating: 5,
      },
      {
        name: "Lisa Wong",
        company: "Smart Home Solutions",
        comment:
          "The quality of their electronics assembly is exceptional. We've had zero defects in our last 5,000 units.",
        rating: 4,
      },
    ],
  },
  {
    id: "factory-003",
    name: "SecureStorage Warehousing",
    type: "Warehousing",
    location: "Amsterdam, Netherlands",
    address: "789 Warehouse District, Amsterdam, Netherlands",
    rating: 4.9,
    reviews: 56,
    specialties: ["Climate Controlled Storage", "Inventory Management", "Distribution"],
    description:
      "SecureStorage Warehousing offers premium warehousing solutions in the heart of Europe. Our facilities feature climate-controlled environments, advanced security systems, and sophisticated inventory management technology to ensure your goods are stored safely and efficiently.",
    services: [
      {
        name: "Climate Controlled Storage",
        description: "Temperature and humidity controlled storage for sensitive goods.",
        price: "€25 per pallet per week",
      },
      {
        name: "Inventory Management",
        description: "Real-time inventory tracking and management with detailed reporting.",
        price: "€500 per month for up to 100 SKUs",
      },
      {
        name: "Distribution",
        description: "Europe-wide distribution services with optimized routing and delivery.",
        price: "Custom quote based on volume and destinations",
      },
    ],
    contactInfo: {
      email: "info@securestorage.com",
      phone: "+31 20 1234 5678",
      website: "www.securestorage.com",
    },
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    verified: true,
    yearEstablished: 2010,
    employeeCount: "50-100",
    certifications: ["ISO 9001", "TAPA FSR Level A", "GDP Compliant"],
    testimonials: [
      {
        name: "Thomas Müller",
        company: "European Pharmaceuticals",
        comment:
          "Their climate-controlled storage has been perfect for our pharmaceutical products. The temperature monitoring and reporting give us complete peace of mind.",
        rating: 5,
      },
      {
        name: "Anna Kowalski",
        company: "Fashion Forward",
        comment:
          "SecureStorage's inventory management system has transformed our operations. We now have real-time visibility of all our stock across Europe.",
        rating: 5,
      },
    ],
  },
  {
    id: "factory-004",
    name: "Pacific Freight Services",
    type: "Shipping",
    location: "Los Angeles, USA",
    address: "101 Harbor Blvd, Los Angeles, CA 90001, USA",
    rating: 4.5,
    reviews: 112,
    specialties: ["Ocean Freight", "Air Freight", "Last Mile Delivery"],
    description:
      "Pacific Freight Services specializes in trans-Pacific shipping solutions, connecting Asia with North America. With decades of experience in ocean and air freight, we provide reliable and cost-effective logistics services for businesses of all sizes.",
    services: [
      {
        name: "Ocean Freight",
        description: "FCL and LCL shipping services across the Pacific with competitive rates.",
        price: "Starting at $1,500 per container",
      },
      {
        name: "Air Freight",
        description: "Expedited air freight services for time-sensitive shipments.",
        price: "$5-$10 per kg depending on volume",
      },
      {
        name: "Last Mile Delivery",
        description: "Comprehensive last mile delivery services throughout North America.",
        price: "Starting at $50 per shipment",
      },
    ],
    contactInfo: {
      email: "info@pacificfreight.com",
      phone: "+1 213 555 1234",
      website: "www.pacificfreight.com",
    },
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    verified: false,
    yearEstablished: 2005,
    employeeCount: "100-250",
    certifications: ["C-TPAT Certified", "NVOCC Licensed"],
    testimonials: [
      {
        name: "James Wilson",
        company: "American Imports Co.",
        comment:
          "Pacific Freight has been handling our imports from China for years. Their ocean freight service is reliable and their rates are competitive.",
        rating: 4,
      },
      {
        name: "Emily Chang",
        company: "West Coast Distributors",
        comment:
          "Their last mile delivery service has significantly improved our customer satisfaction. Packages arrive on time and in perfect condition.",
        rating: 5,
      },
    ],
  },
  {
    id: "factory-005",
    name: "EuroTech Manufacturing",
    type: "Manufacturing",
    location: "Munich, Germany",
    address: "234 Industriestraße, Munich, Germany",
    rating: 4.7,
    reviews: 78,
    specialties: ["Precision Engineering", "Automotive Parts", "Industrial Equipment"],
    description:
      "EuroTech Manufacturing is a German precision engineering company specializing in high-quality automotive parts and industrial equipment. With German engineering excellence and cutting-edge technology, we deliver components that meet the highest standards of quality and durability.",
    services: [
      {
        name: "Precision Engineering",
        description: "High-precision machining and engineering services with tolerances up to 0.001mm.",
        price: "Custom quote based on specifications",
      },
      {
        name: "Automotive Parts Manufacturing",
        description: "Production of custom automotive components meeting OEM specifications.",
        price: "Volume-based pricing",
      },
      {
        name: "Industrial Equipment",
        description: "Design and manufacturing of specialized industrial equipment and machinery.",
        price: "Project-based quotes",
      },
    ],
    contactInfo: {
      email: "info@eurotech-manufacturing.com",
      phone: "+49 89 1234 5678",
      website: "www.eurotech-manufacturing.com",
    },
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    verified: true,
    yearEstablished: 2003,
    employeeCount: "100-250",
    certifications: ["ISO 9001", "ISO/TS 16949", "TÜV Certified"],
    testimonials: [
      {
        name: "Hans Schmidt",
        company: "German Auto AG",
        comment:
          "EuroTech's precision engineering is unmatched. Their automotive parts consistently exceed our quality expectations.",
        rating: 5,
      },
      {
        name: "Maria Becker",
        company: "Industrial Solutions GmbH",
        comment:
          "We've been using their custom industrial equipment for our production line. The machines are reliable and the service is excellent.",
        rating: 4,
      },
    ],
  },
  {
    id: "factory-006",
    name: "AsiaStorage Solutions",
    type: "Warehousing",
    location: "Tokyo, Japan",
    address: "567 Warehouse District, Tokyo, Japan",
    rating: 4.4,
    reviews: 45,
    specialties: ["Automated Warehousing", "Cross-docking", "E-commerce Fulfillment"],
    description:
      "AsiaStorage Solutions offers cutting-edge warehousing services in Tokyo, featuring fully automated storage and retrieval systems. We specialize in e-commerce fulfillment and cross-docking operations, helping businesses optimize their supply chain across Asia.",
    services: [
      {
        name: "Automated Warehousing",
        description: "State-of-the-art automated storage and retrieval systems for efficient inventory management.",
        price: "¥2,500 per pallet per month",
      },
      {
        name: "Cross-docking",
        description: "Streamlined cross-docking services to minimize storage time and costs.",
        price: "¥15,000 per shipment",
      },
      {
        name: "E-commerce Fulfillment",
        description: "Complete e-commerce fulfillment services including picking, packing, and shipping.",
        price: "¥500 per order plus ¥100 per item",
      },
    ],
    contactInfo: {
      email: "info@asiastorage.com",
      phone: "+81 3 1234 5678",
      website: "www.asiastorage.com",
    },
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    verified: false,
    yearEstablished: 2015,
    employeeCount: "50-100",
    certifications: ["ISO 9001", "TAPA FSR Level A"],
    testimonials: [
      {
        name: "Takashi Yamamoto",
        company: "Japan Electronics",
        comment:
          "Their automated warehousing system has significantly reduced our storage costs and improved inventory accuracy.",
        rating: 4,
      },
      {
        name: "Kim Min-ji",
        company: "Korean Fashion Online",
        comment:
          "AsiaStorage's e-commerce fulfillment services have been crucial for our expansion into the Japanese market.",
        rating: 5,
      },
    ],
  },
]

export default function FactoryDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [escrowDialogOpen, setEscrowDialogOpen] = useState(false)
  const params = useParams()
  const router = useRouter()
  const factoryId = params.id as string

  // Find the factory by ID
  const factory = factories.find((f) => f.id === factoryId)

  if (!factory) {
    return (
      <div className="flex h-screen bg-gray-100">
        <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Factory Not Found</h2>
                  <p className="text-gray-500 mb-6">
                    The factory you're looking for doesn't exist or has been removed.
                  </p>
                  <Button asChild>
                    <Link href="/marketplace">Return to Marketplace</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Shipping":
        return <Truck className="h-5 w-5" />
      case "Manufacturing":
        return <Factory className="h-5 w-5" />
      case "Warehousing":
        return <Warehouse className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the contact request
    setContactDialogOpen(false)
    // Show success message
    alert("Your message has been sent! The factory will contact you shortly.")
  }

  const handleEscrowSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would initiate the escrow creation process
    setEscrowDialogOpen(false)
    // Navigate to escrow creation page
    router.push("/escrow/create")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{factory.name}</h1>
                  {factory.verified && <Badge className="ml-2 bg-blue-600">Verified</Badge>}
                </div>
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{factory.location}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 md:mt-0 flex space-x-3"
              >
                <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-gray-800 bg-white hover:bg-gray-100 hover:text-gray-800"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" /> Contact
                    </Button>


                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Contact {factory.name}</DialogTitle>
                      <DialogDescription>
                        Send a message to inquire about their services. They'll respond to you directly.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleContactSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input id="name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input id="email" type="email" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="subject" className="text-right">
                            Subject
                          </Label>
                          <Input id="subject" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="message" className="text-right">
                            Message
                          </Label>
                          <Textarea id="message" className="col-span-3" rows={4} required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Send Message</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Link href="/escrow/create?partner=rNJyqqd1KQpoPFrtaP3mtM3qkvVQXFUMPx">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <FileText className="mr-2 h-4 w-4" /> Create Escrow
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-0">
                    <img
                      src={factory.image || "/placeholder.svg"}
                      alt={factory.name}
                      className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {getTypeIcon(factory.type)}
                          <span className="ml-2 font-medium">{factory.type}</span>
                        </div>
                        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                          <Star className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="font-medium">{factory.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({factory.reviews} reviews)</span>
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold mb-2">About {factory.name}</h2>
                      <p className="text-gray-700 mb-4">{factory.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {factory.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 text-gray-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Established</p>
                            <p className="font-medium">{factory.yearEstablished}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Employees</p>
                            <p className="font-medium">{factory.employeeCount}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{factory.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-gray-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Certifications</p>
                            <p className="font-medium">{factory.certifications.join(", ")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Services Offered</CardTitle>
                    <CardDescription>Detailed information about available services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {factory.services.map((service, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                          <p className="text-gray-700 mb-3">{service.description}</p>
                          <div className="flex items-center text-sm bg-gray-50 p-2 rounded">
                            <Clock className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="font-medium">Pricing:</span>
                            <span className="ml-2">{service.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                    <CardDescription>Images of facilities and operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {factory.gallery.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`${factory.name} gallery ${index + 1}`}
                          className="rounded-lg w-full h-32 object-cover"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Testimonials</CardTitle>
                    <CardDescription>What others are saying about {factory.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {factory.testimonials.map((testimonial, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{testimonial.name}</h4>
                              <p className="text-sm text-gray-500">{testimonial.company}</p>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">"{testimonial.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Ways to reach {factory.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <a href={`mailto:${factory.contactInfo.email}`} className="text-blue-600 hover:underline">
                            {factory.contactInfo.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <a href={`tel:${factory.contactInfo.phone}`} className="font-medium">
                            {factory.contactInfo.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <a
                            href={`https://${factory.contactInfo.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            {factory.contactInfo.website}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button className="w-full" onClick={() => setContactDialogOpen(true)}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Create Secure Escrow</CardTitle>
                    <CardDescription>Set up a blockchain-based escrow contract</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800 flex items-center">
                          <Shield className="h-5 w-5 mr-2" /> Secure Payments
                        </h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Our XRPL escrow system ensures your funds are only released when conditions are met.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Funds held in secure escrow</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Automatic release on completion</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Blockchain-verified transactions</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Dispute resolution available</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link href="/escrow/create?partner=rNJyqqd1KQpoPFrtaP3mtM3qkvVQXFUMPx">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <FileText className="mr-2 h-4 w-4" /> Create Escrow Contract
                        </Button>
                      </Link>

                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Availability</CardTitle>
                    <CardDescription>Current capacity and scheduling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                          <span>Next Available Date</span>
                        </div>
                        <span className="font-medium">Mar 28, 2025</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-500 mr-2" />
                          <span>Response Time</span>
                        </div>
                        <span className="font-medium">Within 24 hours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Truck className="h-5 w-5 text-gray-500 mr-2" />
                          <span>Current Capacity</span>
                        </div>
                        <Badge className="bg-green-500">Available</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

