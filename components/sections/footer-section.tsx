"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Facebook, Linkedin, Mail, MapPin, Phone, X } from "lucide-react";
import { Instagram } from "lucide-react";

const socialLinks = [
  { name: "Facebook", icon: <Facebook className="w-4 h-4" />, href: "#" },
  { name: "X", icon: <X className="w-4 h-4" />, href: "#" },
  { name: "Instagram", icon: <Instagram className="w-4 h-4" />, href: "#" },
  { name: "LinkedIn", icon: <Linkedin className="w-4 h-4" />, href: "#" },
];

const quickLinks = [
  { title: "About Us", href: "/about" },
  { title: "Features", href: "/#why" },
  { title: "Pricing", href: "/pricing" },
  { title: "Success Stories", href: "/success-stories" },
];

const supportLinks = [
  { title: "Help Center", href: "/help" },
  { title: "Contact Us", href: "/contact" },
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms of Service", href: "/terms" },
];

const contactInfo = [
  { icon: <Mail className="w-4 h-4" /> as React.ReactNode, text: "info@fastlearners.ng", href: "mailto:info@fastlearners.ng" },
  { icon: <Phone className="w-4 h-4" /> as React.ReactNode, text: "+234 800 123 4567", href: "tel:+2348001234567" },
  { icon: <MapPin className="w-4 h-4" /> as React.ReactNode, text: "Lagos, Nigeria", href: "#" },
];

export default function FooterSection() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <MaxWidthWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Column 1: Fastlearners */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h3 className="text-2xl font-bold text-blue-400 mb-4">Fastlearners</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Nigeria's leading digital learning platform for secondary school students.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-600/30 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <span className="text-sm font-bold">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-lg">{contact.icon}</span>
                  {contact.href.startsWith("http") || contact.href.startsWith("mailto") || contact.href.startsWith("tel") ? (
                    <a
                      href={contact.href}
                      className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {contact.text}
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">{contact.text}</span>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-slate-800 py-6 text-center"
        >
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Fastlearners App. All rights reserved.
          </p>
        </motion.div>
      </MaxWidthWrapper>
    </footer>
  );
}

