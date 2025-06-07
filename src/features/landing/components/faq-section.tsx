"use client";

import { Container } from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const faqs = [
  {
    question: "What makes your KPI tracking solution different?",
    answer:
      "Our platform combines intuitive design with powerful analytics, making it easy to track, visualize, and act on your KPIs. With real-time updates and customizable dashboards, you'll always have the insights you need at your fingertips.",
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
    <section className="bg-secondary/5 py-20 md:py-24" id="faq">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Got questions? We&apos;ve got answers. If you can&apos;t find what
            you&apos;re looking for,{" "}
            <Link
              href="mailto:support@kpitracker.com"
              className="text-primary hover:underline"
            >
              reach out to our support team
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="border-border/40 bg-card/50 border backdrop-blur-sm"
            >
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base">
                  {faq.answer}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
