import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HeaderSection } from "../shared/header-section";

const pricingFaqData = [
  {
    id: "item-1",
    question: "What subscription plans does Fastlearners offer?",
    answer:
      "Fastlearners offers flexible plans for individuals and institutions: Free Trial for first-time users, Student & Guardian subscriptions with add-on packs, Teacher plans with class management tools, and School/District licensing with admin controls and comprehensive reporting. Each plan is designed to fit different budgets and learning objectives.",
  },
  {
    id: "item-2",
    question: "Is there a free trial available?",
    answer:
      "Yes! We offer a free trial for first-time users to explore the platform. You can access sample lessons, take quizzes, and experience the core features before committing to a paid subscription. No credit card required for the trial.",
  },
  {
    id: "item-3",
    question: "What curriculum does Fastlearners cover?",
    answer:
      "Fastlearners covers the complete Nigerian Secondary School Curriculum from JSS1 to SS3. All subjects and topics are fully aligned with the Federal Ministry of Education syllabus and mapped to WAEC, NECO, and JAMB exam standards.",
  },
  {
    id: "item-4",
    question: "Can I access past examination questions?",
    answer:
      "Absolutely! Our platform provides a comprehensive library of past questions from WAEC, NECO, and JAMB, organized by subject and year. Each question comes with detailed solutions and explanations to help you understand the exam patterns and improve your performance.",
  },
  {
    id: "item-5",
    question: "How does the Guardian Dashboard work?",
    answer:
      "The Guardian Dashboard gives parents and guardians real-time visibility into their child's learning progress. You can view performance reports, lesson attendance, quiz scores, subject engagement, strengths and weaknesses, and receive alerts on important updates and achievements.",
  },
  {
    id: "item-6",
    question: "Can teachers use Fastlearners for their classes?",
    answer:
      "Yes! Teachers can assign lessons to students, monitor class performance in real-time, identify students who need extra help, access curriculum-ready lesson notes, and get powerful analytics on student progress. Everything is aligned with what you teach in class.",
  },
  {
    id: "item-7",
    question: "Is my data secure on Fastlearners?",
    answer:
      "We take data security very seriously. Fastlearners uses end-to-end encryption, secure authentication (SSL/TLS), role-based access control, and regular security audits. We comply with NDPR (Nigeria) and GDPR (EU) data protection standards. We never sell, trade, or rent user data.",
  },
  {
    id: "item-8",
    question: "Can I use Fastlearners offline?",
    answer:
      "Yes! Fastlearners supports offline lesson downloads for areas with low connectivity. You can download lessons to study offline and sync your progress when you're back online. This makes learning accessible anywhere, anytime.",
  },
  {
    id: "item-9",
    question: "How does the leaderboard work?",
    answer:
      "The leaderboard ranks students based on quiz performance, activity level, and consistency. You can compete with classmates at your school, students across your region, or learners nationwide. It's designed to inspire healthy competition and keep you motivated while learning.",
  },
  {
    id: "item-10",
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including debit/credit cards, bank transfers, and mobile money. All payments are processed securely through trusted payment gateways. We do NOT store your card information.",
  },
  {
    id: "item-11",
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. There are no cancellation fees. If you cancel, you'll continue to have access until the end of your current billing period. You can also pause your subscription if you need a temporary break.",
  },
  {
    id: "item-12",
    question: "Do you offer school or institutional packages?",
    answer:
      "Yes! We offer special school and district licensing packages with volume discounts, admin controls and reporting, teacher training sessions, dedicated support, and custom onboarding. Contact us for a demo and custom pricing based on your school's needs.",
  },
];

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-2">
      <HeaderSection
        label="FAQ"
        title="Frequently Asked Questions"
        subtitle="Explore our comprehensive FAQ to find quick answers to common
          inquiries. If you need further assistance, don't hesitate to
          contact us for personalized help."
      />

      <Accordion type="single" collapsible className="my-12 w-full">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
