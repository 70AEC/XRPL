"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Star, Filter, Truck, Factory, Package, Warehouse } from "lucide-react"
import { motion } from "framer-motion"
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
    rating: 4.8,
    reviews: 124,
    specialties: ["International Shipping", "Express Delivery", "Customs Handling"],
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
  },
  {
    id: "factory-002",
    name: "FastTrack Manufacturing",
    type: "Manufacturing",
    location: "Shenzhen, China",
    rating: 4.6,
    reviews: 89,
    specialties: ["Electronics Assembly", "Rapid Prototyping", "Quality Control"],
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
  },
  {
    id: "factory-003",
    name: "SecureStorage Warehousing",
    type: "Warehousing",
    location: "Amsterdam, Netherlands",
    rating: 4.9,
    reviews: 56,
    specialties: ["Climate Controlled Storage", "Inventory Management", "Distribution"],
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
  },
  {
    id: "factory-004",
    name: "Pacific Freight Services",
    type: "Shipping",
    location: "Los Angeles, USA",
    rating: 4.5,
    reviews: 112,
    specialties: ["Ocean Freight", "Air Freight", "Last Mile Delivery"],
    image: "/placeholder.svg?height=200&width=300",
    verified: false,
  },
  {
    id: "factory-005",
    name: "EuroTech Manufacturing",
    type: "Manufacturing",
    location: "Munich, Germany",
    rating: 4.7,
    reviews: 78,
    specialties: ["Precision Engineering", "Automotive Parts", "Industrial Equipment"],
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
  },
  {
    id: "factory-006",
    name: "AsiaStorage Solutions",
    type: "Warehousing",
    location: "Tokyo, Japan",
    rating: 4.4,
    reviews: 45,
    specialties: ["Automated Warehousing", "Cross-docking", "E-commerce Fulfillment"],
    image: "/placeholder.svg?height=200&width=300",
    verified: false,
  },
]

export default function MarketplacePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)

  // Filter factories based on search query and selected type
  const filteredFactories = factories.filter((factory) => {
    const matchesSearch =
      factory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      factory.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      factory.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = selectedType ? factory.type === selectedType : true

    return matchesSearch && matchesType
  })

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

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-2xl font-bold text-gray-900">Logistics Marketplace</h1>
                <p className="text-gray-500">Find and connect with verified logistics partners</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow p-4 md:p-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search by name, location, or specialty..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <Select onValueChange={(value) => setSelectedType(value === "all" ? null : value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Shipping">Shipping</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Warehousing">Warehousing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="hidden md:flex">
                    <Filter className="mr-2 h-4 w-4" /> More Filters
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Tabs defaultValue="grid" className="space-y-4">
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                  </TabsList>
                  <p className="text-sm text-gray-500">{filteredFactories.length} results</p>
                </div>

                <TabsContent value="grid" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFactories.map((factory) => (
                      <Link href={`/marketplace/${factory.id}`} key={factory.id}>
                        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                          <div className="relative h-48">
                            <img
                              src={factory.image || "/placeholder.svg"}
                              alt={factory.name}
                              className="w-full h-full object-cover"
                            />
                            {factory.verified && <Badge className="absolute top-2 right-2 bg-blue-600">Verified</Badge>}
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{factory.name}</h3>
                                <div className="flex items-center text-gray-500 mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span className="text-sm">{factory.location}</span>
                                </div>
                              </div>
                              <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="font-medium">{factory.rating}</span>
                                <span className="text-xs text-gray-500 ml-1">({factory.reviews})</span>
                              </div>
                            </div>
                            <div className="flex items-center mt-3 text-sm text-gray-600">
                              {getTypeIcon(factory.type)}
                              <span className="ml-1">{factory.type}</span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1">
                              {factory.specialties.slice(0, 2).map((specialty, index) => (
                                <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 font-normal">
                                  {specialty}
                                </Badge>
                              ))}
                              {factory.specialties.length > 2 && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-800 font-normal">
                                  +{factory.specialties.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="space-y-4">
                  {filteredFactories.map((factory) => (
                    <Link href={`/marketplace/${factory.id}`} key={factory.id}>
                      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="relative w-full md:w-48 h-48 md:h-auto">
                              <img
                                src={factory.image || "/placeholder.svg"}
                                alt={factory.name}
                                className="w-full h-full object-cover"
                              />
                              {factory.verified && (
                                <Badge className="absolute top-2 right-2 bg-blue-600">Verified</Badge>
                              )}
                            </div>
                            <div className="p-4 flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">{factory.name}</h3>
                                  <div className="flex items-center text-gray-500 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="text-sm">{factory.location}</span>
                                  </div>
                                </div>
                                <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                  <span className="font-medium">{factory.rating}</span>
                                  <span className="text-xs text-gray-500 ml-1">({factory.reviews})</span>
                                </div>
                              </div>
                              <div className="flex items-center mt-3 text-sm text-gray-600">
                                {getTypeIcon(factory.type)}
                                <span className="ml-1">{factory.type}</span>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-1">
                                {factory.specialties.map((specialty, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-gray-100 text-gray-800 font-normal"
                                  >
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

