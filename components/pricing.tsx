"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "0.5%",
      description: "Per transaction value",
      features: [
        "Up to 10 escrow contracts/month",
        "Basic KYB verification",
        "Standard escrow templates",
        "Email support",
        "7-day transaction history",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Business",
      price: "0.3%",
      description: "Per transaction value",
      features: [
        "Unlimited escrow contracts",
        "Priority KYB verification",
        "Custom escrow templates",
        "Priority support",
        "30-day transaction history",
        "API access for automation",
        "Custom invoice integration",
      ],
      cta: "Try Business",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Contact for pricing",
      features: [
        "Unlimited escrow contracts",
        "Express KYB verification",
        "Fully customizable templates",
        "Dedicated account manager",
        "Unlimited transaction history",
        "Advanced API integration",
        "Custom development options",
        "SLA guarantees",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works best for your business needs.</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 rounded-lg ${
                plan.highlighted
                  ? "bg-blue-600 text-white shadow-xl scale-105 border-0"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`ml-2 ${plan.highlighted ? "text-blue-100" : "text-gray-600"}`}>
                  {plan.description}
                </span>
              </div>
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className={`w-5 h-5 mr-2 ${plan.highlighted ? "text-blue-200" : "text-blue-500"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                asChild
              >
                <Link href="/auth/register">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

