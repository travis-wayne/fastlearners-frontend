import React from "react";

export const metadata = {
  title: "Data Breach Response Policy - Fastlearners",
  description: "Learn about Fastlearners' procedures for handling data breaches in compliance with NDPA 2023.",
};

export default function DataBreachPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:py-16 md:py-20 lg:py-24">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Data Breach Response Policy
          </h1>
          <div className="flex flex-col space-y-1 text-muted-foreground">
            <p>FastLearners App</p>
            <p>Effective Date: 10 April 2026</p>
            <p>Data Controller: FastLearners Limited</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            1. Purpose and Scope
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            This Data Breach Response Policy outlines the procedures that FastLearners Limited (“FastLearners”, “we”, “us”, or “our”) will follow in the event of a personal data breach. The policy ensures a swift, coordinated, and effective response to minimise harm to our users, fulfil our legal obligations, and maintain trust in our online learning platform.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            We are committed to complying with the <span className="font-medium text-foreground">Nigeria Data Protection Act 2023 (NDPA)</span>, the <span className="font-medium text-foreground">General Application and Implementation Directive (GAID) 2025</span>, and all relevant guidelines issued by the <span className="font-medium text-foreground">Nigeria Data Protection Commission (NDPC)</span>. This policy applies to all employees, contractors, and third-party service providers who process personal data on behalf of FastLearners.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            The primary goals are to contain the breach quickly, assess its impact, notify relevant parties as required by law, remediate vulnerabilities, and prevent recurrence. Special attention is given to breaches involving children’s data due to the sensitive nature of our educational services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            2. Definition of a Personal Data Breach
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            A personal data breach means any breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to personal data transmitted, stored, or otherwise processed by us.
          </p>
          <p className="text-muted-foreground">This includes, but is not limited to:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Unauthorised access to our systems by hackers or insiders</li>
            <li>Loss or theft of devices, laptops, or storage media containing user data</li>
            <li>Accidental deletion, modification, or disclosure of personal data</li>
            <li>Malware, ransomware, or other cyber-attacks</li>
            <li>Human error leading to unintended data exposure</li>
            <li>Unauthorised sharing or leakage of data to third parties</li>
            <li>Any incident that exposes students’ educational records, parental information, or children’s personal data</li>
          </ul>
          <p className="italic leading-relaxed text-muted-foreground">
            Even suspected or near-miss incidents must be reported internally for assessment.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            3. Roles and Responsibilities
          </h2>

          <div className="space-y-3">
            <h3 className="text-xl font-medium text-foreground">a. Data Protection Officer (DPO)</h3>
            <p className="leading-relaxed text-muted-foreground">
              The DPO is responsible for overseeing the entire breach response process. This includes coordinating the response team, ensuring proper documentation, liaising with the NDPC and other regulators, approving external communications, and conducting post-incident reviews. The current DPO is <span className="font-medium text-foreground">Oladele Joshua O.</span>, supported operationally by the designated breach response contact.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">b. Engineering and IT Team</h3>
            <p className="leading-relaxed text-muted-foreground">
              This team is responsible for technical containment, forensic investigation (where needed), system recovery, applying security patches, and providing technical details to support assessment and notification.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">c. Senior Management</h3>
            <p className="leading-relaxed text-muted-foreground">
              Management is responsible for authorising major decisions, including notifications to regulators and users, allocating resources for remediation, and ensuring the organisation learns from the incident.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">d. All Staff</h3>
            <p className="leading-relaxed text-muted-foreground">
              Every employee and contractor has a duty to report any suspected or actual data breach immediately to the DPO or through the designated internal channel. Failure to report promptly may result in disciplinary action.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            4. Breach Response Procedure
          </h2>
          <p className="italic text-muted-foreground">
            Our response follows a structured six-step process designed for speed and accountability.
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-primary py-1 pl-4">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">Step 1: Identification and Reporting</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                A breach may be identified through user reports, system monitoring alerts, security tools, routine audits, or third-party notifications. All staff must report any suspected breach to the DPO <span className="font-medium text-foreground">immediately</span> (within one hour where possible). The initial report should include as much known information as possible, such as the time of discovery, description of the incident, and any affected systems or data.
              </p>
            </div>

            <div className="border-l-4 border-primary py-1 pl-4">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">Step 2: Containment</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Upon confirmation or strong suspicion of a breach, the IT team will take immediate steps to contain it. Actions may include isolating affected systems, disabling compromised accounts, revoking access tokens, blocking malicious IP addresses, changing passwords, or temporarily shutting down vulnerable services. The aim is to stop further unauthorised access or data loss as quickly as possible.
              </p>
            </div>

            <div className="border-l-4 border-primary py-1 pl-4">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">Step 3: Assessment (Target: Within 24 Hours)</h3>
              <p className="mt-2 text-muted-foreground">The response team will assess the breach in detail. Key factors to determine include:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
                <li>The nature and categories of personal data involved (e.g., names, emails, academic records, payment references, or children’s data)</li>
                <li>The approximate number of affected data subjects</li>
                <li>Whether the data was encrypted or otherwise protected</li>
                <li>The likely consequences and risk level to individuals (low, medium, or high risk to rights and freedoms)</li>
                <li>Whether the breach involves children’s data, which automatically elevates the risk level</li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground">This assessment informs notification obligations and remediation priorities.</p>
            </div>

            <div className="border-l-4 border-primary py-1 pl-4">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">Step 4: Notification</h3>
              <p className="mt-2 font-medium text-muted-foreground">Notification requirements are strictly time-bound under the NDPA:</p>
              <div className="mt-3 space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">To the NDPC:</h4>
                  <p className="leading-relaxed text-muted-foreground">
                    We will notify the Nigeria Data Protection Commission within <span className="font-semibold text-foreground">72 hours</span> of becoming aware of a breach that is likely to result in a risk to the rights and freedoms of data subjects. The notification will include a description of the breach, categories and approximate numbers of affected individuals and records, likely consequences, and measures taken or proposed to address it. If full details are not available within 72 hours, we will provide them in phases without further delay.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">To Affected Data Subjects:</h4>
                  <p className="leading-relaxed text-muted-foreground">
                    If the breach is likely to result in a <span className="font-semibold text-foreground">high risk</span> to individuals, we will communicate the breach to affected users <span className="font-semibold text-foreground">immediately</span> in clear and plain language. The communication will explain the nature of the breach, possible consequences, recommended protective steps the user can take, measures we are taking, and contact details for further assistance. For high-risk breaches involving children’s data, parents or legal guardians will be notified as a priority.
                  </p>
                </div>
                <p className="text-sm italic text-muted-foreground">
                  Where direct notification would involve disproportionate effort, we may use public announcements through widely used media channels.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-primary py-1 pl-4">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">Step 5: Documentation</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Every incident, regardless of scale, will be fully documented. Records will include the date and time of discovery, description of the breach, systems and data affected, actions taken at each stage, decisions made, lessons learned, and evidence of notifications. These records support accountability, future audits, and NDPC enquiries.
              </p>
            </div>

            <div className="border-l-4 border-primary py-1 pl-4">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">Step 6: Remediation and Recovery</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                After containment and notification, we will focus on full recovery and strengthening our defences. This may involve patching vulnerabilities, resetting affected credentials, enhancing encryption or access controls, conducting additional staff training, updating policies, or engaging external security experts. We will also review and test the effectiveness of new measures.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            5. Special Handling for Children’s Data Breaches
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Breaches involving personal data of children <span className="font-medium text-foreground">under 18 years of age</span> receive heightened priority. In such cases:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Parents or legal guardians will be notified <span className="font-medium text-foreground">immediately</span> upon confirmation of high risk.</li>
            <li>A rapid senior-level review will be conducted.</li>
            <li>Additional support, such as guidance on protecting the child from potential harm (e.g., identity-related risks), will be provided.</li>
            <li>We will consider the heightened vulnerability of minors and the educational context when assessing risk and determining remediation steps.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            6. Preventive Security Measures
          </h2>
          <p className="text-muted-foreground">
            To reduce the likelihood and impact of breaches, we maintain robust technical and organisational safeguards, including:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Encryption of data in transit and at rest where feasible</li>
            <li>Hashed and salted passwords</li>
            <li>Firewalls, intrusion detection systems, and secure cloud infrastructure</li>
            <li>Role-based access controls and the principle of least privilege</li>
            <li>Regular security audits, vulnerability scanning, and penetration testing</li>
            <li>Staff training on data protection and security awareness</li>
          </ul>
          <p className="italic leading-relaxed text-muted-foreground">
            These measures are reviewed regularly and improved based on emerging threats.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            7. Policy Review and Training
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            This policy will be reviewed at least annually, or immediately following any significant breach or changes in law. All staff receive training on this policy and general data protection obligations at least once every six months, or more frequently as needed.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            8. Contact Information
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            For any questions regarding this policy or to report a suspected breach, please contact:
          </p>
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="mb-2 text-lg font-semibold text-foreground">Data Protection Officer: Oladele Joshua O.</p>
            <div className="space-y-1 text-muted-foreground">
              <p>DPO Email: <a href="mailto:joshua.oladele@fastlearnersapp.com" className="font-medium text-primary hover:underline">joshua.oladele@fastlearnersapp.com</a></p>
              <p className="mt-4 text-base font-semibold text-foreground">FastLearners Limited</p>
              <p>Support Email: <a href="mailto:support@fastlearnersapp.com" className="text-primary hover:underline">support@fastlearnersapp.com</a></p>
              <p>Telephone: +234 706 544 7436</p>
              <p>Address: 3 Chief Aaron Nteubong Street, Okorombokho, Eastern Obolo, Akwa Ibom State, Nigeria</p>
            </div>
          </div>
          <p className="mt-4 italic leading-relaxed text-muted-foreground">
            Users may also contact the Nigeria Data Protection Commission (NDPC) directly if they have concerns about our handling of a breach.
          </p>
        </section>
      </div>
    </div>
  );
}
