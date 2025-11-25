import React from "react";

export const metadata = {
  title: "Cookie Policy - Fastlearners",
  description: "Learn about how Fastlearners uses cookies and similar tracking technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Cookie Policy
          </h1>
          <div className="flex flex-col space-y-1 text-muted-foreground">
            <p>Effective Date: 29/11/2025</p>
            <p>Controller: Fastlearners Limited</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            1. Introduction
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Fastlearners Limited (“Fastlearners”, “we”, “our”) uses cookies and similar tracking technologies on the Fastlearners App and website to improve functionality, analyze performance, and enhance user experience.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This Cookie Policy explains what cookies are, why we use them, and how users can control them.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            2. What Are Cookies?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Cookies are small text files stored on your device when you access our app or website. They help us remember your preferences and understand how you use our services.
          </p>
          <div className="space-y-2">
            <p className="text-muted-foreground font-medium">We also use:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Local storage</li>
              <li>Session storage</li>
              <li>SDK/device identifiers (only for app functionality)</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            3. Types of Cookies We Use
          </h2>
          
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-foreground">a. Strictly Necessary Cookies</h3>
            <p className="text-muted-foreground">Required for the app to function.</p>
            <div className="pl-4 border-l-2 border-muted">
              <p className="text-sm font-medium text-foreground mb-2">Examples:</p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-sm">
                <li>User authentication cookies</li>
                <li>Security and fraud-prevention cookies</li>
                <li>Session management</li>
              </ul>
            </div>
            <p className="text-sm font-medium text-red-500 flex items-center gap-2">
              <span>🛑</span> Cannot be disabled.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">b. Functional Cookies</h3>
            <p className="text-muted-foreground">Improve app usability.</p>
            <div className="pl-4 border-l-2 border-muted">
              <p className="text-sm font-medium text-foreground mb-2">Examples:</p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-sm">
                <li>Saving login state</li>
                <li>Storing preferences (theme, language, class level)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">c. Analytics Cookies</h3>
            <p className="text-muted-foreground">Used to understand how users interact with the app.</p>
            <div className="pl-4 border-l-2 border-muted">
              <p className="text-sm font-medium text-foreground mb-2">Examples:</p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-sm">
                <li>Google Analytics (if used)</li>
                <li>App crash/usage analytics</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground italic">We anonymize IP addresses where possible.</p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">d. Performance Cookies</h3>
            <p className="text-muted-foreground">Help optimize speed, loading, and responsiveness.</p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xl font-medium text-foreground">e. Third-Party Cookies</h3>
            <p className="text-muted-foreground">These may come from:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Hosting providers</li>
              <li>Analytics services</li>
              <li>Payment gateways (if added later)</li>
            </ul>
            <p className="text-sm text-muted-foreground">All third parties comply with GDPR/NDPR via Data Processing Agreements.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            4. Why We Use Cookies
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>To keep you signed in</li>
            <li>To personalize educational content</li>
            <li>To analyze app performance</li>
            <li>To protect user accounts and detect fraud</li>
            <li>To improve our services</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            5. Legal Basis for Using Cookies
          </h2>
          <p className="text-muted-foreground">Under NDPR & GDPR, our legal bases include:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><span className="font-medium text-foreground">Legitimate interest</span> (security, functionality)</li>
            <li><span className="font-medium text-foreground">Consent</span> (for optional cookies such as analytics)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            6. How to Manage or Disable Cookies
          </h2>
          <p className="text-muted-foreground">Users can:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Disable cookies through device/app settings</li>
            <li>Disable analytics in the app privacy settings (if available)</li>
            <li>Clear stored cookies from browser or device cache</li>
          </ul>
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Note:</span> Disabling essential cookies may limit app functionality.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            7. Changes to This Policy
          </h2>
          <p className="text-muted-foreground">
            We may update this Cookie Policy occasionally. Users will be notified when significant changes occur.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            8. Contact
          </h2>
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <p className="font-medium text-foreground mb-2">Fastlearners Limited</p>
            <div className="space-y-1 text-muted-foreground">
              <p>Email: <a href="mailto:info@fastlearnersapp.com" className="text-primary hover:underline">info@fastlearnersapp.com</a></p>
              <p>Address: 3 Chief Aaron Nteubong Street Easter Obolo, Akwa Ibom State.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
