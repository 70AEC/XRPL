"use client"

import { motion } from "framer-motion"
import { Clock, FileCheck, Lock, RefreshCw, Shield, Truck } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Lock className="w-10 h-10 text-blue-500" />,
      title: "Secure Escrow Contracts",
      description:
        "Create time-based or condition-based escrow contracts on the XRP Ledger with multi-signature requirements.",
    },
    {
      icon: <Clock className="w-10 h-10 text-blue-500" />,
      title: "Time-Based Releases",
      description: "Set up automatic escrow releases based on predefined timeframes and delivery milestones.",
    },
    {
      icon: <Shield className="w-10 h-10 text-blue-500" />,
      title: "KYB Verification",
      description: "Enterprise-grade Know Your Business verification for all platform participants.",
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-blue-500" />,
      title: "Automated Triggers",
      description: "Smart contract automation that executes escrow finishes when conditions are met.",
    },
    {
      icon: <FileCheck className="w-10 h-10 text-blue-500" />,
      title: "Invoice Verification",
      description: "Secure invoice verification system integrated with escrow release mechanisms.",
    },
    {
      icon: <Truck className="w-10 h-10 text-blue-500" />,
      title: "Logistics Integration",
      description: "Seamless integration with logistics providers for real-time tracking and verification.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Powerful Features for Secure Logistics
            </h2>
            <p className="text-xl text-gray-600">
              Our platform combines the security of XRPL escrow with powerful logistics tools to create a seamless
              experience for businesses.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 transition-all duration-300 border rounded-lg shadow-sm hover:shadow-md border-gray-200"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

