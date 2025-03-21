"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Blogistics has transformed how we handle international shipping payments. The escrow system gives us confidence when working with new partners.",
      author: "Sarah Johnson",
      role: "Logistics Manager",
      company: "Global Trade Solutions",
      rating: 5,
    },
    {
      quote:
        "The automated escrow releases have cut our payment processing time by 75%. Our carriers get paid faster, and we have complete transparency.",
      author: "Michael Chen",
      role: "Supply Chain Director",
      company: "Pacific Imports",
      rating: 5,
    },
    {
      quote:
        "As a logistics provider, getting paid can be complicated. Blogistics has simplified our payment collection with their escrow system.",
      author: "David Rodriguez",
      role: "Owner",
      company: "FastFreight Logistics",
      rating: 4,
    },
  ]

  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Trusted by Logistics Professionals</h2>
            <p className="text-xl text-blue-200">See what our customers are saying about our platform.</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-lg bg-white/10 backdrop-blur-sm"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <blockquote className="mb-6 text-lg italic">"{testimonial.quote}"</blockquote>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-blue-200">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

