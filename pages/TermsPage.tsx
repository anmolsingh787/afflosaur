// ==========================================
// Afflosaur - Terms of Use Page
// ==========================================

import { useApp } from '../context/AppContext';

export function TermsPage() {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using Afflosaur ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Platform. These terms apply to all users, including browsers, bloggers, reviewers, and buyers.',
    },
    {
      title: '2. Use of the Platform',
      items: [
        'You must be at least 13 years old to use Afflosaur.',
        'You agree to provide accurate information when creating an account.',
        'You are responsible for maintaining the security of your account credentials.',
        'You agree not to use the Platform for any illegal or unauthorized purpose.',
        'You must not transmit any malware, spam, or harmful code.',
      ],
    },
    {
      title: '3. User-Generated Content',
      items: [
        'You retain ownership of content you create (blogs, reviews, deals).',
        'By posting content, you grant Afflosaur a non-exclusive license to display and distribute it on the Platform.',
        'You are solely responsible for the accuracy and legality of your content.',
        'We reserve the right to remove or modify content that violates our guidelines.',
        'Content must not be defamatory, obscene, or infringe on others\' rights.',
        'Product reviews must be honest and based on genuine experience.',
      ],
    },
    {
      title: '4. Affiliate Links & Purchases',
      items: [
        'Afflosaur displays products from third-party sellers via affiliate links.',
        'When you click an affiliate link and make a purchase, Afflosaur may earn a commission.',
        'This commission is at NO extra cost to you — the price remains the same.',
        'Afflosaur is NOT the seller for affiliate products. All transactions are between you and the third-party store.',
        'For direct-sale products ("My Store"), Afflosaur is the seller and standard consumer protection laws apply.',
        'We do our best to show accurate prices, but prices may change on third-party sites.',
      ],
    },
    {
      title: '5. Price Comparison Accuracy',
      items: [
        'We strive to provide accurate and up-to-date price comparisons.',
        'Prices are fetched periodically and may not reflect real-time changes.',
        'The "Best Deal" badge indicates the lowest price at the time of last check.',
        'Always verify the final price on the seller\'s website before purchasing.',
        'Afflosaur is not liable for price discrepancies.',
      ],
    },
    {
      title: '6. Afflo Coin Economy',
      items: [
        'Afflo Coins are virtual rewards with no direct cash value.',
        '10 Afflo Coins ≈ ₹1 value — for redemption purposes only.',
        'Coins cannot be converted to real currency or transferred.',
        'Coins can be used for coupons, giveaway entries, premium access, and deal unlocks.',
        'We reserve the right to modify the coin economy at any time.',
        'Abuse of the coin system (fake accounts, bots) will result in account termination.',
      ],
    },
    {
      title: '7. Intellectual Property',
      items: [
        'The Afflosaur name, logo (🦕), and brand identity are our intellectual property.',
        'The Platform\'s design, code, and features are protected by copyright.',
        'You may not copy, modify, or distribute our Platform without written permission.',
        'Product images and descriptions may belong to their respective brands and sellers.',
      ],
    },
    {
      title: '8. Disclaimer of Warranties',
      content: 'Afflosaur is provided "AS IS" without warranties of any kind. We do not guarantee that the Platform will be uninterrupted, error-free, or free of harmful components. We do not warrant the accuracy of price comparisons, product descriptions, or user-generated content.',
    },
    {
      title: '9. Limitation of Liability',
      content: 'To the maximum extent permitted by Indian law, Afflosaur shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. This includes damages from affiliate purchases, inaccurate pricing information, or user-generated content.',
    },
    {
      title: '10. Moderation & Termination',
      items: [
        'We reserve the right to suspend or terminate accounts that violate these terms.',
        'Admin decisions on content moderation are final.',
        'Users can request account deletion at any time.',
        'We may modify or discontinue any feature of the Platform without notice.',
      ],
    },
    {
      title: '11. Governing Law',
      content: 'These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of Indian courts. By using Afflosaur, you consent to this jurisdiction.',
    },
    {
      title: '12. Changes to Terms',
      content: 'We may update these Terms from time to time. Changes will be posted on this page with an updated date. Continued use of the Platform after changes constitutes acceptance of the new terms.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 py-6">
        <h1 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📜 Terms of Use
        </h1>
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Last updated: January 2024
        </p>
        <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Please read these terms carefully before using Afflosaur.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {sections.map((section) => (
          <div key={section.title} className={`p-5 sm:p-6 rounded-2xl border ${
            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-base sm:text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {section.title}
            </h2>
            {section.content && (
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {section.content}
              </p>
            )}
            {section.items && (
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className={`text-sm leading-relaxed flex gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="text-orange-500 shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className={`text-center p-6 rounded-2xl border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Questions about these terms? Reach out at{' '}
          <span className="text-orange-500 font-medium">hello@afflosaur.com</span>
        </p>
      </div>
    </div>
  );
}
