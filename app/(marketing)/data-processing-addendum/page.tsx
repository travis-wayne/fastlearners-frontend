import React from "react";

export const metadata = {
  title: "Data Processing Addendum - Fastlearners",
  description: "Data Processing Addendum for Schools, NGOs & Partners.",
};

export default function DataProcessingAddendumPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Data Processing Addendum (DPA)
          </h1>
          <p className="text-xl text-muted-foreground">For Schools, NGOs & Partners</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            1. Parties
          </h2>
          <p className="text-muted-foreground">This Data Processing Addendum (“DPA”) is between:</p>
          <div className="pl-6 border-l-2 border-muted space-y-2">
            <p className="text-foreground font-medium">Fastlearners Limited (“Processor”)</p>
            <p className="text-muted-foreground">and</p>
            <p className="text-foreground font-medium">[School/NGO/Partner] (“Controller”)</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            2. Purpose of Processing
          </h2>
          <p className="text-muted-foreground">Fastlearners processes personal data to:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Create student accounts</li>
            <li>Deliver educational content</li>
            <li>Track academic progress</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            3. Categories of Data Subjects
          </h2>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Students</li>
            <li>Teachers</li>
            <li>Parents/guardians</li>
            <li>Administrators</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            4. Types of Data
          </h2>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Names</li>
            <li>Contact information</li>
            <li>Location</li>
            <li>Class/grade</li>
            <li>Learning analytics</li>
            <li>Login data</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            5. Processor Obligations (Fastlearners)
          </h2>
          <p className="text-muted-foreground">Fastlearners shall:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Process data only on documented instructions</li>
            <li>Maintain confidentiality</li>
            <li>Apply strong technical and organizational security measures</li>
            <li>Assist the controller with data subject requests</li>
            <li>Notify of breaches within 72 hours</li>
            <li>Allow audits or inspections</li>
            <li>Delete or return data at end of contract</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            6. Sub-processors
          </h2>
          <p className="text-muted-foreground">Fastlearners may use:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Cloud hosting</li>
            <li>Analytics services</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            All sub-processors are bound by GDPR/NDPR-compliant agreements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            7. International Transfers
          </h2>
          <p className="text-muted-foreground">Permitted only with:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>NDPR-approved safeguards</li>
            <li>GDPR Standard Contractual Clauses</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            8. Termination
          </h2>
          <p className="text-muted-foreground">Upon termination:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>All personal data must be deleted or returned</li>
            <li>Backups purged securely within 90 days</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            9. Governing Law
          </h2>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>NDPR (Nigeria)</li>
            <li>GDPR (European Union)</li>
            <li>Applicable national law of the controller</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
