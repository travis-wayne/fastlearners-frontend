"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Zap, Target, Trophy, Users, GraduationCap } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const mockupVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 2,
  },
};

export default function HeroLanding() {
  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 px-4 bg-slate-950 overflow-hidden relative min-h-screen flex items-center">
      {/* Hero Image Background with Dark Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-purple-950/30 to-pink-950/40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('/hero-learning.jpg')",
          }}
        ></div>
        {/* Dark mode overlay - multiple layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        {/* Subtle blue-purple-pink accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-purple-950/20 to-pink-950/30"></div>
      </div>
      
      {/* Main hero container */}
      <div className="container max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center"
        >
          {/* Left content */}
          <motion.div
            variants={itemVariants}
            className="relative z-10 flex flex-col justify-center space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="space-y-6">
              {/* Logo/Badge */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 mb-6"
              >
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <BookOpen className="w-6 h-6 text-blue-300" />
                </motion.div>
                <motion.div
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-blue-300 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-white/15 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Nigeria's #1 Learning Platform
                </motion.div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-balance font-urban text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-6"
              >
                Learn Smarter,{" "}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 inline-block"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  Excel Faster.
                </motion.span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg"
              >
                Transform your learning journey with personalized lessons, interactive quizzes, and expert guidance. Master WAEC, NECO & JAMB with confidence.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/register"
                  prefetch={true}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold shadow-lg shadow-blue-600/30 transition"
                  )}
                >
                  Start Learning Free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/pricing"
                  prefetch={true}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                    }),
                    "bg-slate-800/50 border border-slate-700 text-slate-200 hover:bg-slate-800 px-8 py-4 rounded-lg font-bold transition backdrop-blur-sm"
                  )}
                >
                  Watch Demo
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap gap-8"
            >
              {[
                { value: "10K+", label: "Active Students", color: "text-blue-400", icon: Users },
                { value: "500+", label: "Expert Teachers", color: "text-purple-400", icon: GraduationCap },
                { value: "95%", label: "Success Rate", color: "text-pink-400", icon: Trophy },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                      <span className="text-sm text-slate-400">{stat.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right illustration - Minimalist with image */}
          <motion.div
            variants={mockupVariants}
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Image with dark overlay */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('/hero-learning.jpg')",
                  }}
                ></div>
                {/* Minimalist dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60"></div>
                
                {/* Minimalist floating elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Subtle glow effects */}
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Minimalist badges */}
                <motion.div
                  className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl shadow-lg hover:bg-white/15 transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-300" />
                    <span className="text-white font-semibold text-sm">100% Aligned</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    <span className="text-white font-semibold text-sm">4.9/5.0 Rating</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
