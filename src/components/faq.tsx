"use client";

import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'How do I get started on InternQuest?',
    answer: 'Getting started is simple! Click on "Get Started" or "Create Account" to sign up. Fill in your profile details, upload your resume, and you can start browsing and applying to internships immediately.',
  },
  {
    question: 'Are all the companies on InternQuest verified?',
    answer: 'Yes, absolutely! We have a rigorous verification process for all companies. Every company listed on our platform is verified to ensure legitimacy and to protect students from fraudulent postings.',
  },
  {
    question: 'Is there any fee to use InternQuest?',
    answer: 'No, InternQuest is completely free for students. You can create an account, browse internships, apply to opportunities, and use all our resources without any charges.',
  },
  {
    question: 'How does the skill quiz work?',
    answer: 'After applying to certain internships, you may be asked to take skill assessments. These quizzes help showcase your abilities to employers and can increase your chances of getting shortlisted.',
  },
  {
    question: 'Can I track my applications?',
    answer: 'Yes! Our intuitive dashboard allows you to track all your applications in real-time. You can see which stage your application is at, upcoming deadlines, and receive notifications about updates.',
  },
  {
    question: 'What happens after I apply to an internship?',
    answer: 'After applying, your profile is reviewed by the company. If shortlisted, you\'ll receive a notification and may be asked to complete skill assessments or attend interviews. You can track the entire process through your dashboard.',
  },
  {
    question: 'Can I apply to multiple internships?',
    answer: 'Yes, you can apply to as many internships as you want. We encourage you to explore different opportunities to find the best fit for your career goals.',
  },
  {
    question: 'How are internships verified on the platform?',
    answer: 'We verify companies through documentation, direct communication, and background checks. We also monitor feedback from students to ensure ongoing quality and legitimacy of all opportunities.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#1E293B] mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-600">Everything you need to know about InternQuest</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#2563EB] transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-[#1E293B] pr-8">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                      <Minus className="text-white" size={20} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-[#F8FAFC] rounded-lg flex items-center justify-center">
                      <Plus className="text-[#2563EB]" size={20} />
                    </div>
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-white rounded-2xl p-8 border border-gray-200">
          <h3 className="text-[#1E293B] text-xl mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <button className="bg-[#2563EB] text-white px-8 py-3 rounded-lg hover:bg-[#1d4ed8] transition">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
