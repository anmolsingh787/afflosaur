// ==========================================
// Afflosaur - Help Center Page
// ==========================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, ChevronUp, MessageCircle, Mail, Phone, Search, BookOpen } from 'lucide-react';

export function HelpPage() {
  const { theme, setPage } = useApp();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I search for products?',
      answer: 'Use the search bar at the top of the page. You can search by product name, brand, or category. The search will show results from multiple stores.'
    },
    {
      question: 'How do I compare prices?',
      answer: 'Click on any product card to view detailed price comparison across Amazon, Flipkart, and other stores. You can also see reviews and specifications.'
    },
    {
      question: 'How do I add items to cart?',
      answer: 'For affiliate products, click "Compare Prices" to visit the store. For local Prayagraj products, use the "Add to Cart" button and complete your order through WhatsApp.'
    },
    {
      question: 'What are Afflo Coins?',
      answer: 'Afflo Coins are our reward system. Earn coins by writing reviews, referring friends, and participating in community activities. Use coins for premium features.'
    },
    {
      question: 'How do I write a review?',
      answer: 'Go to the "Write" page from the menu. Fill in the product details, your experience, and rating. Reviews help other shoppers make informed decisions.'
    },
    {
      question: 'What is the referral program?',
      answer: 'Share your referral link with friends. When they sign up and make purchases, you both earn Afflo Coins. Check your Referral page for your unique link.'
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach us through the contact form, email, or WhatsApp. We typically respond within 24 hours.'
    },
    {
      question: 'Is my data safe?',
      answer: 'Yes! We use industry-standard encryption and never share your personal information with third parties. Your privacy is our priority.'
    }
  ];

  const quickActions = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Live Chat',
      desc: 'Chat with our support team',
      action: () => alert('Live chat coming soon! Please use contact form.')
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Support',
      desc: 'support@afflosaur.com',
      action: () => window.location.href = 'mailto:support@afflosaur.com'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'WhatsApp',
      desc: '+91 98765 43210',
      action: () => window.open('https://wa.me/919876543210', '_blank')
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'User Guide',
      desc: 'Complete guide',
      action: () => setPage('setup')
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ❓ Help Center
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Find answers to common questions and get support
        </p>
      </div>

      {/* Search */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={action.action}
              className={`p-4 rounded-xl text-left transition-all hover:scale-105 ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`mb-2 ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
                {action.icon}
              </div>
              <h3 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {action.title}
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {action.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredFAQs.map((faq, i) => (
            <div key={i} className="p-6">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {faq.question}
                </h3>
                {expandedFAQ === i ? (
                  <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </button>
              {expandedFAQ === i && (
                <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Still Need Help?
        </h2>
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Can't find what you're looking for? Send us a message and we'll get back to you.
        </p>
        <button
          onClick={() => setPage('contact')}
          className="w-full py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          Contact Us
        </button>
      </div>

      {/* App Info */}
      <div className={`p-6 rounded-2xl text-center ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="text-4xl mb-2">🦕</div>
        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Afflosaur Support
        </h3>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          We're here to help you shop smarter!
        </p>
      </div>
    </div>
  );
}