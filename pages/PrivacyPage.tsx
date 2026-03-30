// ==========================================
// Afflosaur - Privacy Policy Page
// ==========================================

import { useApp } from '../context/AppContext';

export function PrivacyPage() {
  const { theme, setPage } = useApp();
  const isDark = theme === 'dark';

  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        '**Personal Information:** When you create an account, we collect your name, email address, and profile information (like avatar and bio).',
        '**Usage Data:** We automatically collect information about how you use Afflosaur, including pages visited, products clicked, search queries, and time spent on site.',
        '**Device Information:** Browser type, operating system, device type, screen resolution, and IP address for analytics and optimization.',
        '**Cookies:** We use essential cookies for authentication and preferences (like dark mode). Analytics cookies help us improve the platform.',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'To provide and maintain our service, including price comparison and deal alerts.',
        'To personalize your experience with relevant product recommendations.',
        'To send you deal alerts and notifications (only if you opt in).',
        'To improve our platform based on usage patterns.',
        'To moderate user-generated content (blogs, reviews, deals).',
        'To prevent fraud, spam, and abuse.',
      ],
    },
    {
      title: '3. Affiliate Links & Third-Party Sites',
      content: [
        'Afflosaur contains affiliate links to third-party ecommerce sites like Amazon, Flipkart, and Meesho.',
        'When you click an affiliate link, you leave our platform and are subject to that site\'s privacy policy.',
        'We may earn a commission from qualifying purchases made through affiliate links, at no extra cost to you.',
        'We do not control and are not responsible for the privacy practices of third-party sites.',
      ],
    },
    {
      title: '4. Data Sharing',
      content: [
        'We DO NOT sell your personal information to anyone.',
        'We may share anonymized, aggregated data for analytics purposes.',
        'We may share data with service providers (hosting, analytics) who help us operate the platform.',
        'We may disclose information if required by law or to protect our rights.',
      ],
    },
    {
      title: '5. Data Security',
      content: [
        'We use industry-standard security measures including encrypted connections (HTTPS), secure authentication, and Row-Level Security on our database.',
        'User passwords are hashed and never stored in plain text.',
        'We regularly review our security practices and update them as needed.',
        'Despite our best efforts, no internet transmission is 100% secure.',
      ],
    },
    {
      title: '6. Your Rights',
      content: [
        '**Access:** You can access your personal data through your profile settings.',
        '**Update:** You can update your profile information at any time.',
        '**Delete:** You can request deletion of your account and associated data.',
        '**Opt-out:** You can unsubscribe from marketing emails at any time.',
        'To exercise these rights, contact us at hello@afflosaur.com.',
      ],
    },
    {
      title: '7. Children\'s Privacy',
      content: [
        'Afflosaur is not intended for children under 13 years of age.',
        'We do not knowingly collect personal information from children under 13.',
        'If you believe a child has provided us with personal information, please contact us.',
      ],
    },
    {
      title: '8. Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time.',
        'We will notify you of significant changes through the platform or via email.',
        'Continued use of Afflosaur after changes constitutes acceptance of the updated policy.',
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back Button */}
      <button onClick={() => setPage('home')} className={`flex items-center gap-2 text-sm font-medium mt-4 transition-colors ${isDark ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'}`}>
        ← Back to Home
      </button>
      {/* Header */}
      <div className="text-center space-y-3 py-6">
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🔒 Privacy Policy
        </h1>
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Last updated: January 2024
        </p>
        <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Your privacy matters to us. This policy explains what data we collect, 
          how we use it, and your rights regarding your personal information.
        </p>
      </div>

      {/* Quick Summary */}
      <div className={`p-5 rounded-2xl border ${
        isDark ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-emerald-50 border-emerald-200'
      }`}>
        <h3 className={`font-bold text-sm mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
          🦖 TL;DR (Quick Summary)
        </h3>
        <ul className={`text-xs sm:text-sm space-y-1.5 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
          <li>✅ We collect minimal data needed to run the platform</li>
          <li>✅ We NEVER sell your personal information</li>
          <li>✅ Affiliate links redirect to partner sites (their privacy policy applies)</li>
          <li>✅ You can delete your account anytime</li>
          <li>✅ We use encryption and secure database practices</li>
        </ul>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className={`p-5 sm:p-6 rounded-2xl border ${
            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-base sm:text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.content.map((item, i) => (
                <li key={i} className={`text-sm leading-relaxed flex gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="text-emerald-500 shrink-0 mt-1">•</span>
                  <span dangerouslySetInnerHTML={{
                    __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                  }} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className={`text-center p-6 rounded-2xl border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Questions about our privacy practices? Contact us at{' '}
          <span className="text-emerald-500 font-medium">hello@afflosaur.com</span>
        </p>
      </div>
    </div>
  );
}
