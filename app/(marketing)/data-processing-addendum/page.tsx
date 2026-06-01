import React from "react";

export const metadata = {
  title: "Data Processing Addendum - Fastlearners",
  description:
    "Data Processing Addendum for Schools, NGOs, Educational Partners and Institutions.",
};

export default function DataProcessingAddendumPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:py-16 md:py-20 lg:py-24">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Data Processing Addendum (DPA)
          </h1>
          <div className="flex flex-col space-y-1 text-muted-foreground">
            <p>For Schools, NGOs, Educational Partners and Institutions</p>
            <p>Effective Date: 10 April 2026</p>
            <p>
              3 Chief Aaron Nteubong Street, Okorombokho, Eastern Obolo, Akwa
              Ibom State, Nigeria
            </p>
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            This Data Processing Addendum (“DPA”) forms part of the main
            agreement between the parties and governs the processing of personal
            data by FastLearners Limited on behalf of the Controller. It is
            entered into between:
          </p>
          <div className="space-y-2 border-l-2 border-primary py-1 pl-6">
            <p className="font-bold text-foreground">FastLearners Limited</p>
            <p className="text-muted-foreground">
              {" "}
              (“Processor” or “FastLearners”)
            </p>
            <p className="text-sm text-muted-foreground">
              Address: 3 Chief Aaron Nteubong Street, Okorombokho, Eastern
              Obolo, Akwa Ibom State, Nigeria
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            1. Purpose and Scope
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            This DPA sets out the rights and obligations of the Parties with
            respect to the processing of personal data in connection with the
            provision of digital learning tools, online educational content,
            student progress tracking, and related services by FastLearners to
            the Controller.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            The Processor will process personal data solely on behalf of the
            Controller and in accordance with the terms of this DPA and the main
            service agreement. This DPA ensures compliance with the{" "}
            <span className="font-medium text-foreground">
              Nigeria Data Protection Act 2023 (NDPA)
            </span>
            , the{" "}
            <span className="font-medium text-foreground">
              General Application and Implementation Directive (GAID) 2025
            </span>
            , and other applicable data protection laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            2. Categories of Data Subjects
          </h2>
          <p className="text-muted-foreground">
            The personal data processed under this DPA relates to the following
            categories of data subjects:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Students (including minors under 18 years of age)</li>
            <li>Teachers and educators</li>
            <li>Parents or legal guardians</li>
            <li>
              School administrators and other authorised staff of the Controller
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            3. Types of Personal Data
          </h2>
          <p className="text-muted-foreground">
            The Processor may process the following categories of personal data
            as instructed by the Controller:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Identification data (full names, usernames)</li>
            <li>Contact information (email addresses, phone numbers)</li>
            <li>
              Educational data (class/grade level, subjects, academic
              performance, quiz/test results, progress analytics, and learning
              activity logs)
            </li>
            <li>
              Login and usage data (IP addresses, device information,
              timestamps, and session data)
            </li>
            <li>
              Any other personal data that the Controller uploads or instructs
              the Processor to process in connection with the services
            </li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The Processor does not process sensitive personal data (such as
            health, biometric, or religious data) unless explicitly instructed
            in writing by the Controller and in full compliance with NDPA
            requirements for special categories of data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            4. Nature, Purpose, and Duration of Processing
          </h2>
          <p className="text-sm font-medium text-muted-foreground">
            The Processor will process the personal data only for the following
            documented purposes:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>
              Creating and managing student and staff accounts on the
              FastLearners Platform
            </li>
            <li>
              Delivering personalised educational content and digital learning
              experiences
            </li>
            <li>
              Tracking and analysing academic progress and learning outcomes
            </li>
            <li>
              Generating reports and analytics for the Controller (e.g., class
              performance dashboards)
            </li>
            <li>
              Providing technical support and maintaining the functionality of
              the Platform
            </li>
            <li>
              Complying with legal obligations or as otherwise instructed in
              writing by the Controller
            </li>
          </ul>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Processing shall continue for the duration of the main service
            agreement between the Parties, unless otherwise terminated earlier
            in accordance with this DPA or the main agreement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            5. Processor Obligations
          </h2>
          <p className="text-muted-foreground">
            FastLearners, as the Processor, agrees to:
          </p>
          <div className="space-y-4 leading-relaxed text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">a.</span> Process
              personal data only on documented instructions from the Controller,
              including with regard to international transfers. If the Processor
              is required by law to process data without such instructions, it
              will inform the Controller of that legal requirement before
              processing, unless prohibited by law.
            </p>
            <p>
              <span className="font-semibold text-foreground">b.</span> Ensure
              that all persons authorised to process the personal data are bound
              by confidentiality obligations and have received appropriate
              training on data protection.
            </p>
            <p>
              <span className="font-semibold text-foreground">c.</span>{" "}
              Implement and maintain appropriate technical and organisational
              security measures to protect the personal data against accidental
              or unlawful destruction, loss, alteration, unauthorised
              disclosure, or access. These measures shall take into account the
              state of the art, the costs of implementation, the nature, scope,
              context and purposes of processing, and the risk of varying
              likelihood and severity to the rights and freedoms of natural
              persons.
            </p>
            <p>
              <span className="font-semibold text-foreground">d.</span> Assist
              the Controller in fulfilling its obligations under the NDPA,
              including responding to data subject requests (access,
              rectification, erasure, restriction, portability, or objection),
              conducting Data Protection Impact Assessments (DPIA), and ensuring
              compliance with children’s data protection requirements.
            </p>
            <p>
              <span className="font-semibold text-foreground">e.</span> Notify
              the Controller without undue delay (and in any event within{" "}
              <span className="font-bold text-foreground">48 hours</span>) upon
              becoming aware of any personal data breach involving the
              Controller’s data. The notification shall include all relevant
              details required under the NDPA to enable the Controller to notify
              the NDPC and affected data subjects where necessary.
            </p>
            <p>
              <span className="font-semibold text-foreground">f.</span> Make
              available to the Controller all information necessary to
              demonstrate compliance with its obligations as a Processor and
              allow for audits or inspections (including on-site inspections
              where reasonably required) by the Controller or its appointed
              auditor. The Processor shall contribute to such audits at the
              Controller’s reasonable request.
            </p>
            <p>
              <span className="font-semibold text-foreground">g.</span> At the
              choice of the Controller, delete or return all personal data to
              the Controller upon termination or expiry of the services and
              delete existing copies unless applicable law requires storage of
              the personal data. Any remaining backups shall be securely purged
              within 90 days.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            6. Sub-processors
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            The Processor may engage sub-processors (such as cloud hosting
            providers, analytics services, or payment processors) to carry out
            specific processing activities.
          </p>
          <div className="space-y-2 text-muted-foreground">
            <p>The Processor shall:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Maintain an up-to-date list of sub-processors and make it
                available to the Controller upon request.
              </li>
              <li>
                Ensure that each sub-processor is bound by a written agreement
                that imposes the same data protection obligations as set out in
                this DPA.
              </li>
              <li>
                Remain fully liable to the Controller for the performance of
                each sub-processor’s obligations.
              </li>
            </ul>
          </div>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            The Controller may object to the appointment or replacement of any
            sub-processor within 14 days of being notified. If the Controller
            objects, the Parties shall discuss in good faith to find a mutually
            acceptable solution.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            7. International Data Transfers
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            The Processor may transfer personal data outside Nigeria only where
            appropriate safeguards are in place in accordance with the NDPA and
            GAID 2025. Such safeguards may include:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>
              Standard Contractual Clauses (SCCs) approved by the NDPC or
              equivalent mechanisms
            </li>
            <li>Binding Corporate Rules (where applicable)</li>
            <li>Adequacy decisions issued by the NDPC</li>
            <li>Other appropriate safeguards approved by the NDPC</li>
          </ul>
          <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
            The Processor shall inform the Controller of any intended
            international transfers and provide details of the safeguards in
            place.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            8. Liability and Indemnity
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Each Party shall be liable for any damage caused by a breach of this
            DPA. The Processor shall indemnify the Controller against any direct
            losses, claims, or regulatory fines arising from the Processor’s
            failure to comply with its obligations under this DPA, to the extent
            such failure is attributable to the Processor.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            9. Termination and Governing Law
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            This DPA shall terminate automatically upon termination or expiry of
            the main service agreement. Upon termination, the Processor’s
            obligations under Section 5(g) regarding deletion or return of data
            shall apply.
          </p>
          <p className="border-t border-border/50 pt-4 leading-relaxed text-muted-foreground">
            This DPA shall be governed by and construed in accordance with the
            laws of the Federal Republic of Nigeria. Any disputes arising out of
            or in connection with this DPA shall be subject to the exclusive
            jurisdiction of the competent courts in Nigeria.
          </p>
          <p className="mt-2 font-medium italic leading-relaxed text-foreground">
            The Parties acknowledge that this DPA supplements and does not
            replace any obligations under the NDPA or other applicable laws.
          </p>
        </section>

        <section className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            10. Contact and Data Protection Officer
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
              <p className="mt-4 text-base font-semibold text-foreground">
                Company: FastLearners Limited
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
              <p>
                Address: 3 Chief Aaron Nteubong Street, Okorombokho, Eastern
                Obolo, Akwa Ibom State, Nigeria
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
