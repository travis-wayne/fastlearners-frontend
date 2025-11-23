"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, User, BookOpen, FileText, HelpCircle, Target, BarChart3, Rocket } from "lucide-react";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const steps = [
  { 
    number: 1, 
    title: "Sign Up", 
    subtitle: "Select Role",
    description: "Create your account in seconds. Choose your role: Student, Teacher, Guardian, or School Administrator.",
    icon: UserPlus,
  },
  { 
    number: 2, 
    title: "Profile", 
    subtitle: "Setup Details",
    description: "Complete your profile with your class level, subjects of interest, and learning goals.",
    icon: User,
  },
  { 
    number: 3, 
    title: "Subjects", 
    subtitle: "Select Classes",
    description: "Choose from JSS1 to SS3 subjects. Pick the classes you want to study and master.",
    icon: BookOpen,
  },
  { 
    number: 4, 
    title: "Lessons", 
    subtitle: "Interactive Notes",
    description: "Access comprehensive, curriculum-aligned lessons with interactive content, videos, and examples.",
    icon: FileText,
  },
  { 
    number: 5, 
    title: "Quizzes", 
    subtitle: "Compete",
    description: "Test your knowledge with interactive quizzes. Compete with peers and track your progress.",
    icon: HelpCircle,
  },
  { 
    number: 6, 
    title: "Past Qs", 
    subtitle: "Exam Prep",
    description: "Practice with 10+ years of WAEC, NECO, and JAMB past questions with detailed solutions.",
    icon: Target,
  },
  { 
    number: 7, 
    title: "Track", 
    subtitle: "Real-time Data",
    description: "Monitor your progress with real-time analytics, mastery levels, and performance insights.",
    icon: BarChart3,
  },
  { 
    number: 8, 
    title: "Success", 
    subtitle: "Leaderboard",
    icon: Rocket,
    description: "Climb the leaderboard, earn badges, and celebrate your achievements with your school community.",
  },
];

// Meandering road path coordinates (SVG path)
const roadPath = "M 50 200 Q 150 150, 250 180 T 450 160 T 650 200 T 850 140 T 1050 180";

export default function HowItWorks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate positions for steps along the meandering path
  const stepPositions = [
    { x: 50, y: 200 },
    { x: 250, y: 180 },
    { x: 450, y: 160 },
    { x: 650, y: 200 },
    { x: 850, y: 140 },
    { x: 1050, y: 180 },
    { x: 1250, y: 160 },
    { x: 1450, y: 200 },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-900"></div>
      
      <MaxWidthWrapper>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-slate-400 text-lg">Your journey from sign-up to success in 8 simple steps.</p>
        </motion.div>

        {/* Desktop: Meandering Road */}
        <div className="hidden lg:block relative w-full py-20">
          <div className="relative" style={{ height: "400px" }}>
            {/* SVG Road Path */}
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
              {/* Road base */}
              <motion.path
                d={roadPath}
                fill="none"
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              {/* Road center line */}
              <motion.path
                d={roadPath}
                fill="none"
                stroke="rgba(99, 102, 241, 0.4)"
                strokeWidth="2"
                strokeDasharray="10 5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
              />
              {/* Animated progress line */}
              <motion.path
                d={roadPath}
                fill="none"
                stroke="url(#roadGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Steps positioned along the road */}
            {steps.map((step, index) => {
              const Icon = step.icon;
              const position = stepPositions[index];
              return (
                <motion.div
                  key={index}
                  className="absolute flex flex-col items-center group cursor-pointer"
                  style={{
                    left: `${(position.x / 1500) * 100}%`,
                    top: `${(position.y / 400) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, type: "spring" }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  <motion.div
                    className={`w-16 h-16 ${
                      index === 0
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-blue-400"
                        : index === steps.length - 1
                          ? "bg-gradient-to-br from-green-500 to-green-600 border-2 border-green-400"
                          : "bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 group-hover:border-blue-500"
                    } rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm relative z-10`}
                    whileHover={{ scale: 1.3, rotate: 360 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: hoveredIndex === index
                        ? "0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(168, 85, 247, 0.4)"
                        : "0 0 0px rgba(59, 130, 246, 0)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                    {index !== steps.length - 1 && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{step.number}</span>
                      </div>
                    )}
                  </motion.div>
                  <div className="mt-4 text-center max-w-[140px]">
                    <h4 className="font-bold text-sm text-white">{step.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{step.subtitle}</p>
                  </div>

                  {/* Enhanced Tooltip */}
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute top-full mt-8 w-72 p-5 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/50 rounded-xl shadow-2xl z-30 backdrop-blur-xl"
                        style={{
                          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.2)",
                        }}
                      >
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-800 border-l-2 border-t-2 border-blue-500/50 rotate-45"></div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h5 className="font-bold text-white mb-1">{step.title}</h5>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile/Tablet: Grid Layout */}
        <div className="lg:hidden grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="relative flex flex-col items-center group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <motion.div
                  className={`w-14 h-14 ${
                    index === 0
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-blue-400"
                      : index === steps.length - 1
                        ? "bg-gradient-to-br from-green-500 to-green-600 border-2 border-green-400"
                        : "bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 group-hover:border-blue-500"
                  } rounded-full flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="mt-3 text-center">
                  <h4 className="font-bold text-sm text-white">{step.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{step.subtitle}</p>
                </div>

                {/* Mobile Tooltip */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full mt-3 w-full p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/50 rounded-xl shadow-xl z-20"
                    >
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
