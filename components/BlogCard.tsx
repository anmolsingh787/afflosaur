import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { BlogPost } from '../types';

interface BlogCardProps {
  post?: BlogPost;
  blog?: {
    id: string;
    title: string;
    excerpt: string;
    coverImage: string;
    author: string;
    authorAvatar?: string;
    date: string;
    readTime: string;
    category: string;
    tags?: string[];
    likes: number;
    views?: number;
    isPremium?: boolean;
    slug?: string;
  };
  variant?: 'default' | 'featured' | 'compact';
}

export function BlogCard({ post, blog: blogProp, variant = 'default' }: BlogCardProps) {
  const { setPage, setSelectedBlogId, theme } = useApp();
  const isDark = theme === 'dark';

  // Support both 'post' and 'blog' props for backwards compatibility
  const raw = post || blogProp;
  if (!raw) return null;

  const blog = {
    id: raw.id,
    title: raw.title,
    excerpt: 'excerpt' in raw ? (raw as any).excerpt : (raw as any).content?.substring(0, 120) || '',
    coverImage: 'coverImage' in raw ? (raw as any).coverImage : (raw as any).image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600',
    author: 'author' in raw ? (typeof raw.author === 'string' ? raw.author : (raw as any).author?.name || 'Afflosaur') : 'Afflosaur',
    date: 'date' in raw ? (raw as any).date : new Date((raw as any).createdAt || Date.now()).toLocaleDateString(),
    readTime: 'readTime' in raw ? (raw as any).readTime : `${Math.ceil(((raw as any).content?.length || 500) / 1000)} min`,
    category: (raw as any).category || 'General',
    tags: (raw as any).tags || [],
    likes: (raw as any).likes || 0,
    views: (raw as any).views || 0,
    isPremium: (raw as any).isPremium || false,
  };

  return <BlogCardInner blog={blog} variant={variant} isDark={isDark} setPage={setPage} setSelectedBlogId={setSelectedBlogId} />;
}

interface InnerBlog {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  likes: number;
  views: number;
  isPremium: boolean;
}

function BlogCardInner({ blog, variant, isDark, setPage, setSelectedBlogId }: {
  blog: InnerBlog;
  variant: string;
  isDark: boolean;
  setPage: (page: any) => void;
  setSelectedBlogId: (id: string | null) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes);

  const handleClick = () => {
    setSelectedBlogId(blog.id);
    setPage('blogpost');
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      setLikeCount(prev => prev + 1);
      setLiked(true);
    } else {
      setLikeCount(prev => prev - 1);
      setLiked(false);
    }
  };

  const categoryColors: Record<string, string> = {
    'Deals': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Tech Reviews': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Affiliate Secrets': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'AI Tools': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    'Earning Tips': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Local Prayagraj': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Premium Guides': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Money Saving': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Comparison': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'Top 10': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'Reviews': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Technology': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  };

  const getCategoryColor = (cat: string) => {
    return categoryColors[cat] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  // ===== FEATURED VARIANT =====
  if (variant === 'featured') {
    return (
      <div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
          isHovered ? 'shadow-2xl shadow-orange-500/20 scale-[1.01]' : 'shadow-lg'
        } ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="md:flex">
          <div className="md:w-1/2 relative overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className={`w-full h-64 md:h-full object-cover transition-transform duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            {blog.isPremium && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-linear-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                <span>👑</span> PREMIUM
              </div>
            )}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
              🔥 FEATURED
            </div>
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(blog.category)}`}>
                {blog.category}
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                📖 {blog.readTime}
              </span>
            </div>
            <h2 className={`text-xl md:text-2xl font-bold mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {blog.title}
            </h2>
            <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {blog.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{blog.author}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{blog.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleLike} className={`flex items-center gap-1 text-sm ${
                  liked ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {liked ? '❤️' : '🤍'} {likeCount}
                </button>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>👁 {blog.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== COMPACT VARIANT =====
  if (variant === 'compact') {
    return (
      <div
        onClick={handleClick}
        className={`group flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
          isDark ? 'hover:bg-gray-800' : 'hover:bg-orange-50'
        }`}
      >
        <img src={blog.coverImage} alt={blog.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoryColor(blog.category)}`}>
              {blog.category}
            </span>
            {blog.isPremium && <span className="text-[10px]">👑</span>}
          </div>
          <h4 className={`text-sm font-semibold line-clamp-2 group-hover:text-orange-500 transition-colors ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {blog.title}
          </h4>
          <div className={`flex items-center gap-2 mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <span>{blog.readTime}</span>
            <span>•</span>
            <span>❤️ {likeCount}</span>
          </div>
        </div>
      </div>
    );
  }

  // ===== DEFAULT CARD =====
  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
        isHovered ? 'shadow-xl shadow-orange-500/10 -translate-y-1' : 'shadow-md'
      } ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
            isDark ? 'bg-black/40 text-white' : 'bg-white/80 text-gray-800'
          }`}>
            {blog.category}
          </span>
        </div>
        {blog.isPremium && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-linear-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
            👑 PRO
          </div>
        )}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
          📖 {blog.readTime}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={`font-bold text-base mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors leading-tight ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {blog.title}
        </h3>
        <p className={`text-sm line-clamp-2 mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {blog.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
              {blog.author.charAt(0)}
            </div>
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{blog.author}</p>
              <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{blog.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLike} className={`flex items-center gap-0.5 text-xs transition-all ${
              liked ? 'text-red-500 scale-110' : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {liked ? '❤️' : '🤍'} {likeCount}
            </button>
            <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>👁 {blog.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
