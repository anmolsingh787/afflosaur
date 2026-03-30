// ==========================================
// Afflosaur - Write / Create Blog Page
// Simple Notion-style editor
// ==========================================

import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { BlogPost } from '../types';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { upsertBlogPost } from '../lib/adminApi';

export function WritePage() {
  const { theme, isLoggedIn, login, setPage, blogPosts, setBlogPosts, showNotification } = useApp();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('blog');
  const [tags, setTags] = useState('');

  if (!isLoggedIn) {
    return (
      <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <span className="text-5xl">✍️</span>
        <h2 className={`mt-4 text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Login to Start Writing
        </h2>
        <p className={`mt-2 text-sm max-w-sm mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Share your reviews, deals, and product experiences with the DealDino community!
        </p>
        <button
          onClick={login}
          className="mt-4 px-6 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      showNotification('Please add a title and content!');
      return;
    }

    const newPost: BlogPost = {
      id: `b${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      content,
      excerpt: content.slice(0, 120) + '...',
      author: 'Demo User',
      authorAvatar: '🦖',
      category,
      tags: tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      likes: 0,
      comments: [],
      isApproved: false, // Needs admin approval
      createdAt: new Date().toISOString().split('T')[0],
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=300&fit=crop',
    };

    setBlogPosts([newPost, ...blogPosts]);
    if (isSupabaseConfigured) {
      upsertBlogPost({
        id: newPost.id,
        title: newPost.title,
        slug: newPost.slug,
        content: newPost.content,
        excerpt: newPost.excerpt,
        cover_image: newPost.image,
        author_id: newPost.author,
        category: newPost.category,
        tags: newPost.tags,
        is_approved: newPost.isApproved,
        views: newPost.views || 0,
      } as any).catch(() => undefined);
    }
    showNotification('Post submitted for review! 🎉');
    setPage('blog');
  };

  const categories: { value: BlogPost['category']; label: string }[] = [
    { value: 'review', label: '⭐ Product Review' },
    { value: 'top10', label: '🏆 Top 10 List' },
    { value: 'comparison', label: '⚔️ Comparison' },
    { value: 'blog', label: '📝 Blog Post' },
    { value: 'deal', label: '💰 Deal Alert' },
  ];

  const templates = [
    { label: '📱 Product Review', text: '## Overview\n\nBrief intro about the product...\n\n## Design & Build\n\nTalk about how it looks and feels...\n\n## Performance\n\nHow does it actually work?\n\n## Battery / Durability\n\nHow long does it last?\n\n## Pros\n- Pro 1\n- Pro 2\n\n## Cons\n- Con 1\n\n## Final Verdict\n\nYour overall opinion and rating out of 10.' },
    { label: '🏆 Top 10 List', text: '## 1. Product Name\nDescription and why it\'s great...\n\n## 2. Product Name\nDescription...\n\n## 3. Product Name\nDescription...\n\n## Our Pick\nWhich one we recommend and why.' },
    { label: '⚔️ Comparison', text: '## Product A vs Product B\n\nQuick intro...\n\n## Design\n- **Product A**: Description\n- **Product B**: Description\n\n## Performance\n- **Product A**: Description\n- **Product B**: Description\n\n## Price\n- **Product A**: ₹2,499\n- **Product B**: ₹3,299\n\n## Winner\nOur pick and why.' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => setPage('blog')}
        className={`flex items-center gap-1.5 text-sm font-medium ${
          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className={`rounded-2xl p-5 sm:p-8 ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ✍️ Write a Post
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Share your thoughts with the Afflosaur community
        </p>

        {/* Templates */}
        <div className="mt-4">
          <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Quick Templates:
          </p>
          <div className="flex gap-2 flex-wrap">
            {templates.map(tpl => (
              <button
                key={tpl.label}
                onClick={() => setContent(tpl.text)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mt-6">
          <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Category
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white'
                    : isDark
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="mt-6">
          <input
            type="text"
            id="post-title"
            name="title"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full text-xl sm:text-2xl font-bold outline-none bg-transparent ${
              isDark ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-300'
            }`}
          />
        </div>

        {/* Content */}
        <div className="mt-4">
          <textarea
            placeholder="Start writing... (Use ## for headings, - for lists, **bold** for emphasis)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className={`w-full outline-none bg-transparent text-sm leading-relaxed resize-none ${
              isDark ? 'text-gray-300 placeholder:text-gray-600' : 'text-gray-700 placeholder:text-gray-300'
            }`}
          />
        </div>

        {/* Tags */}
        <div className="mt-4">
          <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="post-tags"
            name="tags"
            placeholder="e.g., review, headphones, budget, under1000"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={`w-full mt-2 px-4 py-2.5 rounded-xl outline-none text-sm ${
              isDark ? 'bg-gray-700 text-white placeholder:text-gray-500' : 'bg-gray-50 text-gray-900 placeholder:text-gray-400'
            }`}
          />
        </div>

        {/* Publish */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handlePublish}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            Submit for Review
          </button>
        </div>
        <p className={`text-xs text-center mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Posts are reviewed by admin before publishing
        </p>
      </div>
    </div>
  );
}
