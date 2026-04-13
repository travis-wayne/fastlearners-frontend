import React from "react";

export const metadata = {
  title: "Cookie Policy - Fastlearners",
  description: "Learn about how Fastlearners uses cookies and similar tracking technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:py-16 md:py-20 lg:py-24">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Cookie Policy
          </h1>
          <div className="flex flex-col space-y-1 text-muted-foreground">
            <p>FastLearners App</p>
            <p>Effective Date: 10 April 2026</p>
            <p>Data Controller: FastLearners Limited</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            1. Introduction
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            FastLearners Limited (“FastLearners”, “we”, “us”, or “our”) uses cookies and similar tracking technologies (such as local storage, session storage, and device identifiers) on our website and mobile application to ensure the Platform functions properly, improve user experience, analyse performance, and provide personalised learning features.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            This Cookie Policy explains what cookies and similar technologies we use, why we use them, and how you can manage or control them. It should be read together with our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            We are committed to complying with the <span className="font-medium text-foreground">Nigeria Data Protection Act 2023 (NDPA)</span> and relevant guidelines from the Nigeria Data Protection Commission (NDPC).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            2. What Are Cookies and Similar Technologies?
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit our website or use our app. They help us remember your preferences and understand how you interact with the Platform.
          </p>
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground">We also use other similar technologies, including:</p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Local storage and session storage</li>
              <li>SDKs and device identifiers (primarily for app functionality and security)</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            3. Types of Cookies and Technologies We Use
          </h2>

          <div className="space-y-3">
            <h3 className="text-xl font-medium text-foreground">a. Strictly Necessary Cookies</h3>
            <p className="text-muted-foreground">These cookies are essential for the Platform to function correctly and cannot be disabled.</p>
            <div className="border-l-4 border-primary py-1 pl-4">
              <p className="mb-2 font-medium text-foreground">Examples include:</p>
              <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
                <li>Authentication and login cookies</li>
                <li>Security and fraud-prevention cookies</li>
                <li>Session management cookies</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">b. Functional Cookies</h3>
            <p className="text-muted-foreground">These improve usability and allow the Platform to remember your choices.</p>
            <div className="border-l-4 border-primary py-1 pl-4">
              <p className="mb-2 font-medium text-foreground">Examples include:</p>
              <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
                <li>Saving your login state across sessions</li>
                <li>Remembering preferences (e.g., language, theme, or class level)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">c. Analytics and Performance Cookies</h3>
            <p className="text-muted-foreground">These help us understand how users interact with the Platform, measure performance, and improve our services.</p>
            <div className="border-l-4 border-primary py-1 pl-4">
              <p className="mb-2 font-medium text-foreground">Examples include:</p>
              <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
                <li>Usage and engagement analytics</li>
                <li>Crash reports and performance metrics</li>
                <li>IP addresses (anonymised where possible)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">d. Third-Party Cookies</h3>
            <p className="leading-relaxed text-muted-foreground">
              Some cookies may be set by third-party service providers (e.g., cloud hosting providers, analytics tools, or future payment gateways).
            </p>
            <p className="leading-relaxed text-muted-foreground">
              We ensure that all third parties we work with are bound by appropriate data protection agreements and comply with the NDPA.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            4. Purposes of Using Cookies
          </h2>
          <p className="text-muted-foreground">We use cookies and similar technologies to:</p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Keep you signed in securely</li>
            <li>Provide a smooth and personalised learning experience</li>
            <li>Analyse Platform performance and user behaviour</li>
            <li>Detect and prevent fraud or security threats</li>
            <li>Improve the overall quality and speed of our services</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            5. Legal Basis for Using Cookies
          </h2>
          <p className="text-muted-foreground">Under the <span className="font-medium text-foreground">Nigeria Data Protection Act 2023 (NDPA)</span>, we rely on the following lawful bases:</p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li><span className="font-medium text-foreground">Legitimate interests</span> — for strictly necessary, functional, security, and performance cookies.</li>
            <li><span className="font-medium text-foreground">Consent</span> — for non-essential cookies, particularly analytics and tracking cookies.</li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            You can withdraw your consent for optional cookies at any time (see Section 6 below).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            6. How to Manage or Disable Cookies
          </h2>
          <p className="text-muted-foreground">You have control over cookies and can manage them in the following ways:</p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Through your browser or device settings (most browsers allow you to block or delete cookies).</li>
            <li>Via in-app privacy/settings options (where available).</li>
            <li>By clearing your browser cache or app data.</li>
          </ul>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Important Note:</span> Disabling strictly necessary cookies may prevent the Platform from functioning properly or limit your ability to use certain features.
            </p>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            We may also provide a cookie consent banner or preference centre on the website to allow you to accept or reject categories of cookies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            7. Changes to This Cookie Policy
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. Any material changes will be notified by updating the effective date and, where appropriate, through a prominent notice on the Platform. Your continued use of the Platform after such changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            8. Contact and Data Protection Officer
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            If you have any questions about this Cookie Policy or our use of cookies, please contact us:
          </p>
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="mb-2 text-lg font-medium text-foreground">Data Protection Officer (DPO): Oladele Joshua O.</p>
            <div className="space-y-1 text-muted-foreground">
              <p>DPO Email: <a href="mailto:joshua.oladele@fastlearnersapp.com" className="font-medium text-primary hover:underline">joshua.oladele@fastlearnersapp.com</a></p>
              <p className="mt-4 font-semibold text-foreground">Company: FastLearners Limited</p>
              <p>Support Email: <a href="mailto:support@fastlearnersapp.com" className="text-primary hover:underline">support@fastlearnersapp.com</a></p>
              <p>Telephone: +234 706 544 7436</p>
              <p>Address: 3 Chief Aaron Nteubong Street, Okorombokho, Eastern Obolo, Akwa Ibom State, Nigeria</p>
            </div>
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            You may also contact the Nigeria Data Protection Commission (NDPC) if needed.
          </p>
        </section>
      </div>
    </div>
  );
}
