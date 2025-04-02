"use client";

import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const faqs = [
  {
    question: "What makes your KPI tracking solution different?",
    answer:
      "Our platform combines intuitive design with powerful analytics, making it easy to track, visualize, and act on your KPIs. With real-time updates and customizable dashboards, you&apos;ll always have the insights you need at your fingertips.",
  },
  {
    question: "How easy is it to get started?",
    answer:
      "Getting started is simple - sign up for an account, connect your data sources, and start tracking your KPIs in minutes. Our platform guides you through the setup process, and our support team is always available to help.",
  },
  {
    question: "Can I customize my KPI dashboards?",
    answer:
      "Yes! Our platform offers fully customizable dashboards. You can choose from various visualization types, arrange widgets as needed, and create different views for different teams or purposes.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We provide comprehensive support through multiple channels. For immediate assistance, visit our documentation or email our support team at support@kpitracker.com. Enterprise customers receive dedicated account management and priority support.",
  },
  {
    question: "Do you offer custom integrations?",
    answer:
      "Yes, we support a wide range of integrations. For custom integration needs, please email our enterprise team at enterprise@kpitracker.com to discuss your specific requirements.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! You can try our platform free for 14 days with no credit card required. If you need more time to evaluate, reach out to our sales team at sales@kpitracker.com.",
  },
];

export function FaqSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/5" id="faq">
      <Container>
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Got questions? We&apos;ve got answers. If you can&apos;t find what
            you&apos;re looking for, feel free to{" "}
            <Link
              href="mailto:support@kpitracker.com"
              className="text-primary hover:underline"
            >
              reach out to our support team
            </Link>
            .
          </p>
        </div>

        <div className="grid gap-12 mx-auto max-w-5xl">
          {faqs.map((faq, index) => (
            <div key={index}>
              <div
                className={`grid md:grid-cols-2 gap-8 items-start ${
                  index % 2 === 1 ? "md:rtl" : ""
                }`}
              >
                <div
                  className={`w-full space-y-3 ${index % 2 === 1 ? "md:ml-auto" : "md:mr-auto"}`}
                >
                  <h3 className="text-lg md:text-xl font-semibold leading-tight">
                    {faq.question}
                  </h3>
                </div>

                <div
                  className={`w-full space-y-2 ${
                    index % 2 === 1 ? "md:mr-auto" : "md:ml-auto"
                  }`}
                >
                  <p className="text-base md:text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
              {index < faqs.length - 1 && <Separator className="mt-12" />}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
