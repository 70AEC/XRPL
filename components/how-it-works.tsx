"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Connect your TrustWallet or other XRPL-compatible wallet to access the platform.",
    },
    {
      number: "02",
      title: "Complete KYB Verification",
      description: "Verify your business identity to gain full access to the platform's features.",
    },
    {
      number: "03",
      title: "Create Escrow Contract",
      description: "Set up an escrow contract with your logistics partner, defining conditions and timeframes.",
    },
    {
      number: "04",
      title: "Monitor Progress",
      description: "Track the progress of your logistics operations and escrow status in real-time.",
    },
    {
      number: "05",
      title: "Automatic Release",
      description: "Funds are automatically released when predefined conditions are met and verified.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">How Blogistics Works</h2>
            <p className="text-xl text-gray-600">
              Our platform simplifies the complex process of logistics escrow with a straightforward workflow.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform -translate-x-1/2 hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative mb-12 md:mb-24"
            >
              <div className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center`}>
                <div className="w-full md:w-1/2 mb-6 md:mb-0 md:px-8">
                  <div className="p-6 bg-white rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                      <span className="flex items-center justify-center w-10 h-10 mr-4 text-lg font-bold text-white bg-blue-600 rounded-full">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>

                <div className="relative w-full md:w-1/2">
                  {/* Circle on the timeline */}
                  <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 hidden md:block" />

                  {/* Arrow connecting to next step */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex justify-center mt-8">
                      <ArrowRight className="w-6 h-6 text-blue-500 transform rotate-90" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

