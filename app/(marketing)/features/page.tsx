import React from "react";

export const metadata = {
  title: "Features - Fastlearners",
  description: "Discover the powerful features that make Fastlearners the ultimate learning platform for Nigerian secondary school students.",
};

export default function FeaturesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:py-16 md:py-20">
      <div className="space-y-12 sm:space-y-16 md:space-y-20">
        {/* Hero Section */}
        <div className="space-y-6 text-center">
          <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Powerful Features for{" "}
            <span className="text-gradient_indigo-purple">
              Every Learner
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            From personalized learning paths to exam preparation tools, Fastlearners provides everything you need to excel academically.
          </p>
        </div>

        {/* Why Choose Fastlearners */}
        <section className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Why Choose Fastlearners App
            </h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
            <p className="mx-auto max-w-3xl text-balance text-muted-foreground sm:text-lg">
              Fastlearners isn&apos;t just another study tool — it&apos;s a purpose-built learning ecosystem created for Nigerian secondary school students, teachers, and guardians.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-xl border-2 border-primary/20 bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-lg sm:p-5 md:p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 sm:size-12 md:size-14">
                <svg className="size-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Curriculum-Perfect Content</h3>
              <p className="mb-4 text-muted-foreground">
                Every lesson, quiz, and study pack is mapped to the Nigerian Secondary School Curriculum (JSS1–SS3). Complete coverage across all subjects with exam-aligned practice questions.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Complete coverage across all subjects and topics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Exam-aligned lesson notes and practice questions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Structured study plans that mirror school progression</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-xl border-2 border-primary/20 bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-lg sm:p-5 md:p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 sm:size-12 md:size-14">
                <svg className="size-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Personalized Learning</h3>
              <p className="mb-4 text-muted-foreground">
                Our platform learns how a student studies and tailors content accordingly. Adaptive quizzes increase in difficulty as mastery improves.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Accurate recommendations and topic sequencing</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Adaptive quizzes that increase in difficulty</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Personalized study reminders and micro-learning nudges</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-xl border-2 border-primary/20 bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-lg sm:p-5 md:p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 sm:size-12 md:size-14">
                <svg className="size-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Real Exam Preparation</h3>
              <p className="mb-4 text-muted-foreground">
                Organized past-question library and exam-style quizzes for WAEC, NECO & JAMB to build speed, accuracy, and confidence.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Year-grouped past questions with model solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Timed mock exams that simulate real exam conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Detailed answer walkthroughs for better exam technique</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-xl border-2 border-primary/20 bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-lg sm:p-5 md:p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 sm:size-12 md:size-14">
                <svg className="size-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Actionable Insights</h3>
              <p className="mb-4 text-muted-foreground">
                Clear dashboards showing what&apos;s mastered, what&apos;s weak, and where to focus next with visual progress charts and mastery heatmaps.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Visual progress charts and mastery heatmaps</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Performance breakdown by topic, subject, and quiz type</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Teacher and guardian alerts for intervention opportunities</span>
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-xl border-2 border-primary/20 bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-lg sm:p-5 md:p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 sm:size-12 md:size-14">
                <svg className="size-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Built for Everyone</h3>
              <p className="mb-4 text-muted-foreground">
                Connects students, teachers, and guardians with tools to monitor class performance and assign content.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Teacher dashboards and class assignment tools</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Guardian dashboards with weekly summary reports</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Easy sharing of results and certificates</span>
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-xl border-2 border-primary/20 bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-lg sm:p-5 md:p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 sm:size-12 md:size-14">
                <svg className="size-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Motivation Through Gamification</h3>
              <p className="mb-4 text-muted-foreground">
                Badges, leaderboards, and friendly competitions keep students engaged and committed to improvement.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Leaderboards by class, school, and region</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Achievement badges and milestone rewards</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">✓</span>
                  <span>Challenge modes for peer competitions</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Core Platform Features
            </h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
            <p className="mx-auto max-w-3xl text-balance text-muted-foreground sm:text-lg">
              Everything you need to learn, practice, and excel in one comprehensive platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Stay on top of your learning journey with intelligent progress tracking. Every lesson, quiz, and topic is automatically recorded to show how far you&apos;ve come.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Performance Tracking</h3>
              <p className="text-muted-foreground">
                Understand your academic strengths and weaknesses through real-time performance insights with detailed analytics on test results.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Quiz Platform</h3>
              <p className="text-muted-foreground">
                Turn learning into fun challenges. Test your knowledge across subjects, compete with classmates, and earn badges for excellence.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Past Questions Platform</h3>
              <p className="text-muted-foreground">
                Access a comprehensive library of past examination questions from WAEC, NECO, JAMB, organized by subject and year.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Subject Selection</h3>
              <p className="text-muted-foreground">
                Customize your study plan according to your class and areas of interest with full access to all curriculum subjects.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Comprehensive Lessons</h3>
              <p className="text-muted-foreground">
                Detailed, curriculum-aligned lesson notes created by expert educators with visual aids, examples, and self-assessment exercises.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Leaderboard</h3>
              <p className="text-muted-foreground">
                Learn, compete, and rise to the top! Rankings based on quiz performance, activity level, and consistency to inspire engagement.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Profile Management</h3>
              <p className="text-muted-foreground">
                Manage your learning space effortlessly with a personalized dashboard. Update details, view reports, and manage subscriptions.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Complaints Platform</h3>
              <p className="text-muted-foreground">
                Easily report issues, give feedback, or request assistance. Our support team ensures every concern is attended to promptly.
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Features */}
        <section className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Powerful Dashboards for Everyone
            </h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
            <p className="mx-auto max-w-3xl text-balance text-muted-foreground sm:text-lg">
              Tailored experiences for students, guardians, and guests with role-specific insights and controls.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 p-5 shadow-lg md:p-8">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 sm:size-14 md:size-16">
                <svg className="size-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">Student Dashboard</h3>
              <p className="mb-4 text-muted-foreground">
                Your learning world, simplified and personalized. Take full control of your academic journey.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>View ongoing lessons and completed topics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Track academic progress and quiz scores</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Access performance reports and recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Compete on leaderboards and celebrate milestones</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 p-5 shadow-lg md:p-8">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 sm:size-14 md:size-16">
                <svg className="size-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">Guardian Dashboard</h3>
              <p className="mb-4 text-muted-foreground">
                Stay connected with your child&apos;s learning progress with clear, actionable insights.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>View performance reports and progress charts</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Monitor lesson attendance and subject engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Identify strengths, weaknesses, and learning patterns</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Receive alerts on updates, quizzes, and achievements</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 p-5 shadow-lg md:p-8">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 sm:size-14 md:size-16">
                <svg className="size-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">Guest Dashboard</h3>
              <p className="mb-4 text-muted-foreground">
                Explore the Fastlearners experience before signing up with a preview of our platform.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Explore sample lessons and quizzes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>View curriculum outlines and platform features</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Understand how the system works</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>Discover the learning community</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              How It Works
            </h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
            <p className="mx-auto max-w-3xl text-balance text-muted-foreground sm:text-lg">
              A seamless journey from sign-up to success in just 9 simple steps.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-8 hidden w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent md:block"></div>

            <div className="space-y-8">
              {[
                { num: 1, title: "Sign Up & Role Selection", desc: "Get started in seconds! Choose your role — Student, Guardian, or Guest — and create your account." },
                { num: 2, title: "Profile Management", desc: "Set up your profile with your class, preferred subjects, and interests for a personalized experience." },
                { num: 3, title: "Subject Selection", desc: "Select subjects according to your class level and discipline to unlock relevant lessons." },
                { num: 4, title: "Lesson Pages", desc: "Access structured lessons with examples, explanations, and exercises to learn and apply knowledge." },
                { num: 5, title: "Quiz Competitions", desc: "Participate in quizzes to test your knowledge and join competitions to sharpen your skills." },
                { num: 6, title: "Past Questions", desc: "Practice with real WAEC, NECO, and JAMB past questions to prepare like a pro." },
                { num: 7, title: "Track Progress", desc: "View completion rates and study time to stay consistent and motivated." },
                { num: 8, title: "Track Performance", desc: "Measure scores from exercises, quizzes, and past questions to identify improvement areas." },
                { num: 9, title: "Leaderboard", desc: "Compete with peers and climb the ranks to celebrate academic excellence." },
              ].map((step) => (
                <div key={step.num} className="relative flex items-start gap-4 sm:gap-6">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xl font-bold text-primary-foreground shadow-lg sm:size-16 sm:text-2xl">
                    {step.num}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who It's Built For */}
        <section className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Who Fastlearners is Built For
            </h2>
            <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
            <p className="mx-auto max-w-3xl text-balance text-muted-foreground sm:text-lg">
              Designed for everyone in the education ecosystem — from students to institutions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border-2 border-primary/20 bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <svg className="size-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Students</h3>
              <p className="text-sm text-muted-foreground">
                Learn at your own pace, track progress, and compete with peers across Nigeria.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <svg className="size-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Guardians</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your child&apos;s learning activities and celebrate milestones together.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <svg className="size-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Teachers</h3>
              <p className="text-sm text-muted-foreground">
                Access curriculum-ready lessons and manage class performance in real time.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <svg className="size-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Schools</h3>
              <p className="text-sm text-muted-foreground">
                Digitize your learning environment and improve results with measurable tracking.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <svg className="size-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">O&apos;Level Learners</h3>
              <p className="text-sm text-muted-foreground">
                Study anywhere, anytime with structured lessons and revision packs.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <svg className="size-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Extra-Mural Operators</h3>
              <p className="text-sm text-muted-foreground">
                Manage multiple learners and blend physical lessons with digital tools.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <svg className="size-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">NGOs & Organizations</h3>
              <p className="text-sm text-muted-foreground">
                Track impact and performance across learners with powerful analytics.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <svg className="size-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Scholarship Sponsors</h3>
              <p className="text-sm text-muted-foreground">
                Monitor beneficiaries and ensure sponsorships create real success stories.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-center shadow-xl sm:p-12 md:p-16">
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <h2 className="mb-4 font-heading text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl">
              Ready to Experience It?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-primary-foreground/90 sm:text-xl">
              Join thousands of learners building brighter futures with Fastlearners.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/signup"
                className="rounded-full bg-background px-8 py-3.5 font-bold text-foreground shadow-lg transition-all hover:scale-105 hover:bg-muted"
              >
                Get Started Free
              </a>
              <a
                href="/pricing"
                className="rounded-full border-2 border-primary-foreground bg-transparent px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary-foreground hover:text-primary"
              >
                See Plans for Schools
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
