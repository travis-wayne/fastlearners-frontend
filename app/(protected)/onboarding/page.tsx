'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, BookOpen, Trophy, ArrowRight } from 'lucide-react'

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative">
      <svg width="120" height="120" className="transform -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-primary"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, getProfileCompletionPercentage, isProfileComplete } = useAuthStore()
  const percentage = user ? getProfileCompletionPercentage() : 0
  const isComplete = user ? isProfileComplete() : false

  useEffect(() => {
    if (isComplete) {
      router.push('/dashboard')
    }
  }, [isComplete, router])

  if (!user) return null

  const benefits = [
    { icon: User, text: 'Personalized learning experience' },
    { icon: BookOpen, text: 'Access to all courses and activities' },
    { icon: Trophy, text: 'Track your progress and achievements' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Welcome, {user.name || user.email}!
            </CardTitle>
            <CardDescription className="text-lg">
              Let's get your profile set up to unlock the full Fast Learner experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <CircularProgress percentage={percentage} />
            </div>
            <p className="text-center text-muted-foreground">
              You're {percentage}% done! Complete your profile to get started.
            </p>
            <motion.ul
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="flex items-center space-x-3"
                >
                  <benefit.icon className="h-5 w-5 text-primary" />
                  <span>{benefit.text}</span>
                </motion.li>
              ))}
            </motion.ul>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => router.push('/onboarding/complete-profile')}
                className="flex-1"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="flex-1"
              >
                Skip for Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}