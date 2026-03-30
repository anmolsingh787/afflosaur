// ==========================================
// Afflosaur - Contact Us Page
// ==========================================

import { useState } from 'react';
import { Mail, MessageCircle, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ContactPage() {
  const { theme, showNotification } = useApp();
  const isDark = theme === 'dark';
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showNotification('Please fill all required fields! ⚠️');
      return;
    }
    setSubmitted(true);
    showNotification('Message sent! We\'ll get back to you soon 🦖');
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'hello@afflosaur.com', sub: 'We reply within 24 hours' },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'WhatsApp', value: '+91 98765 43210', sub: 'Mon-Sat, 10AM-6PM IST' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'India 🇮🇳', sub: 'Remote-first team' },
    { icon: <Clock className="w-5 h-5" />, label: 'Response Time', value: 'Within 24 hours', sub: 'Usually much faster' },
  ];

  const faqItems = [
    { q: 'How do I submit a deal?', a: 'Login to your account and go to Community Deals page. Click "Submit Deal" and fill in the details.' },
    { q: 'How does price comparison work?', a: 'We check prices across Amazon, Flipkart, Meesho and other stores. The "Best Deal" badge shows the cheapest option.' },
    { q: 'Do you sell products directly?', a: 'Yes! Products marked "My Store" are sold directly by us. Affiliate products redirect to partner stores.' },
    { q: 'How do I become a blog writer?', a: 'Just sign up and start writing! Go to the "Write" section. Admin will review and approve your posts.' },
    { q: 'Is my data safe?', a: 'Absolutely! We use industry-standard security. Read our Privacy Policy for full details.' },
  ];

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Message Sent! 🎉
        </h2>
        <p className={`text-sm sm:text-base max-w-md mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Thanks for reaching out, {form.name}! Our team will get back to you within 24 hours. 
          Keep hunting deals in the meantime! 🦕
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
            isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 py-6">
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📧 Contact Us
        </h1>
        <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Got a question, suggestion, or just want to say hi? We'd love to hear from you!
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {contactInfo.map((info) => (
          <div key={info.label} className={`p-4 rounded-2xl border text-center ${
            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
              isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {info.icon}
            </div>
            <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{info.label}</p>
            <p className={`text-sm font-bold mt-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{info.value}</p>
            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{info.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Contact Form */}
        <div className={`lg:col-span-3 p-5 sm:p-6 rounded-2xl border ${
          isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Send us a message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Name *
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500 placeholder:text-gray-600'
                      : 'bg-gray-50 border-gray-200 focus:border-emerald-500 placeholder:text-gray-400'
                  }`}
                  required
                />
              </div>
              <div>
                <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Email *
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500 placeholder:text-gray-600'
                      : 'bg-gray-50 border-gray-200 focus:border-emerald-500 placeholder:text-gray-400'
                  }`}
                  required
                />
              </div>
            </div>
            <div>
              <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Subject
              </label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="What's this about?"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                  isDark
                    ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500 placeholder:text-gray-600'
                    : 'bg-gray-50 border-gray-200 focus:border-emerald-500 placeholder:text-gray-400'
                }`}
              />
            </div>
            <div>
              <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Message *
              </label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Tell us what's on your mind..."
                rows={5}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none transition-colors ${
                  isDark
                    ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500 placeholder:text-gray-600'
                    : 'bg-gray-50 border-gray-200 focus:border-emerald-500 placeholder:text-gray-400'
                }`}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ❓ FAQ
          </h2>
          {faqItems.map((faq, i) => (
            <div key={i} className={`p-4 rounded-2xl border ${
              isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{faq.q}</p>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
