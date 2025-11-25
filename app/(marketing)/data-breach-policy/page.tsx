import React from "react";

export const metadata = {
  title: "Data Breach Response Policy - Fastlearners",
  description: "Learn about Fastlearners' procedures for handling data breaches.",
};

export default function DataBreachPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Data Breach Response Policy
          </h1>
          <div className="flex flex-col space-y-1 text-muted-foreground">
            <p>Effective Date: 29/11/2025</p>
            <p>Controller: Fastlearners Limited</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            1. Purpose
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            This policy defines the procedures Fastlearners Limited follows if a data breach occurs.
          </p>
          <div className="space-y-2">
            <p className="text-muted-foreground">It ensures compliance with the:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>NDPR (Nigeria)</li>
              <li>GDPR (EU)</li>
              <li>General global security standards</li>
            </ul>
            <p className="text-muted-foreground">The goal is to reduce impact on users, investigate quickly, and prevent future occurrences.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            2. What is a Data Breach?
          </h2>
          <p className="text-muted-foreground">A data breach includes:</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Unauthorized access</li>
            <li>Loss or theft of devices</li>
            <li>Accidental deletion or modification</li>
            <li>External attacks (e.g., hacking, malware)</li>
            <li>Unauthorized data sharing</li>
            <li>Exposure of children’s data</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            3. Responsibilities
          </h2>
          
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-foreground">a. Data Protection Officer (DPO) or Appointed Lead</h3>
            <p className="text-muted-foreground mb-2">Responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Coordinating breach response</li>
              <li>Documenting incidents</li>
              <li>Communicating with regulators and affected users</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">b. Engineering / IT Team</h3>
            <p className="text-muted-foreground mb-2">Responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Containing the breach</li>
              <li>Identifying the cause</li>
              <li>Securing systems</li>
              <li>Applying fixes and patches</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">c. Management</h3>
            <p className="text-muted-foreground mb-2">Responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Authorizing notifications</li>
              <li>Approving corrective actions</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            4. Breach Response Procedure
          </h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4 py-1">
              <h3 className="text-xl font-medium text-foreground">Step 1: Identification</h3>
              <p className="text-muted-foreground mt-2">A breach may be detected through:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-1">
                <li>User reports</li>
                <li>System alerts</li>
                <li>Monitoring tools</li>
                <li>Security audits</li>
              </ul>
              <p className="text-muted-foreground mt-2 font-medium">Staff must report suspected breaches immediately to the DPO.</p>
            </div>

            <div className="border-l-4 border-primary pl-4 py-1">
              <h3 className="text-xl font-medium text-foreground">Step 2: Containment</h3>
              <p className="text-muted-foreground mt-2">Immediately:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-1">
                <li>Disable compromised accounts</li>
                <li>Isolate affected systems</li>
                <li>Revoke exposed tokens or credentials</li>
                <li>Block malicious IPs</li>
                <li>Shut down unauthorized access</li>
              </ul>
            </div>

            <div className="border-l-4 border-primary pl-4 py-1">
              <h3 className="text-xl font-medium text-foreground">Step 3: Assessment (within 24 hours)</h3>
              <p className="text-muted-foreground mt-2">Determine:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-1">
                <li>Type of data involved</li>
                <li>Number of affected users</li>
                <li>Whether children’s data is involved</li>
                <li>Whether data was encrypted</li>
                <li>The risk of harm (identity theft, fraud, privacy risk)</li>
              </ul>
            </div>

            <div className="border-l-4 border-primary pl-4 py-1">
              <h3 className="text-xl font-medium text-foreground">Step 4: Notification</h3>
              <div className="mt-2 space-y-3">
                <div>
                  <h4 className="font-medium text-foreground">Regulators</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>NDPR requires prompt notification to NITDA</li>
                    <li>GDPR requires notification within 72 hours</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Affected Users</h4>
                  <p className="text-muted-foreground">Required when risk is significant.</p>
                  <p className="text-muted-foreground mt-1">Notification must include:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Nature of breach</li>
                    <li>Data involved</li>
                    <li>Possible consequences</li>
                    <li>Steps users should take</li>
                    <li>Measures Fastlearners is taking</li>
                    <li>Contact point for assistance</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-primary pl-4 py-1">
              <h3 className="text-xl font-medium text-foreground">Step 5: Documentation</h3>
              <p className="text-muted-foreground mt-2">Every breach is logged with:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-1">
                <li>Date/time</li>
                <li>Description</li>
                <li>Systems affected</li>
                <li>Individuals affected</li>
                <li>Actions taken</li>
                <li>Lessons learned</li>
              </ul>
              <p className="text-muted-foreground mt-2">NDPR and GDPR require complete incident records.</p>
            </div>

            <div className="border-l-4 border-primary pl-4 py-1">
              <h3 className="text-xl font-medium text-foreground">Step 6: Remediation</h3>
              <p className="text-muted-foreground mt-2">Actions may include:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-1">
                <li>Patching systems</li>
                <li>Resetting passwords</li>
                <li>Updating security policies</li>
                <li>Conducting staff training</li>
                <li>Strengthening infrastructure</li>
                <li>Removing harmful scripts/malware</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            5. Security Measures in Place
          </h2>
          <p className="text-muted-foreground">Fastlearners applies:</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>End-to-end encryption</li>
            <li>Encrypted passwords</li>
            <li>Firewalls and intrusion detection</li>
            <li>Secure cloud infrastructure</li>
            <li>Role-based access controls</li>
            <li>Regular security audits</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            6. Special Handling of Children’s Data Breaches
          </h2>
          <p className="text-muted-foreground">If a child’s data is affected:</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Parents/guardians are notified immediately</li>
            <li>Additional safeguards are applied</li>
            <li>A special rapid-assessment review is conducted</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            7. Review and Updates
          </h2>
          <p className="text-muted-foreground">
            This policy is reviewed annually or after any major breach.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            8. Contact
          </h2>
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <p className="font-medium text-foreground mb-2">Fastlearners Limited</p>
            <div className="space-y-1 text-muted-foreground">
              <p>Email: <a href="mailto:cyril.james@fastlearnersapp.com" className="text-primary hover:underline">cyril.james@fastlearnersapp.com</a></p>
              <p>Address: Fastlearners Limited Head Office</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
