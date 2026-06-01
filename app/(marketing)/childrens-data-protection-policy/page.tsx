import React from "react";

export const metadata = {
  title: "Children’s Data Protection Policy - Fastlearners",
  description:
    "Learn how Fastlearners protects children’s personal data in compliance with NDPA 2023.",
};

export default function ChildrensDataProtectionPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:py-16 md:py-20 lg:py-24">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Children’s Data Protection Policy
          </h1>
          <div className="flex flex-col space-y-1 font-medium text-muted-foreground">
            <p>FastLearners App</p>
            <p>Effective Date: 10 April 2026</p>
            <p>Data Controller: FastLearners Limited</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            1. Purpose and Commitment
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            This Children’s Data Protection Policy explains how FastLearners
            Limited (“FastLearners”, “we”, “us”, or “our”) collects, uses,
            protects, and handles the personal data of children under the age of
            18 when they use our digital learning platform.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            We recognise that children are particularly vulnerable and deserve
            heightened protection. We are committed to safeguarding children’s
            privacy in full compliance with the Nigeria Data Protection Act 2023
            (NDPA), especially Section 31 on the processing of personal data of
            a child, the General Application and Implementation Directive (GAID)
            2025, and all applicable guidelines issued by the Nigeria Data
            Protection Commission (NDPC).
          </p>
          <p className="font-medium leading-relaxed text-muted-foreground">
            This policy should be read together with our{" "}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/terms-of-service"
              className="text-primary hover:underline"
            >
              Terms of Service
            </a>
            . Parents, guardians, and schools are strongly encouraged to review
            it carefully before allowing a child to use the Platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            2. Definition of a Child
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            For the purpose of this policy, a “Child” or “Minor” refers to any
            individual under the age of{" "}
            <span className="font-bold text-foreground">18 years</span>.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            FastLearners applies the highest standard of protection across all
            countries where we operate (Nigeria, Ghana, Sierra Leone, Gambia,
            Liberia, and others). Even where local laws set a lower age
            threshold for consent, we treat every user under 18 as a child and
            require verifiable parental or legal guardian consent before
            processing their personal data for non-essential services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            3. Types of Children’s Personal Data We Collect
          </h2>
          <p className="text-muted-foreground">
            When a child uses the FastLearners Platform, we may collect the
            following categories of personal data:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>
              Identification information: full name, username, and date of birth
              or age
            </li>
            <li>
              Educational information: class/grade level, subjects studied, quiz
              and test responses, academic progress, performance analytics, and
              learning activity logs
            </li>
            <li>
              Contact and account information: parent/guardian email address or
              phone number (required for consent and communication)
            </li>
            <li>
              Technical and usage data: login activity, device information, IP
              address (anonymised where possible), and session timestamps
            </li>
            <li>
              Any other data the child inputs or generates while using the
              learning tools (e.g., answers to exercises or uploaded schoolwork)
            </li>
          </ul>
          <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">
            We limit collection to what is necessary for providing educational
            services and do not knowingly collect sensitive personal data (such
            as health, biometric, or religious information) unless explicitly
            required and supported by additional consent or legal basis.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            4. Verifiable Parental Consent
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            We only process a child’s personal data with{" "}
            <span className="font-bold text-foreground">
              verifiable parental or legal guardian consent
            </span>
            . This is a core requirement under the NDPA.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            We use the following methods to obtain and verify parental consent:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Email verification linked to a parent or guardian’s account</li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            Consent is obtained during the child’s initial signup or when a
            parent creates a profile for their child. Parents must actively
            confirm consent — payment alone does not constitute verifiable
            consent. We keep records of when and how consent was obtained.
          </p>
          <p className="italic leading-relaxed text-muted-foreground">
            Parents can withdraw consent at any time. Withdrawal of consent may
            limit or terminate the child’s ability to use certain features of
            the Platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            5. Rights of Parents and Guardians
          </h2>
          <p className="text-muted-foreground">
            Parents and legal guardians have full control over their child’s
            personal data. They may exercise the following rights at any time by
            contacting us:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>
              Request access to the child’s personal data and obtain a copy
            </li>
            <li>Request correction of any inaccurate or incomplete data</li>
            <li>Request deletion (erasure) of the child’s data</li>
            <li>Withdraw consent previously given</li>
            <li>
              Request portability of the child’s data (where technically
              feasible)
            </li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            We will respond to valid parental requests within one (1) month, or
            as otherwise required by the NDPA. In cases involving children’s
            data, we may take additional steps to verify the requester’s
            identity as the parent or guardian before acting on the request.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            6. How We Use Children’s Data
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            We use children’s personal data solely for legitimate educational
            purposes, including:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Creating and managing the child’s learning account</li>
            <li>
              Delivering personalised educational content and adaptive learning
              experiences
            </li>
            <li>
              Tracking academic progress and generating performance insights for
              the child and parent
            </li>
            <li>
              Providing support and answering questions from the child or parent
            </li>
            <li>Improving the overall quality and safety of the Platform</li>
          </ul>
          <p className="border-l-2 border-primary py-1 pl-4 font-medium leading-relaxed text-foreground">
            We do not use children’s data for behavioural advertising, profiling
            for marketing purposes, or any non-educational commercial
            activities.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            7. Data Sharing and Third Parties
          </h2>
          <p className="font-bold leading-relaxed text-muted-foreground">
            Children’s personal data is never shared with third parties without
            explicit parental consent or unless required by law.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Where sharing is necessary (for example, with cloud hosting
            providers, analytics tools used strictly for service improvement, or
            authorised schools), we ensure that such third parties are bound by
            strict data processing agreements that meet or exceed NDPA
            standards. We remain responsible for any processing carried out by
            these third parties on our behalf.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            8. Data Retention for Children’s Data
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            We retain a child’s personal data only for as long as necessary to
            provide the educational services or as required by law.
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>
              Active accounts: data is retained for the duration the child
              actively uses the Platform.
            </li>
            <li>
              Upon withdrawal of consent or a deletion request from a
              parent/guardian, the child’s account and associated data will be
              deleted or anonymised as soon as reasonably practicable.
            </li>
            <li>
              Inactive children’s accounts are generally deleted or anonymised
              after 24 months of inactivity.
            </li>
          </ul>
          <p className="italic leading-relaxed text-muted-foreground">
            We do not retain children’s data longer than necessary, and we apply
            stricter retention periods where appropriate due to the sensitive
            nature of the data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            9. Security Measures for Children’s Data
          </h2>
          <p className="text-muted-foreground">
            We apply enhanced security safeguards to protect children’s personal
            data, including:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>
              Encryption of data both in transit and at rest where technically
              feasible
            </li>
            <li>
              Strict role-based access controls so that only authorised
              personnel can access children’s data
            </li>
            <li>
              Regular security audits, vulnerability assessments, and
              penetration testing
            </li>
            <li>
              Staff training on handling children’s data and recognising risks
            </li>
            <li>
              Background checks (where applicable) for employees with direct
              access to children’s data
            </li>
            <li>
              Monitoring systems to detect and prevent unauthorised access
            </li>
          </ul>
          <p className="mt-4 border-l-2 border-primary py-1 pl-4 leading-relaxed text-muted-foreground">
            In the event of a data breach involving children’s data, we will
            follow our{" "}
            <a
              href="/data-breach-policy"
              className="font-medium text-primary hover:underline"
            >
              Data Breach Response Policy
            </a>{" "}
            with heightened urgency and will notify parents/guardians
            immediately where there is a high risk to the child.
          </p>
        </section>

        <section className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            10. Contact and Complaints
          </h2>
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="mb-2 text-lg font-medium text-foreground">
              Data Protection Officer (DPO): Oladele Joshua O.
            </p>
            <div className="space-y-1 text-muted-foreground">
              <p>
                DPO Email:{" "}
                <a
                  href="mailto:joshua.oladele@fastlearnersapp.com"
                  className="font-medium text-primary hover:underline"
                >
                  joshua.oladele@fastlearnersapp.com
                </a>
              </p>
              <p className="mt-4 font-semibold text-foreground">
                FastLearners Limited
              </p>
              <p>
                Support Email:{" "}
                <a
                  href="mailto:support@fastlearnersapp.com"
                  className="text-primary hover:underline"
                >
                  support@fastlearnersapp.com
                </a>
              </p>
              <p>Telephone: +234 706 544 7436</p>
              <p>
                Address: 3 Chief Aaron Nteubong Street, Okorombokho, Eastern
                Obolo, Akwa Ibom State, Nigeria
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground">
            You also have the right to lodge a complaint with the Nigeria Data
            Protection Commission (NDPC) if you believe we have not handled your
            child’s data appropriately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            11. Changes to This Policy
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            We may update this Children’s Data Protection Policy from time to
            time. We will notify parents of material changes through the
            Platform, email, or other appropriate channels and update the
            effective date. Continued use of the Platform by a child after such
            changes constitutes acceptance of the updated policy.
          </p>
        </section>
      </div>
    </div>
  );
}
