import React from "react";

export const metadata = {
  title: "Privacy Policy - Fastlearners",
  description: "Read our Privacy Policy to understand how we collect, use, and protect your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:py-16 md:py-20 lg:py-24">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Privacy Policy
          </h1>
          <div className="flex flex-col space-y-1 text-muted-foreground">
            <p>FastLearners App</p>
            <p>Effective Date: 10 April 2026</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            1. Introduction
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Fastlearners Limited (“Fastlearners”, “we”, “our”, or “us”) provides digital learning tools and educational services to students, parents/guardians, teachers, and institutions across Nigeria, Ghana, Sierra Leone, Gambia, and Liberia.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            This Privacy Policy explains how we collect, use, store, and protect personal data in compliance with the <span className="font-medium text-foreground">Nigeria Data Protection Act 2023 (NDPA)</span> and is overseen by the <span className="font-medium text-foreground">Nigeria Data Protection Commission (NDPC)</span>.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            We encourage parents and guardians of children under the age of 18 to review our Children&apos;s Data Protection Policy to understand how we safeguard the privacy of our younger users.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            2. Information We Collect
          </h2>
          <p className="text-muted-foreground">We may collect the following categories of personal data:</p>

          <div className="space-y-3">
            <h3 className="text-xl font-medium text-foreground">a. User Account Information</h3>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Full Name</li>
              <li>Username</li>
              <li>Email Address</li>
              <li>Phone Number (optional)</li>
              <li>Password (encrypted)</li>
              <li>Gender</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">b. Educational Profile</h3>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Class/Grade level</li>
              <li>School name</li>
              <li>Subjects and performance analytics</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">c. Usage and Technical Data</h3>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>App interactions and performance metrics</li>
              <li>Device information, browser type</li>
              <li>Log files (IP address, timestamps)</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">d. Payment Information</h3>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Transaction reference as proof of payment</li>
              <li>Billing details (processed by third-party providers)</li>
              <li>We do NOT store card information.</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">e. Children&apos;s Data</h3>
            <p className="text-muted-foreground">
              As an educational platform, we collect limited personal data from children under 18 for the purpose of personalising their learning journey. This is only done with verifiable parental/guardian consent or supervision.
            </p>
          </div>

          <p className="leading-relaxed text-muted-foreground">
            We do not collect sensitive personal data (e.g., biometric data, genetic data, or political opinions) unless strictly necessary for specific features and with your explicit consent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            3. Lawful Bases for Processing Personal Data
          </h2>
          <p className="text-muted-foreground">We process personal data based on the following legal grounds:</p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li><span className="font-medium text-foreground">Performance of a contract</span> — to provide access to the Platform and educational services.</li>
            <li><span className="font-medium text-foreground">Legitimate interests</span> — to improve services, personalise learning, conduct analytics, and ensure security.</li>
            <li><span className="font-medium text-foreground">Consent</span> — where required, especially for children&apos;s data, direct marketing, or optional features.</li>
            <li><span className="font-medium text-foreground">Legal obligation</span> — to comply with applicable laws and regulatory requirements.</li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            For children under the age of 18, we rely on parental or guardian consent in accordance with Section 31 of the NDPA and GAID 2025.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            4. How We Use Personal Data
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>To create and manage user accounts</li>
            <li>To deliver learning content and interactive exercises</li>
            <li>To analyze academic progress and provide feedback</li>
            <li>To personalize user experience and recommendations</li>
            <li>To provide customer support and troubleshooting</li>
            <li>To process payments and generate transaction records</li>
            <li>To detect and prevent fraud, cheating, or misuse of the Platform</li>
            <li>To comply with regulatory obligations</li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            We do not sell, trade, rent, or commercially exploit your personal data for marketing purposes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            5. Children&apos;s Data
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Protecting the privacy of children is our priority. We collect personal data from users under the age of 18 only with the express consent and supervision of a parent or legal guardian.
          </p>
          <p className="text-muted-foreground">Parents or guardians may request to:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Review the data we have collected about their child</li>
            <li>Request corrections to inaccurate data</li>
            <li>Request the deletion of their child&apos;s personal data</li>
            <li>Withdraw consent for future data collection</li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            For more information, please see our dedicated <a href="/childrens-data-protection-policy" className="text-primary hover:underline">Children&apos;s Data Protection Policy</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            6. Data Sharing and Third Parties
          </h2>
          <p className="text-muted-foreground">We may share your data with the following categories of third parties:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Secure hosting and cloud infrastructure providers</li>
            <li>Data analytics and performance monitoring services</li>
            <li>Payment processors for transaction handling</li>
            <li>Educational partners or institutions (where you have authorised sharing)</li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            All third parties are required to sign binding Data Processing Agreements (DPAs) that comply with the <span className="font-medium text-foreground">NDPA</span>. We do not share data with third parties for their own marketing purposes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            7. International Data Transfers
          </h2>
          <p className="text-muted-foreground">To provide our services, your personal data may be stored or processed in countries outside of Nigeria. When transferring data internationally, we ensure adequate protection through:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Standard Contractual Clauses (SCCs)</li>
            <li>Other NDPC-approved mechanisms</li>
            <li>Adequacy decisions (where available)</li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            We only use cloud providers and data centres that meet the security standards approved by the Nigeria Data Protection Commission (NDPC).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            8. Data Retention
          </h2>
          <p className="text-muted-foreground">We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected or as required by law:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li><span className="font-medium text-foreground">Active accounts:</span> retained for the duration of your relationship with us</li>
            <li><span className="font-medium text-foreground">Inactive accounts:</span> archived or deleted after 24 months of inactivity</li>
            <li><span className="font-medium text-foreground">Children&apos;s data:</span> deleted upon reaching adulthood or upon parental request (subject to legal requirements)</li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            You may request deletion of your data at any time (subject to legal retention obligations).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            9. Your Rights as a Data Subject
          </h2>
          <p className="text-muted-foreground">Under the NDPA, you have several rights regarding your personal data:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Right to be informed about how your data is used</li>
            <li>Right of access to your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure (the &quot;right to be forgotten&quot;)</li>
            <li>Right to restrict processing</li>
            <li>Right to object to processing</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent at any time</li>
            <li>Right to lodge a complaint with the NDPC</li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            To exercise any of these rights, please contact us at the details below. We will respond within one (1) month (or as required by law).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            10. Data Security
          </h2>
          <p className="text-muted-foreground">We implement robust technical and organisational measures to protect your data, including:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>End-to-end encryption for sensitive data</li>
            <li>SSL/TLS encryption for all data in transit</li>
            <li>Role-based access controls (RBAC)</li>
            <li>Regular security assessments and audits</li>
            <li>Staff training on data protection</li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            However, no system is completely secure. We encourage you to keep your login credentials confidential and notify us immediately of any suspected unauthorised access.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            11. Data Protection Officer (DPO)
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            We have appointed a Data Protection Officer to oversee our compliance with the NDPA and handle any privacy-related enquiries.
          </p>
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="mb-2 font-medium text-foreground">DPO: Oladele Joshua O.</p>
            <div className="space-y-1 text-muted-foreground">
              <p>Email: <a href="mailto:joshua.oladele@fastlearnersapp.com" className="text-primary hover:underline">joshua.oladele@fastlearnersapp.com</a></p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            12. Contact Us
          </h2>
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="mb-2 font-medium text-foreground">Fastlearners Limited</p>
            <div className="space-y-1 text-muted-foreground">
              <p>Effective Date: 10 April 2026</p>
              <p>General Enquiries: <a href="mailto:info@fastlearnersapp.com" className="text-primary hover:underline">info@fastlearnersapp.com</a></p>
              <p>Privacy Requests: <a href="mailto:support@fastlearnersapp.com" className="text-primary hover:underline">support@fastlearnersapp.com</a></p>
              <p>Telephone: +234 706 544 7436</p>
              <p>Address: 3 Chief Aaron Nteubong Street, Okorombokho, Eastern Obolo, Akwa Ibom State, Nigeria</p>
            </div>
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            You may also contact the Nigeria Data Protection Commission (NDPC) if you are not satisfied with our response.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            13. Changes to This Privacy Policy
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new policy on this page and updating the effective date.
          </p>
        </section>
      </div>
    </div>
  );
}
