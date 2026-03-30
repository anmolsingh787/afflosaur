import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useCoin } from '../context/CoinContext';

export function BlogPostPage() {
  const { setPage, selectedBlogId, theme, blogPosts } = useApp();
  const { isPremium, balance, spendCoins } = useCoin();
  const isDark = theme === 'dark';

  const [readProgress, setReadProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Array<{id: string; author: string; text: string; time: string; likes: number}>>([
    { id: 'c1', author: 'Rahul K.', text: 'Great article! Very helpful for beginners 🔥', time: '2 hours ago', likes: 12 },
    { id: 'c2', author: 'Sneha M.', text: 'I saved ₹2000 using these tips. Thank you Afflosaur!', time: '5 hours ago', likes: 8 },
    { id: 'c3', author: 'Amit P.', text: 'Can you write about Meesho deals too?', time: '1 day ago', likes: 3 },
  ]);
  const [unlockedWithCoins, setUnlockedWithCoins] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  // Find blog post
  const post = blogPosts.find(p => p.id === selectedBlogId) || blogPosts[0];
  const isBlogPremium = post?.isPremium || post?.tags?.includes('premium') || false;
  const canRead = !isBlogPremium || isPremium || unlockedWithCoins;

  useEffect(() => {
    if (post) {
      setLikeCount(post.likes || 0);
    }
  }, [post]);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      if (articleRef.current) {
        const element = articleRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const scrollPos = window.scrollY - element.offsetTop;
        const progress = Math.min(Math.max((scrollPos / totalHeight) * 100, 0), 100);
        setReadProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCoinUnlock = () => {
    if (spendCoins(30, `Unlocked blog: ${post?.title}`, 'blog')) {
      setUnlockedWithCoins(true);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [{
      id: 'c_' + Date.now(),
      author: 'You',
      text: commentText,
      time: 'Just now',
      likes: 0,
    }, ...prev]);
    setCommentText('');
  };

  if (!post) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Blog not found</h2>
          <button onClick={() => setPage('blog')} className="text-orange-500 font-medium">← Back to Blog</button>
        </div>
      </div>
    );
  }

  // Sample full article content
  const articleContent = [
    { type: 'text', content: post.content || post.excerpt || 'Welcome to this in-depth guide brought to you by the Afflosaur team. We\'ve spent weeks researching and testing to bring you the most comprehensive information available.' },
    { type: 'heading', content: '📌 Key Takeaways' },
    { type: 'text', content: 'Before we dive deep, here are the most important points you need to know. We\'ve analyzed data from multiple sources and tested everything ourselves to ensure accuracy.' },
    { type: 'affiliate', products: [
      { title: 'boAt Rockerz 450', price: '₹999', store: 'Amazon', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', discount: '60% off' },
      { title: 'Noise ColorFit Pro 4', price: '₹2,499', store: 'Flipkart', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', discount: '45% off' },
    ]},
    { type: 'heading', content: '🔍 Detailed Analysis' },
    { type: 'text', content: 'Our team spent over 50 hours testing and comparing products to create this comprehensive guide. We looked at build quality, performance, value for money, and customer satisfaction ratings across all major Indian e-commerce platforms.' },
    { type: 'text', content: 'The Indian market is unique because price sensitivity is extremely high. What works in the US or Europe often doesn\'t make sense here. That\'s why we focus specifically on value-for-money propositions that make sense for Indian consumers.' },
    { type: 'heading', content: '💡 Pro Tips' },
    { type: 'text', content: 'Here\'s something most people don\'t know - timing your purchases around sale events can save you 30-50% on the same products. We track all major sales across Amazon, Flipkart, and Meesho to bring you the best deals at the right time.' },
    { type: 'comparison', items: [
      { name: 'Amazon', pros: 'Fast delivery, Easy returns', cons: 'Higher prices', rating: 4.2 },
      { name: 'Flipkart', pros: 'Best prices, Good deals', cons: 'Slower delivery', rating: 4.0 },
      { name: 'Meesho', pros: 'Cheapest prices', cons: 'Quality varies', rating: 3.5 },
    ]},
    { type: 'heading', content: '🏁 Final Verdict' },
    { type: 'text', content: 'After thorough testing and analysis, our recommendation is clear. We\'ve highlighted the best options for every budget range. Remember, the cheapest option isn\'t always the best value - look for the sweet spot between price and quality.' },
  ];

  const visibleContent = canRead ? articleContent : articleContent.slice(0, 3);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-linear-to-r from-orange-500 to-amber-500 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={post.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => setPage('blog')}
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md text-white rounded-full text-sm font-medium hover:bg-black/60 transition-colors z-10"
        >
          ← Back
        </button>

        {/* Category & Premium Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full">
            {post.category}
          </span>
          {isBlogPremium && (
            <span className="px-3 py-1.5 bg-linear-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold rounded-full flex items-center gap-1">
              👑 PREMIUM
            </span>
          )}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold">
                  {(typeof post.author === 'string' ? post.author : 'A').charAt(0)}
                </div>
                <span className="font-medium">{typeof post.author === 'string' ? post.author : 'Afflosaur'}</span>
              </div>
              <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
              <span>📖 {Math.ceil((post.content?.length || 500) / 200)} min read</span>
              <span>👁 {Math.floor(Math.random() * 10000 + 1000)} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          
          {/* Main Content */}
          <article ref={articleRef} className="flex-1 min-w-0">
            
            {/* Action Bar */}
            <div className={`flex items-center justify-between p-4 rounded-2xl mb-8 ${
              isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setLiked(!liked); setLikeCount(l => liked ? l - 1 : l + 1); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    liked
                      ? 'bg-red-50 text-red-500 dark:bg-red-900/20'
                      : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {liked ? '❤️' : '🤍'} {likeCount}
                </button>

                <button
                  onClick={() => setSaved(!saved)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    saved
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20'
                      : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {saved ? '🔖' : '📑'} {saved ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium ${
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📤 Share
                </button>
                {showShareMenu && (
                  <div className={`absolute right-0 top-12 w-48 rounded-xl shadow-xl p-2 z-20 ${
                    isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    {['WhatsApp', 'Twitter', 'Telegram', 'Copy Link'].map(platform => (
                      <button
                        key={platform}
                        onClick={() => setShowShareMenu(false)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {platform === 'WhatsApp' ? '💬' : platform === 'Twitter' ? '🐦' : platform === 'Telegram' ? '📱' : '🔗'} {platform}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Article Body */}
            <div className="space-y-6">
              {visibleContent.map((block, i) => {
                if (block.type === 'heading') {
                  return (
                    <h2 key={i} className={`text-xl md:text-2xl font-bold mt-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {block.content}
                    </h2>
                  );
                }

                if (block.type === 'text') {
                  return (
                    <p key={i} className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {block.content}
                    </p>
                  );
                }

                if (block.type === 'affiliate' && 'products' in block) {
                  return (
                    <div key={i} className={`rounded-2xl p-4 border-2 border-dashed ${
                      isDark ? 'border-orange-800/40 bg-orange-900/10' : 'border-orange-200 bg-orange-50/50'
                    }`}>
                      <p className={`text-xs font-semibold mb-3 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                        🛒 RECOMMENDED PRODUCTS
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {block.products?.map((prod, j) => (
                          <div key={j} className={`flex items-center gap-3 p-3 rounded-xl ${
                            isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
                          }`}>
                            <img src={prod.image} alt={prod.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                              <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{prod.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-orange-500 font-bold text-sm">{prod.price}</span>
                                <span className="text-xs text-green-500 font-semibold">{prod.discount}</span>
                              </div>
                              <button className="mt-1 px-3 py-1 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full">
                                Buy on {prod.store} →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className={`text-[10px] mt-2 text-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                        Affiliate links — we may earn commission
                      </p>
                    </div>
                  );
                }

                if (block.type === 'comparison' && 'items' in block) {
                  return (
                    <div key={i} className={`rounded-2xl overflow-hidden border ${
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <div className={`px-4 py-3 font-bold text-sm ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        ⚖️ Quick Comparison
                      </div>
                      {block.items?.map((item, j) => (
                        <div key={j} className={`flex items-center justify-between px-4 py-3 border-t ${
                          isDark ? 'border-gray-700' : 'border-gray-100'
                        }`}>
                          <div>
                            <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              ✅ {item.pros} | ⚠️ {item.cons}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-orange-500 font-bold text-sm">⭐ {item.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* ===== PREMIUM LOCK OVERLAY ===== */}
            {!canRead && (
              <div className="relative mt-8">
                {/* Blurred preview */}
                <div className="blur-sm opacity-50 pointer-events-none">
                  <p className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    This section contains exclusive insights that our premium members love. We reveal hidden strategies, 
                    secret coupon codes, and insider tips that can save you thousands of rupees on your purchases...
                  </p>
                </div>

                {/* Lock Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center rounded-3xl backdrop-blur-md ${
                  isDark ? 'bg-gray-900/80' : 'bg-white/80'
                }`}>
                  <div className="text-center max-w-sm px-6 py-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-br from-amber-400 to-orange-600 flex items-center justify-center text-3xl mb-4 shadow-lg shadow-amber-500/30">
                      🔒
                    </div>
                    <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Premium Content
                    </h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Unlock insider secrets, hidden deals & exclusive strategies
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={() => setPage('premium')}
                        className="w-full py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                      >
                        👑 Go Premium — ₹49/mo
                      </button>

                      <button
                        onClick={handleCoinUnlock}
                        disabled={balance < 30}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                          balance >= 30
                            ? isDark
                              ? 'bg-gray-700 text-amber-400 hover:bg-gray-600 border border-amber-500/30'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                        }`}
                      >
                        🪙 Unlock with 30 Coins {balance < 30 ? `(Need ${30 - balance} more)` : `(Balance: ${balance})`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tags:</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ===== COMMENTS SECTION ===== */}
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                💬 Comments ({comments.length})
              </h3>

              {/* Comment Input */}
              <div className={`flex gap-3 mb-6 p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold shrink-0">
                  Y
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Write a comment... (+10 coins)"
                    rows={2}
                    className={`w-full p-3 rounded-xl text-sm resize-none outline-none ${
                      isDark ? 'bg-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        commentText.trim()
                          ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600'
                      }`}
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className={`flex gap-3 p-4 rounded-2xl ${
                    isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
                  }`}>
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 text-sm">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {comment.author}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {comment.time}
                        </span>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button className={`text-xs ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                          ❤️ {comment.likes}
                        </button>
                        <button className={`text-xs ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== RELATED ARTICLES ===== */}
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📚 Related Articles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blogPosts.filter(p => p.id !== post.id).slice(0, 4).map(related => (
                  <div
                    key={related.id}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('selectBlog', { detail: related.id }));
                      setPage('blogpost');
                      window.scrollTo(0, 0);
                    }}
                    className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-orange-50 shadow-sm'
                    }`}
                  >
                    <img
                      src={related.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200'}
                      alt={related.title}
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {related.category}
                      </span>
                      <h4 className={`text-sm font-semibold line-clamp-2 mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {related.title}
                      </h4>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        ❤️ {related.likes} • {new Date(related.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* ===== SIDEBAR (Desktop) ===== */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6">
            {/* Author Card */}
            <div className={`rounded-2xl p-5 text-center ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
                {(typeof post.author === 'string' ? post.author : 'A').charAt(0)}
              </div>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {typeof post.author === 'string' ? post.author : 'Afflosaur'}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Afflosaur Writer</p>
              <button className="mt-3 w-full py-2 bg-linear-to-r from-orange-500 to-amber-500 text-white text-sm font-bold rounded-xl">
                Follow
              </button>
            </div>

            {/* Table of Contents */}
            <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <h4 className={`font-bold text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>📋 Contents</h4>
              <div className="space-y-2">
                {articleContent.filter(b => b.type === 'heading').map((b, i) => (
                  <p key={i} className={`text-xs cursor-pointer hover:text-orange-500 transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {b.content}
                  </p>
                ))}
              </div>
            </div>

            {/* AffloCoins Earn */}
            <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <h4 className={`font-bold text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>🪙 Earn Coins</h4>
              <div className="space-y-2">
                {[
                  { action: 'Like this post', coins: 2, icon: '❤️' },
                  { action: 'Comment', coins: 10, icon: '💬' },
                  { action: 'Share', coins: 20, icon: '📤' },
                  { action: 'Write a review', coins: 50, icon: '✍️' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.icon} {item.action}
                    </span>
                    <span className="text-xs font-bold text-amber-500">+{item.coins} 🪙</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium CTA */}
            {!isPremium && (
              <div className="rounded-2xl overflow-hidden">
                <div className="bg-linear-to-br from-amber-500 to-orange-600 p-5 text-center text-white">
                  <div className="text-2xl mb-2">👑</div>
                  <p className="font-bold text-sm mb-1">Go Premium</p>
                  <p className="text-xs text-amber-100 mb-3">Unlock all articles & earn 1.5x coins</p>
                  <button
                    onClick={() => setPage('premium')}
                    className="w-full py-2 bg-white text-orange-600 text-sm font-bold rounded-xl"
                  >
                    ₹49/month
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
