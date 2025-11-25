"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20">
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Get in{" "}
            <span className="text-gradient_indigo-purple font-extrabold">
              Touch
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
            Have questions or need support? We're here to help! Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject <span className="text-destructive">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing & Subscriptions</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="school">School Licensing</option>
                  <option value="feedback">Feedback & Suggestions</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {submitStatus === "success" && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-green-600 dark:text-green-400">
                  <p className="font-medium">Message sent successfully!</p>
                  <p className="text-sm">We'll get back to you within 24 hours.</p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
                  <p className="font-medium">Something went wrong!</p>
                  <p className="text-sm">Please try again or contact us directly via email.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Contact Information
              </h2>
              <p className="text-muted-foreground">
                You can also reach us directly through these channels.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="group rounded-xl border-2 border-primary/20 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-foreground">Email</h3>
                    <a href="mailto:info@fastlearnersapp.com" className="text-primary hover:underline">
                      info@fastlearnersapp.com
                    </a>
                    <p className="mt-1 text-sm text-muted-foreground">
                      For general inquiries and support
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="group rounded-xl border-2 border-primary/20 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-foreground">Phone</h3>
                    <a href="tel:+2347065447436" className="text-primary hover:underline">
                      +234 706 544 7436
                    </a>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Monday - Friday, 9:00 AM - 5:00 PM WAT
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="group rounded-xl border-2 border-primary/20 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-foreground">Office Address</h3>
                    <p className="text-muted-foreground">
                      3 Chief Aaron Nteubong Street<br />
                      Okorombokho, Eastern Obolo<br />
                      Akwa Ibom State, Nigeria
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Channels */}
            <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
              <h3 className="mb-4 text-xl font-semibold text-foreground">Other Support Channels</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available on the platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Help Center</p>
                    <p className="text-sm text-muted-foreground">Browse FAQs and guides</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Support Tickets</p>
                    <p className="text-sm text-muted-foreground">Submit and track requests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <section className="rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-12">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              Looking for Something Specific?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Explore these resources for quick answers
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/features"
                className="rounded-lg border-2 border-primary/20 bg-card px-6 py-3 font-medium text-foreground shadow-sm transition-all hover:shadow-md hover:border-primary"
              >
                View Features
              </a>
              <a
                href="/pricing"
                className="rounded-lg border-2 border-primary/20 bg-card px-6 py-3 font-medium text-foreground shadow-sm transition-all hover:shadow-md hover:border-primary"
              >
                Pricing Plans
              </a>
              <a
                href="/about"
                className="rounded-lg border-2 border-primary/20 bg-card px-6 py-3 font-medium text-foreground shadow-sm transition-all hover:shadow-md hover:border-primary"
              >
                About Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
