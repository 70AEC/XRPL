"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, TruckIcon, Wallet } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-blue-900 to-blue-950">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[...Array(20)].map((_, i) => (
            <line
              key={i}
              x1={Math.random() * 100}
              y1="0"
              x2={Math.random() * 100}
              y2="100"
              stroke="white"
              strokeWidth="0.1"
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <line
              key={i + 20}
              x1="0"
              y1={Math.random() * 100}
              x2="100"
              y2={Math.random() * 100}
              stroke="white"
              strokeWidth="0.1"
            />
          ))}
        </svg>
      </div>
      <div className="container relative z-10 px-4 mx-auto">
        <div className="flex flex-col items-center max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Secure Logistics Escrow on the <span className="text-blue-400">XRP Ledger</span>
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="mb-10 text-xl text-gray-300">
              Streamline your logistics operations with blockchain-powered escrow payments, automated releases, and
              transparent contract management.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg" asChild>
              <Link href="/auth/login">
                Connect Wallet <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
              asChild
            >
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-1 gap-8 mt-20 sm:grid-cols-3"
        >
          {[
            {
              icon: <ShieldCheck className="w-10 h-10 text-blue-400" />,
              title: "Secure Escrow",
              description: "XRPL-powered escrow contracts with conditional release mechanisms for maximum security.",
            },
            {
              icon: <TruckIcon className="w-10 h-10 text-blue-400" />,
              title: "Logistics Tracking",
              description: "Real-time tracking and verification of logistics milestones tied to escrow releases.",
            },
            {
              icon: <Wallet className="w-10 h-10 text-blue-400" />,
              title: "Automated Payments",
              description:
                "Trigger automatic payments when predefined conditions are met, reducing manual intervention.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 transition-all duration-300 border rounded-lg border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-900/50">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

