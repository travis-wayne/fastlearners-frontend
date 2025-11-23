"use client";

import { motion } from "framer-motion";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const beneficiaries = [
  {
    title: "Students",
    description: "Gain confidence, improve grades, and prepare effectively for national exams.",
    color: "blue",
    stats: "95% pass rate",
    icon: "🎓",
    benefits: [
      "Personalized learning paths",
      "Real-time progress tracking",
      "Exam preparation tools",
      "Peer competition & badges",
    ],
  },
  {
    title: "Guardians",
    description: "Get clarity and peace of mind about your child's learning progress instantly.",
    color: "green",
    stats: "24/7 access",
    icon: "👨‍👩‍👧",
    benefits: [
      "Progress reports & analytics",
      "Performance alerts",
      "Study time tracking",
      "Direct communication with teachers",
    ],
  },
  {
    title: "Teachers",
    description: "Save prep time, get powerful class insights, and deliver effective lessons.",
    color: "purple",
    stats: "50% time saved",
    icon: "👨‍🏫",
    benefits: [
      "Ready-made lesson plans",
      "Class performance analytics",
      "Automated grading",
      "Student engagement insights",
    ],
  },
  {
    title: "Schools",
    description: "Standardize learning, improve outcomes, and scale digital teaching.",
    color: "orange",
    stats: "30% improvement",
    icon: "🏫",
    benefits: [
      "School-wide analytics dashboard",
      "Curriculum standardization",
      "Bulk student management",
      "Custom branding & reports",
    ],
  },
];

const borderColors = {
  blue: "border-blue-500",
  green: "border-green-500",
  purple: "border-purple-500",
  orange: "border-orange-500",
};

export default function WhoBenefits() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section className="py-20 px-4 bg-slate-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <MaxWidthWrapper className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Who Benefits Most?
          </h2>
          <p className="text-slate-300 mt-2 max-w-2xl mx-auto text-lg">
            Fastlearners is designed for everyone in the education ecosystem
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {beneficiaries.map((beneficiary, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-t-4 ${borderColors[beneficiary.color as keyof typeof borderColors]} relative overflow-hidden group cursor-pointer border border-slate-700/50`}
              whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
            >
              {/* Icon */}
              <motion.div
                className="text-5xl mb-4"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 + index * 0.5 }}
              >
                {beneficiary.icon}
              </motion.div>

              {/* Stats badge */}
              <motion.div
                className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full ${
                  beneficiary.color === "blue" ? "bg-blue-500/20 border-blue-500/30 text-blue-400" :
                  beneficiary.color === "green" ? "bg-green-500/20 border-green-500/30 text-green-400" :
                  beneficiary.color === "purple" ? "bg-purple-500/20 border-purple-500/30 text-purple-400" :
                  "bg-orange-500/20 border-orange-500/30 text-orange-400"
                } border`}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
              >
                {beneficiary.stats}
              </motion.div>

              <h3 className="font-bold text-xl mb-3 text-white">
                {beneficiary.title}
              </h3>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                {beneficiary.description}
              </p>

              {/* Benefits list */}
              <motion.ul
                className="space-y-2.5 mt-4 mb-6"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {beneficiary.benefits.map((benefit, i) => (
                  <motion.li
                    key={i}
                    className="text-sm text-slate-400 flex items-start gap-2 group-hover:text-slate-300 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + i * 0.05 + 0.5 }}
                  >
                    <span className={`mt-0.5 font-bold ${
                      beneficiary.color === "blue" ? "text-blue-400" :
                      beneficiary.color === "green" ? "text-green-400" :
                      beneficiary.color === "purple" ? "text-purple-400" :
                      "text-orange-400"
                    }`}>✓</span>
                    {benefit}
                  </motion.li>
                ))}
              </motion.ul>

              {/* CTA Button */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.button
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors ${
                    beneficiary.color === "blue" ? "bg-blue-600/20 border-blue-500/30 text-blue-400 hover:bg-blue-600/30" :
                    beneficiary.color === "green" ? "bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30" :
                    beneficiary.color === "purple" ? "bg-purple-600/20 border-purple-500/30 text-purple-400 hover:bg-purple-600/30" :
                    "bg-orange-600/20 border-orange-500/30 text-orange-400 hover:bg-orange-600/30"
                  } border`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More →
                </motion.button>
              </motion.div>

              {/* Hover gradient overlay */}
              <motion.div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl ${
                  beneficiary.color === "blue" ? "bg-gradient-to-br from-transparent to-blue-500/10" :
                  beneficiary.color === "green" ? "bg-gradient-to-br from-transparent to-green-500/10" :
                  beneficiary.color === "purple" ? "bg-gradient-to-br from-transparent to-purple-500/10" :
                  "bg-gradient-to-br from-transparent to-orange-500/10"
                }`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Section CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-slate-300 mb-6 text-lg">
            Ready to transform your learning experience?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/auth/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-600/30 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.a>
            <motion.a
              href="/pricing"
              className="px-8 py-4 bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 rounded-lg font-bold transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Pricing
            </motion.a>
          </div>
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
}

