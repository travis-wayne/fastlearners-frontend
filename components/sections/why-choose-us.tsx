"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const features = [
  {
    icon: "📚",
    title: "Curriculum-Perfect",
    description: "Every lesson is mapped to the Nigerian Secondary School Curriculum (JSS1–SS3). No irrelevant topics.",
    details: "Our content team works directly with Nigerian curriculum experts to ensure 100% alignment with NERDC standards. Every topic, subtopic, and learning objective is carefully mapped to match what students learn in class.",
    color: "blue",
  },
  {
    icon: "🤖",
    title: "AI-Personalized",
    description: "The app adapts to you. Need more help in Algebra? We provide tailored recommendations and deeper explanations.",
    details: "Our AI engine analyzes your performance patterns, identifies knowledge gaps, and creates personalized learning paths. It adapts in real-time, suggesting practice problems, video explanations, and study schedules based on your unique learning style.",
    color: "purple",
  },
  {
    icon: "🏆",
    title: "Exam Confidence",
    description: "Prepare for WAEC, NECO & JAMB with organized past questions, model solutions, and timed mock exams.",
    details: "Access 10+ years of past questions organized by topic and difficulty. Each question includes detailed solutions, marking schemes, and examiner's notes. Practice with timed mock exams that simulate real exam conditions.",
    color: "green",
  },
  {
    icon: "📊",
    title: "Actionable Insights",
    description: "Visual progress charts and mastery heatmaps help students, teachers, and guardians see exactly where to improve.",
    details: "Get real-time analytics on your learning journey. See which topics you've mastered, which need more practice, and track your improvement over time. Teachers and guardians get comprehensive reports to support student success.",
    color: "orange",
  },
  {
    icon: "🎮",
    title: "Gamification",
    description: "Learning stays engaging with badges, school leaderboards, and friendly peer competitions.",
    details: "Earn badges for milestones, compete on school leaderboards, and unlock achievements. Learning becomes a game where every quiz completed and lesson mastered earns you points and recognition.",
    color: "red",
  },
  {
    icon: "🔒",
    title: "Secure & Offline",
    description: "Low bandwidth optimization, offline lesson downloads, and banking-grade data security.",
    details: "Download lessons for offline access, perfect for areas with limited internet. Our platform uses end-to-end encryption and complies with international data protection standards. Your learning data is safe and private.",
    color: "teal",
  },
];

const colorClasses = {
  blue: "bg-blue-100 dark:bg-blue-950/30 group-hover:bg-blue-600 dark:group-hover:bg-blue-600",
  purple: "bg-purple-100 dark:bg-purple-950/30 group-hover:bg-purple-600 dark:group-hover:bg-purple-600",
  green: "bg-green-100 dark:bg-green-950/30 group-hover:bg-green-600 dark:group-hover:bg-green-600",
  orange: "bg-orange-100 dark:bg-orange-950/30 group-hover:bg-orange-600 dark:group-hover:bg-orange-600",
  red: "bg-red-100 dark:bg-red-950/30 group-hover:bg-red-600 dark:group-hover:bg-red-600",
  teal: "bg-teal-100 dark:bg-teal-950/30 group-hover:bg-teal-600 dark:group-hover:bg-teal-600",
};

export default function WhyChooseUs() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section id="why" className="py-20 px-4 bg-slate-900">
      <MaxWidthWrapper>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Fastlearners?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            We don't just digitize textbooks. We create a personalized path to mastery for every student.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-lg cursor-pointer group"
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <motion.div
                className={`w-12 h-12 ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-6 transition`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-2xl group-hover:text-white transition">
                  {feature.icon}
                </span>
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                {feature.description}
              </p>
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-slate-300 leading-relaxed pt-4 border-t border-slate-700">
                      {feature.details}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                className="mt-4 text-sm text-blue-400 font-medium"
                animate={{ opacity: expandedIndex === index ? 0 : 1 }}
              >
                {expandedIndex === index ? "Click to collapse" : "Click to learn more →"}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
}

