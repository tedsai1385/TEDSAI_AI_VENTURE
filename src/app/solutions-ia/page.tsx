import React from 'react';
import { IAHero } from '@/components/ia/IAHero';
import { ServicesGrid } from '@/components/ia/ServicesGrid';
import { CasUsages } from '@/components/ia/CasUsages';
import { CommentCaMarche } from '@/components/ia/CommentCaMarche';
import { PricingTable } from '@/components/ia/PricingTable';
import { ChatbotDemo } from '@/components/ia/ChatbotDemo';
import { DiagnosticForm } from '@/components/ia/DiagnosticForm';
import { FAQSection } from '@/components/ia/FAQSection';

export default function SolutionsIAPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <IAHero />

      <ServicesGrid />

      <ChatbotDemo />

      <CasUsages />

      <CommentCaMarche />

      <PricingTable />

      <DiagnosticForm />

      <FAQSection />
    </main>
  );
}
