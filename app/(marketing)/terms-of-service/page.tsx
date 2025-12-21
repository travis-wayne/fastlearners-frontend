import React from "react";

export const metadata = {
  title: "Terms of Service - Fastlearners",
  description: "Read our Terms of Service to understand the rules and regulations for using the Fastlearners App.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:py-16 md:py-20 lg:py-24">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Terms of Service (TOS)
          </h1>
          <div className="flex flex-col space-y-1 text-muted-foreground">
            <p>Effective Date: 29/11/2025</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            1. Acceptance of Terms
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            By using the Fastlearners App, you agree to these Terms of Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            2. Eligibility
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Users under 18 require parental/guardian consent (consent is assumed after payment is made).</li>
            <li>Parents are responsible for monitoring minor children&apos;s activities.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            3. User Responsibilities
          </h2>
          <div className="space-y-3">
            <p className="font-medium text-muted-foreground">You agree to:</p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Provide accurate information</li>
              <li>Keep login credentials secure</li>
              <li>Use the app lawfully</li>
            </ul>
            <p className="pt-2 font-medium text-muted-foreground">You must not:</p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Copy or redistribute our content</li>
              <li>Interfere with the app</li>
              <li>Use Fastlearners for cheating or academic malpractice</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            4. Intellectual Property
          </h2>
          <p className="text-muted-foreground">All:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Logos</li>
            <li>Designs</li>
            <li>Educational content</li>
            <li>Software</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            Are the property of Fastlearners Limited.
          </p>
          <p className="text-muted-foreground">
            You are granted a limited, non-exclusive, non-transferable license to use the app.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            5. Third-Party Services
          </h2>
          <p className="text-muted-foreground">
            Fastlearners may integrate tools (e.g., cloud hosting, analytics).
          </p>
          <p className="text-muted-foreground">
            Use of these services is governed by their respective terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            6. Termination
          </h2>
          <p className="text-muted-foreground">We may suspend or terminate accounts for:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Violation of terms</li>
            <li>Fraudulent activity</li>
            <li>Abuse of the platform</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            7. Disclaimer of Warranties
          </h2>
          <p className="text-muted-foreground">
            The app is provided “as is” without guarantees.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            8. Limitation of Liability
          </h2>
          <p className="text-muted-foreground">Fastlearners is not liable for:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Data loss</li>
            <li>App interruptions</li>
            <li>Third-party actions</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            Maximum liability is limited to the amount paid for services (if any).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            9. Governing Law
          </h2>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Nigeria Data Protection Regulation (NDPR)</li>
            <li>GDPR</li>
            <li>Laws of the Federal Republic of Nigeria</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
