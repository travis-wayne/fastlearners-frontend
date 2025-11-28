import React from "react";

export const metadata = {
  title: "Privacy Policy - Fastlearners",
  description: "Read our Privacy Policy to understand how we collect, use, and protect your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy for Fastlearners
          </h1>
          <div className="flex flex-col space-y-1 text-muted-foreground">
            <p>Effective Date: 29/11/2025</p>
            <p>Controller: Fastlearners Limited</p>
            <p>Contact: info@fastlearnersapp.com, +2347065447436, 3 Chief Aaron Nteubong Street Eastern Obolo, Akwa Ibom State.</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            1. Introduction
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Fastlearners Limited (“Fastlearners”, “we”, “our”, or “us”) provides digital learning tools and educational services to students, parents/guardians, teachers, and institutions across Nigeria, Ghana, Sierra Leone, Gambia, and Liberia.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            This Privacy Policy explains how we collect, use, store, and protect personal data in compliance with the NDPR (Nigeria) and GDPR (EU).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            2. What Personal Data We Collect
          </h2>
          <p className="text-muted-foreground">We may collect the following:</p>
          
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-foreground">a. User Account Information</h3>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Full Name</li>
              <li>Username</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Password (encrypted)</li>
              <li>Gender</li>
              <li>Address</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">b. Educational Profile</h3>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Class/Grade level</li>
              <li>School name (if applicable)</li>
              <li>Subjects and performance analytics</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">c. Usage Data</h3>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>App interactions</li>
              <li>Device information</li>
              <li>Log files (IP address, timestamps)</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">d. Payment Information</h3>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Transaction reference</li>
              <li>Billing details</li>
            </ul>
            <p className="text-sm italic text-muted-foreground">We do NOT store card information.</p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">e. Children’s Data</h3>
            <p className="text-muted-foreground">For users below the age of parental consent:</p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Parent/guardian name</li>
              <li>Parent/guardian contact details</li>
              <li>Consent verification logs</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            3. Legal Basis for Processing (GDPR Article 6)
          </h2>
          <p className="text-muted-foreground">We rely on:</p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li><span className="font-medium text-foreground">Consent</span> (for minors and optional features)</li>
            <li><span className="font-medium text-foreground">Contract performance</span> (to provide digital app services)</li>
            <li><span className="font-medium text-foreground">Legitimate interest</span> (service improvement, analytics)</li>
            <li><span className="font-medium text-foreground">Legal obligation</span> (records required by law)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            4. How We Use Personal Data
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>To create and manage user accounts</li>
            <li>To deliver learning content</li>
            <li>To analyze academic progress</li>
            <li>To personalize user experience</li>
            <li>To provide customer support</li>
            <li>To comply with regulatory obligations</li>
          </ul>
          <p className="font-medium text-muted-foreground">We do not sell, trade, or rent user data.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            5. Children’s Data (GDPR Articles 8 & NDPR 2.5)
          </h2>
          <p className="text-muted-foreground">We collect children’s data only with verifiable parental/guardian consent.</p>
          <p className="text-muted-foreground">Parents may request:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Access to the child’s data</li>
            <li>Correction</li>
            <li>Deletion</li>
            <li>Withdrawal of consent</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            6. Data Sharing
          </h2>
          <p className="text-muted-foreground">We may share data with:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Hosting providers</li>
            <li>Analytics providers</li>
            <li>Educational institutions (with consent or contract)</li>
          </ul>
          <p className="text-muted-foreground">All third parties sign binding Data Processing Agreements (DPAs) and meet GDPR/NDPR standards.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            7. International Data Transfers
          </h2>
          <p className="text-muted-foreground">Data may be stored or processed outside Nigeria.</p>
          <p className="text-muted-foreground">We use:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Standard Contractual Clauses (SCCs)</li>
            <li>NDPR-approved safeguards</li>
            <li>Secure cloud infrastructure</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            8. Data Retention
          </h2>
          <p className="text-muted-foreground">We retain data only as long as necessary:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li><span className="font-medium text-foreground">Active accounts:</span> retained indefinitely</li>
            <li><span className="font-medium text-foreground">Inactive accounts:</span> deleted after 24 months</li>
            <li><span className="font-medium text-foreground">Children’s data:</span> deleted upon request</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            9. Your Rights
          </h2>
          <p className="text-muted-foreground">Under GDPR and NDPR, users can:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Access their data</li>
            <li>Request correction</li>
            <li>Request deletion</li>
            <li>Object to processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent</li>
          </ul>
          <p className="text-muted-foreground">Send all requests to: <a href="mailto:support@fastlearnersapp.com" className="text-primary hover:underline">support@fastlearnersapp.com</a></p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            10. Security
          </h2>
          <p className="text-muted-foreground">We implement:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>End-to-end encryption</li>
            <li>SSL/TLS</li>
            <li>Role-based access control</li>
            <li>Regular audits</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            11. Contact
          </h2>
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="mb-2 font-medium text-foreground">Fastlearners Limited</p>
            <div className="space-y-1 text-muted-foreground">
              <p>Email: <a href="mailto:info@fastlearnersapp.com" className="text-primary hover:underline">info@fastlearnersapp.com</a></p>
              <p>Address: 3 Chief Aaron Nteubong Street Okorombokho, Eastern Obolo, Akwa Ibom State</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
