"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl p-8 mx-auto text-center bg-white rounded-lg shadow-lg"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Ready to Transform Your Logistics Payments?</h2>
          <p className="mb-8 text-xl text-gray-600">
            Join thousands of businesses using Blogistics to secure their logistics operations with XRPL escrow
            technology.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8" asChild>
              <Link href="/auth/register">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

