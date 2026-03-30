// ==========================================
// DealDino - Setup Guide Page
// Beginner-friendly instructions for deployment
// ==========================================

import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { ArrowLeft, CheckCircle, Circle, ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';

export function SetupGuidePage() {
  const { theme, setPage } = useApp();
  const isDark = theme === 'dark';
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const StatusBadge = ({ ok }: { ok: boolean }) => (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
      ok ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'
    }`}>
      {ok ? <CheckCircle className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
      {ok ? 'Connected' : 'Not Connected'}
    </span>
  );

  const CodeBlock = ({ code, index }: { code: string; index: number }) => (
    <div className={`relative rounded-xl p-4 text-xs font-mono overflow-x-auto ${
      isDark ? 'bg-gray-900 text-green-400' : 'bg-gray-900 text-green-400'
    }`}>
      <button
        onClick={() => copyToClipboard(code, index)}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        title="Copy"
      >
        <Copy className="w-3.5 h-3.5 text-gray-300" />
      </button>
      {copiedIndex === index && (
        <span className="absolute top-2 right-10 text-[10px] text-emerald-400">Copied!</span>
      )}
      <pre className="whitespace-pre-wrap">{code}</pre>
    </div>
  );

  const steps = [
    {
      title: '0. Run Locally (Quick Start)',
      emoji: '💻',
      content: (
        <div className="space-y-3">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Start Afflosaur locally on your machine:
          </p>
          <ol className={`text-sm space-y-1 list-decimal list-inside ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <li>Open terminal in the project folder</li>
            <li>Run <code className="px-1.5 py-0.5 bg-gray-800 text-emerald-400 rounded text-xs">npm install</code></li>
            <li>Run <code className="px-1.5 py-0.5 bg-gray-800 text-emerald-400 rounded text-xs">npm run dev</code></li>
            <li>Open <code className="px-1.5 py-0.5 bg-gray-800 text-emerald-400 rounded text-xs">http://localhost:5173</code></li>
          </ol>
          <CodeBlock
            index={-1}
            code={`# Local setup\nnpm install\nnpm run dev`}
          />
        </div>
      ),
    },
    {
      title: '1. Create Supabase Project',
      emoji: '🏗️',
      content: (
        <div className="space-y-3">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a> and create a free account.
          </p>
          <ol className={`text-sm space-y-1 list-decimal list-inside ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <li>Click "Start your project"</li>
            <li>Create a new organization</li>
            <li>Click "New Project"</li>
            <li>Name it "dealdino" and set a database password</li>
            <li>Select closest region (Mumbai for India)</li>
            <li>Wait for project to be created (~2 mins)</li>
          </ol>
        </div>
      ),
    },
    {
      title: '2. Get API Keys',
      emoji: '🔑',
      content: (
        <div className="space-y-3">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            In your Supabase dashboard:
          </p>
          <ol className={`text-sm space-y-1 list-decimal list-inside ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <li>Go to <strong>Settings → API</strong></li>
            <li>Copy the <strong>Project URL</strong></li>
            <li>Copy the <strong>anon public</strong> key</li>
          </ol>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Create a <code className="px-1.5 py-0.5 bg-gray-800 text-emerald-400 rounded text-xs">.env</code> file in your project root:
          </p>
          <CodeBlock
            index={0}
            code={`VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...your-key`}
          />
        </div>
      ),
    },
    {
      title: '3. Create Database Tables',
      emoji: '🗄️',
      content: (
        <div className="space-y-3">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Go to <strong>SQL Editor</strong> in Supabase dashboard and run the SQL from <code className="px-1.5 py-0.5 bg-gray-800 text-emerald-400 rounded text-xs">src/lib/supabaseClient.ts</code>
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            The SQL creates these tables: products, stores, prices, reviews, blog_posts, blog_comments, user_deals, profiles, analytics_events
          </p>
        </div>
      ),
    },
    {
      title: '4. Enable Google Auth (Optional)',
      emoji: '🔐',
      content: (
        <div className="space-y-3">
          <ol className={`text-sm space-y-1 list-decimal list-inside ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <li>Go to <strong>Authentication → Providers</strong></li>
            <li>Enable <strong>Google</strong></li>
            <li>Create OAuth credentials at <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline">Google Cloud Console</a></li>
            <li>Add your Client ID and Secret to Supabase</li>
            <li>Add redirect URL from Supabase to Google</li>
          </ol>
        </div>
      ),
    },
    {
      title: '5. Deploy to Vercel (Free)',
      emoji: '🚀',
      content: (
        <div className="space-y-3">
          <ol className={`text-sm space-y-1 list-decimal list-inside ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <li>Push code to GitHub</li>
            <li>Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline">vercel.com</a></li>
            <li>Import your GitHub repo</li>
            <li>Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)</li>
            <li>Click Deploy!</li>
          </ol>
          <CodeBlock
            index={1}
            code={`# Or use Vercel CLI
npm i -g vercel
vercel login
vercel --prod`}
          />
        </div>
      ),
    },
    {
      title: '6. Add Affiliate Links',
      emoji: '💰',
      content: (
        <div className="space-y-3">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Sign up for affiliate programs:
          </p>
          <ul className={`text-sm space-y-1 list-disc list-inside ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <li><strong>Amazon Associates:</strong> affiliate-program.amazon.in</li>
            <li><strong>Flipkart Affiliate:</strong> affiliate.flipkart.com</li>
            <li><strong>Meesho:</strong> meesho.com/affiliate</li>
          </ul>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Add your affiliate tag to product URLs in the <code className="px-1.5 py-0.5 bg-gray-800 text-emerald-400 rounded text-xs">stores</code> table.
          </p>
        </div>
      ),
    },
    {
      title: '7. Add Google AdSense',
      emoji: '📢',
      content: (
        <div className="space-y-3">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            The layout already has ad placeholders. To activate:
          </p>
          <ol className={`text-sm space-y-1 list-decimal list-inside ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <li>Apply at <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline">Google AdSense</a></li>
            <li>Wait for approval (needs traffic first)</li>
            <li>Replace ad placeholders with AdSense code</li>
          </ol>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => setPage('admin')}
        className={`flex items-center gap-1.5 text-sm font-medium ${
          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Admin
      </button>

      {/* Status Card */}
      <div className={`rounded-2xl p-5 sm:p-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🛠️ Setup Guide
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Follow these steps to connect your backend and start earning
        </p>

        <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Supabase Connection
            </span>
            <StatusBadge ok={isSupabaseConfigured} />
          </div>
          {!isSupabaseConfigured && (
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file
            </p>
          )}
        </div>
      </div>

      {/* Steps */}
      {steps.map((step, i) => (
        <div key={i} className={`rounded-2xl p-5 sm:p-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-xl">{step.emoji}</span>
            {step.title}
          </h2>
          <div className="mt-3">{step.content}</div>
        </div>
      ))}

      {/* File Structure Reference */}
      <div className={`rounded-2xl p-5 sm:p-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📂 Backend File Structure
        </h2>
        <CodeBlock
          index={2}
          code={`src/
├── api/
│   ├── index.ts          # All API exports
│   ├── auth.ts           # Login, signup, Google auth
│   ├── products.ts       # Product CRUD + search
│   ├── prices.ts         # Price comparison engine
│   ├── reviews.ts        # User reviews + ratings
│   ├── blog.ts           # Blog posts + comments
│   ├── deals.ts          # User-submitted deals
│   └── analytics.ts      # Click/view tracking
├── lib/
│   ├── supabaseClient.ts # Supabase config + SQL
│   └── helpers.ts        # Utility functions
├── types/
│   ├── index.ts          # Frontend types
│   └── database.ts       # Database types
└── .env                  # API keys (not in git!)`}
        />
      </div>

      {/* Where to Edit */}
      <div className={`rounded-2xl p-5 sm:p-6 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ✏️ Where to Edit Later
        </h2>
        <div className="mt-3 space-y-2">
          {[
            { file: 'src/api/auth.ts', desc: 'Add more auth providers or custom login logic' },
            { file: 'src/api/products.ts', desc: 'Add AI product import or scraping' },
            { file: 'src/api/prices.ts', desc: 'Add auto price-update from API' },
            { file: 'src/api/analytics.ts', desc: 'Add more tracking events' },
            { file: 'src/lib/supabaseClient.ts', desc: 'Database schema & RLS policies' },
            { file: 'src/lib/helpers.ts', desc: 'Add new utility functions' },
            { file: 'src/components/DinoAssistant.tsx', desc: 'Plug in OpenAI API here' },
          ].map((item, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${
              isDark ? 'bg-gray-750' : 'bg-gray-50'
            }`}>
              <code className="text-xs bg-gray-900 text-emerald-400 px-2 py-1 rounded shrink-0">
                {item.file}
              </code>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
