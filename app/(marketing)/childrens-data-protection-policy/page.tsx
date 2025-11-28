import React from "react";

export const metadata = {
  title: "Children’s Data Protection Policy - Fastlearners",
  description: "Learn how Fastlearners protects children’s personal data.",
};

export default function ChildrensDataProtectionPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Children’s Data Protection Policy
          </h1>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            1. Purpose
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            This policy explains how Fastlearners protects children’s personal data under GDPR Article 8 and NDPR 2.5.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            2. Definition of a Child
          </h2>
          <p className="text-muted-foreground">A child is:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Under 18 years (NDPR)</li>
            <li>Under 16 years (GDPR default; varies by region)</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            Fastlearners applies the highest protection standard across all regions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            3. Types of Data Collected
          </h2>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Name</li>
            <li>Age/class</li>
            <li>Address (Limited to Location)</li>
            <li>Progress analytics</li>
            <li>Parent/guardian contact information</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            4. Parental Consent
          </h2>
          <p className="text-muted-foreground">We use verifiable parental consent methods:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Email verification</li>
            <li>SMS verification</li>
            <li>School-issued codes</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            5. Parents/Guardians Have Rights To:
          </h2>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Access their child’s data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion</li>
            <li>Withdraw consent anytime</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            6. Data Sharing
          </h2>
          <p className="text-muted-foreground">
            Children’s data is never shared without parental consent
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            7. Data Retention
          </h2>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Children’s accounts are deleted upon parent request</li>
            <li>Data older than 24 months is automatically deleted</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            8. Security Measures
          </h2>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Strict encryption</li>
            <li>Access control</li>
            <li>Staff background checks</li>
            <li>Regular security audits</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
