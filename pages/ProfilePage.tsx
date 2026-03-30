// ==========================================
// Afflosaur - User Profile Page
// ==========================================

import { useApp } from '../context/AppContext';
import { LogOut, PenLine, Star, Heart, BookOpen, Settings, Award, ArrowLeft } from 'lucide-react';

export function ProfilePage() {
  const { theme, isLoggedIn, user, login, logout, setPage, blogPosts } = useApp();
  const isDark = theme === 'dark';

  if (!isLoggedIn || !user) {
    return (
      <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <span className="text-5xl">🦖</span>
        <h2 className={`mt-4 text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Join the Afflosaur Community
        </h2>
        <p className={`mt-2 text-sm max-w-sm mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Login to write reviews, save favorites, track orders, and earn badges!
        </p>
        <button
          onClick={login}
          className="mt-4 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  const userBlogs = blogPosts.filter(b => b.author === 'Demo User' || b.author === user.name);

  const badges = [
    { emoji: '🦖', label: 'Early Adopter', earned: true },
    { emoji: '📝', label: 'First Post', earned: userBlogs.length > 0 },
    { emoji: '⭐', label: 'Top Reviews', earned: user.reviewCount > 5 },
    { emoji: '🔥', label: 'Trend Setter', earned: false },
    { emoji: '💎', label: 'Deal Hunter', earned: true },
    { emoji: '🏆', label: 'Community Star', earned: user.reviewCount > 10 },
  ];

  const menuItems = [
    { label: 'My Orders', emoji: '📦', desc: 'Track your purchases', action: () => setPage('cart') },
    { label: 'Saved Deals', emoji: '❤️', desc: 'Your favorite products', action: () => setPage('store') },
    { label: 'My Reviews', emoji: '⭐', desc: `${user.reviewCount} reviews written`, action: () => setPage('write') },
    { label: 'Settings', emoji: '⚙️', desc: 'Account preferences', action: () => setPage('settings') },
    { label: 'Refer & Earn', emoji: '🎁', desc: 'Invite friends, earn rewards', action: () => setPage('referral') },
    { label: 'Help Center', emoji: '❓', desc: 'FAQs and support', action: () => setPage('help') },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <button onClick={() => setPage('home')} className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      {/* Profile Card */}
      <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        {/* Banner */}
        <div className="h-24 sm:h-32 bg-linear-to-r from-emerald-500 to-teal-600 relative">
          <div className="absolute -bottom-10 left-5 sm:left-8">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-4 ${
              isDark ? 'bg-gray-800 border-gray-800' : 'bg-white border-white'
            } shadow-lg`}>
              {user.avatar}
            </div>
          </div>
        </div>

        <div className="pt-12 pb-5 px-5 sm:px-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user.name}
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {user.email}
              </p>
              <div className={`mt-1 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                user.role === 'admin'
                  ? 'bg-purple-500/10 text-purple-500'
                  : 'bg-emerald-500/10 text-emerald-500'
              }`}>
                <Award className="w-3 h-3" />
                {user.role === 'admin' ? 'Admin' : 'Member'}
              </div>
            </div>
            <button
              onClick={() => setPage('write')}
              className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all active:scale-95"
            >
              <PenLine className="w-4 h-4" />
              Write
            </button>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: <BookOpen className="w-4 h-4" />, label: 'Blogs', value: user.blogCount },
              { icon: <Star className="w-4 h-4" />, label: 'Reviews', value: user.reviewCount },
              { icon: <Heart className="w-4 h-4" />, label: 'Likes', value: '1.2K' },
            ].map((stat, i) => (
              <div key={i} className={`text-center p-3 rounded-xl ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-1 ${
                  isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {stat.icon}
                </div>
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </div>
                <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className={`rounded-2xl p-5 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🏅 Badges
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {badges.map((badge, i) => (
            <div
              key={i}
              className={`text-center p-3 rounded-xl transition-colors ${
                badge.earned
                  ? isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'
                  : isDark ? 'bg-gray-750 opacity-40' : 'bg-gray-50 opacity-40'
              }`}
            >
              <span className="text-2xl">{badge.emoji}</span>
              <p className={`text-[10px] mt-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {badge.label}
              </p>
              {badge.earned && (
                <span className="text-[9px] text-emerald-500 font-medium">✓ Earned</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
              isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
            } ${i > 0 ? (isDark ? 'border-t border-gray-700' : 'border-t border-gray-100') : ''}`}
          >
            <span className="text-xl">{item.emoji}</span>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.label}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {item.desc}
              </p>
            </div>
            <Settings className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          </button>
        ))}
      </div>

      {/* My Blog Posts */}
      {userBlogs.length > 0 && (
        <div className={`rounded-2xl p-5 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
          <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>📝 My Posts</h3>
          <div className="mt-3 space-y-2">
            {userBlogs.map(blog => (
              <div
                key={blog.id}
                className={`p-3 rounded-xl ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}
              >
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {blog.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    blog.isApproved
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {blog.isApproved ? '✅ Published' : '⏳ Under Review'}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    ❤️ {blog.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors ${
          isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'
        }`}
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>

      {/* Joined date */}
      <p className={`text-center text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        Member since {user.joinedAt} • Made with 🦖 in India
      </p>
    </div>
  );
}
