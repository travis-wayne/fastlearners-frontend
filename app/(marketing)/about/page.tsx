import React from "react";

export const metadata = {
  title: "About Us - Fastlearners",
  description: "Learn about Fastlearners App, our team, partners, and mission to transform education for Nigerian secondary school students.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 sm:py-16 md:py-20">
      <div className="space-y-12 sm:space-y-14 md:space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 text-center">
          <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            About{" "}
            <span className="text-gradient_indigo-purple">
              Fastlearners
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            Transforming education through innovative technology, expert content, and a commitment to every learner&apos;s success.
          </p>
        </div>

        {/* About the Platform */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              About the Platform
            </h2>
            <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Fastlearners App is a cutting-edge digital learning platform designed to make education smarter, easier, and more engaging for students. Built to cover the entire Secondary School Curriculum, the app offers students access to structured lesson notes, interactive quizzes, classroom simulations, and full educational packages — all in one place.
            </p>
            <p>
              At Fastlearners, we believe that every learner deserves the opportunity to learn at their own pace, in their own way, and from the best available resources. Whether you&apos;re a student that is being schooled at home or you are preparing for internal school exams like WAEC, NECO, JAMB etc or you are a teacher looking for reliable digital support materials, Fastlearners App provides the right tools to make learning enjoyable and effective.
            </p>
            <p className="font-medium text-foreground">
              Our platform is powered by a blend of Innovative Technology, Personalization, and Expert Educational Content developed by some of the brightest educators across Nigeria. With Fastlearners, you&apos;re not just studying — you&apos;re preparing to excel in the real world.
            </p>
          </div>
        </section>

        {/* Contributors / Team */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Contributors & Team
            </h2>
            <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Behind Fastlearners App is a dedicated team of visionary educators, software developers, curriculum experts, and digital innovators united by one goal — to redefine how students across the globe learn and succeed.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="group rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md sm:p-5 md:p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 sm:size-12 md:size-14">
                    <svg className="size-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Experienced Educators</h3>
                </div>
                <p className="text-muted-foreground">
                  Teachers and subject experts who have meticulously structured lessons in alignment with the Federal Ministry of Education syllabus.
                </p>
              </div>
            </div>

            <div className="group rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md sm:p-5 md:p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 sm:size-12 md:size-14">
                    <svg className="size-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Instructional Designers</h3>
                </div>
                <p className="text-muted-foreground">
                  Learning technologists who ensure that every topic is engaging, interactive, and accessible.
                </p>
              </div>
            </div>

            <div className="group rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md sm:p-5 md:p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 sm:size-12 md:size-14">
                    <svg className="size-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Developers & Designers</h3>
                </div>
                <p className="text-muted-foreground">
                  UX designers and developers who have created an intuitive and user-friendly learning environment for students of all backgrounds.
                </p>
              </div>
            </div>

            <div className="group rounded-lg border-2 border-primary/20 bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md sm:p-5 md:p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 sm:size-12 md:size-14">
                    <svg className="size-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Assessment Specialists</h3>
                </div>
                <p className="text-muted-foreground">
                  Experts who craft real-world quizzes, exam questions, and continuous evaluation tests that mirror standard Nigerian examinations.
                </p>
              </div>
            </div>
          </div>

          <p className="pt-4 text-center text-lg font-medium text-foreground">
            Together, our team embodies excellence, passion, and innovation — the core values that make Fastlearners more than just an app, but a complete learning ecosystem.
          </p>
        </section>

        {/* Key Partners */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Key Partners
            </h2>
            <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Fastlearners App thrives on collaboration and strong partnerships with institutions and organizations that share our vision for transforming education across Africa and the world at large.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-gradient-to-br from-card to-card/50 p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-3 text-xl font-semibold text-foreground">Educational Institutions & Curriculum Boards</h3>
              <p className="text-muted-foreground">
                Provide structured guidance and accreditation for content quality and alignment.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-gradient-to-br from-card to-card/50 p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-3 text-xl font-semibold text-foreground">Technology Companies</h3>
              <p className="text-muted-foreground">
                Power our digital infrastructure, accurate recommendation systems, and secure learning environments.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-gradient-to-br from-card to-card/50 p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-3 text-xl font-semibold text-foreground">Publishing & Content Partners</h3>
              <p className="text-muted-foreground">
                Help ensure that our lesson notes, textbooks, and educational resources stay current and comprehensive.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-gradient-to-br from-card to-card/50 p-4 shadow-sm sm:p-5 md:p-6">
              <h3 className="mb-3 text-xl font-semibold text-foreground">NGOs & EdTech Advocates</h3>
              <p className="text-muted-foreground">
                Committed to bridging the learning gap through innovation and accessibility.
              </p>
            </div>
          </div>

          <p className="pt-4 leading-relaxed text-muted-foreground">
            These partnerships strengthen our mission — ensuring that Fastlearners continues to deliver quality education for every learner, anywhere, anytime.
          </p>
        </section>

        {/* Board of Directors */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Board of Directors
            </h2>
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
          </div>

          <p className="leading-relaxed text-muted-foreground">
            The Fastlearners Board of Directors is composed of seasoned professionals in education, ICT, business strategy, and innovation management, providing strong leadership and governance for the platform.
          </p>

          <p className="leading-relaxed text-muted-foreground">
            Each member brings a wealth of experience, ensuring that the app remains a trusted, scalable, and impactful educational solution.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 text-center shadow-sm sm:p-5 md:p-6">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 sm:size-14 md:size-16">
                <svg className="size-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Educational Integrity</h3>
              <p className="text-sm text-muted-foreground">
                Ensuring all content meets national standards and maintains pedagogical excellence.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 text-center shadow-sm sm:p-5 md:p-6">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 sm:size-14 md:size-16">
                <svg className="size-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Technological Innovation</h3>
              <p className="text-sm text-muted-foreground">
                Guiding the integration of emerging technologies like data analytics into the learning experience.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 text-center shadow-sm sm:p-5 md:p-6">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 sm:size-14 md:size-16">
                <svg className="size-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Strategic Growth</h3>
              <p className="text-sm text-muted-foreground">
                Overseeing partnerships, investments, and expansion initiatives across schools and regions.
              </p>
            </div>

            <div className="rounded-lg border-2 border-primary/20 bg-card p-4 text-center shadow-sm sm:p-5 md:p-6">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 sm:size-14 md:size-16">
                <svg className="size-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Sustainability & Impact</h3>
              <p className="text-sm text-muted-foreground">
                Ensuring Fastlearners contributes meaningfully to Global Educational Transformation.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-6">
            <p className="text-center text-lg font-medium text-foreground">
              Together, our Board, Team, and Partners are committed to one mission — making quality education accessible to every learner in Nigeria and beyond.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
