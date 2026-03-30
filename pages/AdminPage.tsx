// ==========================================
// Afflosaur - Mobile-First Admin Dashboard
// Fully responsive, touch-friendly admin panel
// ==========================================

import { useEffect, useState, useRef } from 'react';
import {
  Package, FileText, Users, BarChart3, TrendingUp, Eye, MousePointer, ShoppingCart,
  Check, X, Star, AlertTriangle, Plus, Edit3, Trash2, Save, Camera, Upload,
  Home, Settings, Shield, Bell, Search, Filter, ChevronDown, ChevronUp,
  Menu, X as CloseIcon, Lock, Unlock, Crown, UserCheck, UserX, Clock,
  Zap, Target, Award, DollarSign, Activity, Globe, Image as ImageIcon,
  Type, Link, Calendar, TrendingDown, MessageSquare, ToggleLeft, ToggleRight,
  Heart, ThumbsUp, Share, ExternalLink, Copy, RefreshCw, Wifi, WifiOff,
  Megaphone, MonitorOff, Layers, Send
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../context/AppContext';
import { isAdminEmail } from '../config/adminAccess';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import {
  fetchAffiliates,
  fetchAuditLogs,
  upsertAffiliate,
  upsertSponsorBanner,
  upsertSponsorPopup,
  createAuditLog,
  fetchProducts,
  upsertProduct,
  fetchBlogPosts,
  upsertBlogPost,
  fetchCoinUsers,
  updateCoinUser,
  deleteProduct,
  deleteBlogPost,
  deleteCoinUser,
} from '../lib/adminApi';

type ProductCategory = 'electronics' | 'fashion' | 'home' | 'books' | 'sports' | 'beauty' | 'toys' | 'automotive';
type ProductType = 'affiliate' | 'direct';
type ProductStatus = 'available' | 'out-of-stock' | 'coming-soon' | 'hidden';
type BlogStatus = 'draft' | 'published' | 'hidden';
type UserStatus = 'active' | 'banned' | 'suspended';

export function AdminPage() {
  const {
    theme,
    products,
    setProducts,
    blogPosts,
    setBlogPosts,
    sponsorBanners,
    setSponsorBanners,
    sponsorPopups,
    setSponsorPopups,
    isLoggedIn,
    user,
    showNotification,
    setPage
  } = useApp();
  const isDark = theme === 'dark';
  const [activeSection, setActiveSection] = useState<'dashboard' | 'products' | 'blogs' | 'users' | 'affiliates' | 'banners' | 'analytics' | 'security' | 'controls' | 'popups'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Data states
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [coinUsers, setCoinUsers] = useState<any[]>([]);

  // Search states
  const [productSearch, setProductSearch] = useState('');
  const [blogSearch, setBlogSearch] = useState('');

  // Site controls
  const [siteControls, setSiteControls] = useState({
    maintenanceMode: false,
    dealsEnabled: true,
    blogsEnabled: true,
    coinsEnabled: true,
    adsEnabled: true,
    popupsEnabled: true,
    registrationEnabled: true,
    reviewsEnabled: true,
  });
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Popup form
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editingPopup, setEditingPopup] = useState<any>(null);
  const [popupForm, setPopupForm] = useState({
    title: '',
    image: '',
    link: '',
    delay: 3,
    status: 'active'
  });

  // Form states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [showAddAffiliate, setShowAddAffiliate] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<any>(null);
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  // Form data
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    highlights: [''],
    image: '',
    category: 'electronics' as ProductCategory,
    type: 'affiliate' as ProductType,
    status: 'available' as ProductStatus,
    price: 0,
    originalPrice: 0,
    affiliateLink: '',
    stock: 0
  });

  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'review',
    tags: [''],
    coverImage: '',
    status: 'draft' as BlogStatus,
    seoTitle: '',
    seoDescription: ''
  });

  const [affiliateForm, setAffiliateForm] = useState({
    platform: '',
    link: '',
    commission: 0,
    status: 'active'
  });

  const [bannerForm, setBannerForm] = useState({
    title: '',
    image: '',
    link: '',
    position: 'top',
    status: 'active'
  });

  const isAllowedAdmin = Boolean(isLoggedIn && user?.role === 'admin' && isAdminEmail(user?.email));

  // Redirect to auth if not allowed admin
  useEffect(() => {
    if (!isAllowedAdmin) {
      setPage('auth');
    }
  }, [isAllowedAdmin, setPage]);

  // Mobile navigation sections
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-500' },
    { id: 'products', label: 'Products', icon: Package, color: 'text-green-500' },
    { id: 'blogs', label: 'Blogs', icon: FileText, color: 'text-purple-500' },
    { id: 'users', label: 'Users', icon: Users, color: 'text-orange-500' },
    { id: 'affiliates', label: 'Affiliates', icon: Link, color: 'text-pink-500' },
    { id: 'banners', label: 'Banners', icon: ImageIcon, color: 'text-indigo-500' },
    { id: 'popups', label: 'Popups', icon: Layers, color: 'text-cyan-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart, color: 'text-teal-500' },
    { id: 'controls', label: 'Controls', icon: Settings, color: 'text-amber-500' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-red-500' }
  ] as const;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isAllowedAdmin || !isSupabaseConfigured) return;
    const loadAdminData = async () => {
      try {
        const [affiliatesData, auditData, productsData, blogsData, coinsData] = await Promise.all([
          fetchAffiliates(),
          fetchAuditLogs(),
          fetchProducts(),
          fetchBlogPosts(),
          fetchCoinUsers(),
        ]);
        if (affiliatesData.length > 0) setAffiliates(affiliatesData);
        if (auditData.length > 0) setAuditLogs(auditData);
        if (productsData.length > 0) setProducts(productsData);
        if (blogsData.length > 0) {
          setBlogPosts(
            blogsData.map((r) => ({
              id: r.id,
              title: r.title,
              slug: r.slug,
              content: r.content,
              excerpt: r.excerpt,
              author: r.author_id,
              authorAvatar: '',
              category: r.category as any,
              tags: r.tags || [],
              likes: r.likes,
              comments: [],
              isApproved: r.is_approved,
              createdAt: r.created_at,
              image: r.cover_image,
              views: r.views || 0,
            }))
          );
        }
        if (coinsData.length > 0) {
          setCoinUsers(
            coinsData.map(c => ({
              id: c.user_id,
              name: c.user_id,
              email: '',
              coins: c.balance,
              status: 'active'
            }))
          );
        }
      } catch {
        // keep mock data fallback
      }
    };
    loadAdminData();
  }, [isAllowedAdmin]);

  // Dashboard stats
  const dashboardStats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-blue-500 bg-blue-500/10',
      trend: '+12%'
    },
    {
      label: 'Active Deals',
      value: products.filter(p => p.status === 'available').length,
      icon: ShoppingCart,
      color: 'text-green-500 bg-green-500/10',
      trend: '+8%'
    },
    {
      label: 'Pending Blogs',
      value: blogPosts.filter(b => !b.isApproved).length,
      icon: FileText,
      color: 'text-purple-500 bg-purple-500/10',
      trend: '3 new'
    },
    {
      label: 'Total Coins',
      value: coinUsers.reduce((sum, u) => sum + u.coins, 0),
      icon: Star,
      color: 'text-yellow-500 bg-yellow-500/10',
      trend: '+156'
    }
  ];

  // Quick actions for dashboard
  const quickActions = [
    {
      label: 'Add Product',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        setProductForm({
          title: '',
          description: '',
          highlights: [''],
          image: '',
          category: 'electronics',
          type: 'affiliate',
          status: 'available',
          price: 0,
          originalPrice: 0,
          affiliateLink: '',
          stock: 0
        });
        setShowAddProduct(true);
      }
    },
    {
      label: 'Write Blog',
      icon: Edit3,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {
        setBlogForm({
          title: '',
          content: '',
          excerpt: '',
          category: 'review',
          tags: [''],
          coverImage: '',
          status: 'draft',
          seoTitle: '',
          seoDescription: ''
        });
        setShowAddBlog(true);
      }
    },
    {
      label: 'Add Affiliate',
      icon: Link,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        setAffiliateForm({
          platform: '',
          link: '',
          commission: 0,
          status: 'active'
        });
        setShowAddAffiliate(true);
      }
    },
    {
      label: 'View Analytics',
      icon: BarChart3,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => setActiveSection('analytics')
    }
  ];

  // Mobile header component
  const MobileHeader = () => (
    <div className={`sticky top-0 z-50 p-4 border-b ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {mobileMenuOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Admin Panel
            </h1>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-3 h-3 text-green-500" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className={`p-2 rounded-xl relative ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile bottom navigation
  const MobileBottomNav = () => (
    <div className={`fixed bottom-0 left-0 right-0 z-50 border-t ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-around py-2 px-2">
        {sections.slice(0, 5).map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive
                  ? `${section.color} /10`
                  : `${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{section.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs mt-1 font-medium">More</span>
        </button>
      </div>
    </div>
  );

  // Mobile menu overlay
  const MobileMenu = () => (
    <div className={`fixed inset-0 z-50 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      <div className={`absolute z-10 right-0 top-0 bottom-0 w-80 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Menu
            </h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-xl ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActive
                      ? `${section.color} ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`
                      : `${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <MobileHeader />
      <MobileMenu />

      <div className="pb-20">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className="p-4 space-y-6">
            {/* Welcome Card */}
            <div className={`p-6 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Welcome back, Admin! 👋
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Here's what's happening today
                  </p>
                </div>
                <Crown className="w-8 h-8 text-yellow-500" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {dashboardStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-6 h-6 ${stat.color.split(' ')[0]}`} />
                        <span className="text-xs text-green-500 font-medium">{stat.trend}</span>
                      </div>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {stat.value.toLocaleString()}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`p-4 rounded-2xl text-white font-medium transition-all transform hover:scale-105 ${action.color}`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`p-6 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {auditLogs.slice(0, 5).map((log, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <Activity className="w-5 h-5 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {log.action}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        {activeSection === 'products' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Products ({products.length})
              </h2>
              <button
                onClick={() => {
                  setProductForm({
                    title: '',
                    description: '',
                    highlights: [''],
                    image: '',
                    category: 'electronics',
                    type: 'affiliate',
                    status: 'available',
                    price: 0,
                    originalPrice: 0,
                    affiliateLink: '',
                    stock: 0
                  });
                  setShowAddProduct(true);
                }}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl font-medium transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <Search className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
              />
              {productSearch && <button onClick={() => setProductSearch('')}><CloseIcon className="w-4 h-4 text-gray-400" /></button>}
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['all','available','out-of-stock','coming-soon','hidden'].map(f => (
                <button key={f} onClick={() => setProductSearch(f === 'all' ? '' : f)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    (f === 'all' && !productSearch) || productSearch === f
                      ? 'bg-green-500 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {f.charAt(0).toUpperCase() + f.slice(1).replace('-',' ')}
                </button>
              ))}
            </div>

            {/* Products List */}
            <div className="space-y-3">
              {products.filter(p =>
                p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
                p.status?.toLowerCase().includes(productSearch.toLowerCase()) ||
                p.category?.toLowerCase().includes(productSearch.toLowerCase())
              ).map((product) => (
                <div key={product.id} className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={product.image || '/placeholder.jpg'}
                      alt={product.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {product.title}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        ₹{product.price} • {product.category}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setProductForm({
                            title: product.title,
                            description: product.description,
                            highlights: product.highlights || [''],
                            image: product.image,
                            category: product.category,
                            type: product.type,
                            status: product.status,
                            price: product.price,
                            originalPrice: product.originalPrice || 0,
                            affiliateLink: product.affiliateLink || '',
                            stock: product.stock || 0
                          });
                          setShowAddProduct(true);
                        }}
                        className={`p-2 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this product?')) {
                            setProducts(products.filter(p => p.id !== product.id));
                            if (isSupabaseConfigured) {
                              deleteProduct(product.id);
                              if (user?.email) {
                                createAuditLog({
                                  actorEmail: user.email,
                                  action: `Deleted product ${product.title}`,
                                  entityType: 'product',
                                  entityId: product.id,
                                });
                              }
                            }
                          }
                        }}
                        className="p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.status === 'available' ? 'bg-green-500/10 text-green-500' :
                      product.status === 'out-of-stock' ? 'bg-red-500/10 text-red-500' :
                      product.status === 'coming-soon' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {product.status}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleTrending(product.id)}
                        className={`p-1 rounded ${product.isTrending ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                      >
                        <TrendingUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`p-1 rounded ${product.isFeatured ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                      >
                        <Star className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Section */}
        {activeSection === 'blogs' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Blogs ({blogPosts.length})
              </h2>
              <button
                onClick={() => {
                  setBlogForm({
                    title: '',
                    content: '',
                    excerpt: '',
                    category: 'review',
                    tags: [''],
                    coverImage: '',
                    status: 'draft',
                    seoTitle: '',
                    seoDescription: ''
                  });
                  setShowAddBlog(true);
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-xl font-medium transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <Search className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search blogs..."
                value={blogSearch}
                onChange={e => setBlogSearch(e.target.value)}
                className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
              />
              {blogSearch && <button onClick={() => setBlogSearch('')}><CloseIcon className="w-4 h-4 text-gray-400" /></button>}
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['all','published','draft','pending'].map(f => (
                <button key={f} onClick={() => setBlogSearch(f === 'all' ? '' : f)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    (f === 'all' && !blogSearch) || blogSearch === f
                      ? 'bg-purple-500 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Blogs List */}
            <div className="space-y-3">
              {blogPosts.filter(b =>
                b.title?.toLowerCase().includes(blogSearch.toLowerCase()) ||
                b.category?.toLowerCase().includes(blogSearch.toLowerCase()) ||
                (blogSearch === 'published' && b.isApproved) ||
                (blogSearch === 'draft' && !b.isApproved) ||
                (blogSearch === 'pending' && !b.isApproved)
              ).map((blog) => (
                <div key={blog.id} className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={blog.image || '/placeholder.jpg'}
                      alt={blog.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {blog.title}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {blog.category} • {blog.likes} likes • {blog.views} views
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!blog.isApproved && (
                        <button
                          onClick={() => {
                            setBlogPosts(blogPosts.map(b => b.id === blog.id ? { ...b, isApproved: true } : b));
                            showNotification('Blog approved! ✅');
                          }}
                          className="p-2 rounded-xl bg-green-500 hover:bg-green-600 text-white"
                          title="Approve"
                        ><Check className="w-4 h-4" /></button>
                      )}
                      {blog.isApproved && (
                        <button
                          onClick={() => {
                            setBlogPosts(blogPosts.map(b => b.id === blog.id ? { ...b, isApproved: false } : b));
                            showNotification('Blog unpublished');
                          }}
                          className="p-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white"
                          title="Unpublish"
                        ><X className="w-4 h-4" /></button>
                      )}
                      <button
                        onClick={() => {
                          setEditingBlog(blog);
                          setBlogForm({
                            title: blog.title,
                            content: blog.content,
                            excerpt: blog.excerpt,
                            category: blog.category,
                            tags: blog.tags,
                            coverImage: blog.image,
                            status: blog.isApproved ? 'published' : 'draft',
                            seoTitle: blog.title,
                            seoDescription: blog.excerpt
                          });
                          setShowAddBlog(true);
                        }}
                        className={`p-2 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this blog?')) {
                            setBlogPosts(blogPosts.filter(b => b.id !== blog.id));
                            if (isSupabaseConfigured) {
                              deleteBlogPost(blog.id);
                              if (user?.email) {
                                createAuditLog({
                                  actorEmail: user.email,
                                  action: `Deleted blog ${blog.title}`,
                                  entityType: 'blog',
                                  entityId: blog.id,
                                });
                              }
                            }
                          }
                        }}
                        className="p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      blog.isApproved ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {blog.isApproved ? 'Published' : 'Draft'}
                    </span>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Section */}
        {activeSection === 'users' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Users ({coinUsers.length})
              </h2>
            </div>

            {/* Users List */}
            <div className="space-y-3">
              {coinUsers.map((user) => (
                <div key={user.id} className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.coins} coins
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newCoins = prompt('Enter new coin balance:', user.coins.toString());
                          if (newCoins && !isNaN(Number(newCoins))) {
                            const updatedUsers = coinUsers.map(u =>
                              u.id === user.id ? { ...u, coins: Number(newCoins) } : u
                            );
                            setCoinUsers(updatedUsers);
                            if (isSupabaseConfigured) {
                              updateCoinUser(user.id, Number(newCoins));
                              if (user?.email) {
                                createAuditLog({
                                  actorEmail: user.email,
                                  action: `Updated coins for user ${user.name} to ${newCoins}`,
                                  entityType: 'user',
                                  entityId: user.id,
                                });
                              }
                            }
                          }
                        }}
                        className={`p-2 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newStatus = user.status === 'active' ? 'banned' : 'active';
                          const updatedUsers = coinUsers.map(u =>
                            u.id === user.id ? { ...u, status: newStatus } : u
                          );
                          setCoinUsers(updatedUsers);
                          showNotification(`User ${newStatus === 'banned' ? 'banned' : 'unbanned'}`);
                        }}
                        className={`p-2 rounded-xl ${
                          user.status === 'active'
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                        } text-white`}
                      >
                        {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.status === 'active' ? 'bg-green-500/10 text-green-500' :
                      user.status === 'banned' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <div className="p-4 space-y-6">
            <div className={`p-6 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Key Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Revenue', value: '₹1.2L', change: '+12%' },
                  { label: 'Clicks', value: '12.4K', change: '+8%' },
                  { label: 'Conversion', value: '4.1%', change: '+2%' },
                  { label: 'Users', value: '2.1K', change: '+15%' },
                ].map((m) => (
                  <div key={m.label} className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{m.label}</p>
                    <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{m.value}</p>
                    <p className="text-xs text-green-500">{m.change}</p>
                  </div>
                ))}
              </div>

              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Traffic Trends
              </h3>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { day: 'Mon', views: 1200, clicks: 240 },
                    { day: 'Tue', views: 1400, clicks: 280 },
                    { day: 'Wed', views: 1100, clicks: 220 },
                    { day: 'Thu', views: 1600, clicks: 320 },
                    { day: 'Fri', views: 1800, clicks: 360 },
                    { day: 'Sat', views: 2000, clicks: 400 },
                    { day: 'Sun', views: 1700, clicks: 340 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="day" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <div className="p-4 space-y-6">
            <div className={`p-6 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Security Settings
              </h3>

              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Two-Factor Authentication
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Add an extra layer of security
                      </p>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium">
                      Enable 2FA
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Session Management
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Auto-logout after inactivity
                      </p>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      30 minutes
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Audit Logs
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        All admin actions are logged
                      </p>
                    </div>
                    <span className="text-green-500 text-sm font-medium">
                      {auditLogs.length} entries
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Audit Logs */}
            <div className={`p-6 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {auditLogs.slice(0, 10).map((log, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <Shield className="w-5 h-5 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {log.action}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {log.actorEmail} • {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Affiliates Section */}
        {activeSection === 'affiliates' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Affiliates ({affiliates.length})
              </h2>
              <button
                onClick={() => {
                  setAffiliateForm({ platform: '', link: '', commission: 0, status: 'active' });
                  setEditingAffiliate(null);
                  setShowAddAffiliate(true);
                }}
                className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {affiliates.length === 0 ? (
                <div className={`p-8 rounded-2xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <Link className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No affiliates yet. Add one!</p>
                </div>
              ) : affiliates.map((aff: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{aff.platform}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{aff.commission}% commission</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingAffiliate(aff); setAffiliateForm({ platform: aff.platform, link: aff.link, commission: aff.commission, status: aff.status }); setShowAddAffiliate(true); }}
                        className={`p-2 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      ><Edit3 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banners Section */}
        {activeSection === 'banners' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Banners ({sponsorBanners.length})
              </h2>
              <button
                onClick={() => {
                  setBannerForm({ title: '', image: '', link: '', position: 'top', status: 'active' });
                  setEditingBanner(null);
                  setShowAddBanner(true);
                }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-xl"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {sponsorBanners.length === 0 ? (
                <div className={`p-8 rounded-2xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <ImageIcon className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No banners yet. Add one!</p>
                </div>
              ) : sponsorBanners.map((banner: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {banner.image && <img src={banner.image} alt={banner.title} className="w-12 h-12 rounded-xl object-cover" />}
                      <div>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{banner.title}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{banner.position} • {banner.status}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setEditingBanner(banner); setBannerForm({ title: banner.title, image: banner.image, link: banner.link, position: banner.position, status: banner.status }); setShowAddBanner(true); }}
                      className={`p-2 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    ><Edit3 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popups Section */}
        {activeSection === 'popups' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Ad Popups ({sponsorPopups.length})
              </h2>
              <button
                onClick={() => { setPopupForm({ title: '', image: '', link: '', delay: 3, status: 'active' }); setEditingPopup(null); setShowAddPopup(true); }}
                className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-xl"
              ><Plus className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {sponsorPopups.length === 0 ? (
                <div className={`p-8 rounded-2xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <Layers className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No popups yet. Add one!</p>
                </div>
              ) : sponsorPopups.map((popup: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {popup.image && <img src={popup.image} alt={popup.title} className="w-12 h-12 rounded-xl object-cover" />}
                      <div>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{popup.title}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Delay: {popup.delay}s • {popup.status}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setEditingPopup(popup); setPopupForm({ title: popup.title, image: popup.image, link: popup.link, delay: popup.delay || 3, status: popup.status }); setShowAddPopup(true); }}
                      className={`p-2 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    ><Edit3 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls Section */}
        {activeSection === 'controls' && (
          <div className="p-4 space-y-4">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Site Controls</h2>

            {/* Feature Toggles */}
            <div className={`p-5 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-1`}>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Feature Toggles</h3>
              {([
                { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance page to visitors', icon: MonitorOff, danger: true },
                { key: 'dealsEnabled', label: 'Deals Section', desc: 'Show/hide the deals section', icon: ShoppingCart },
                { key: 'blogsEnabled', label: 'Blog Section', desc: 'Allow users to read blogs', icon: FileText },
                { key: 'coinsEnabled', label: 'Coin System', desc: 'Enable Afflo Coins & rewards', icon: Star },
                { key: 'adsEnabled', label: 'Ad Banners', desc: 'Display sponsor banners', icon: ImageIcon },
                { key: 'popupsEnabled', label: 'Ad Popups', desc: 'Show popup advertisements', icon: Layers },
                { key: 'registrationEnabled', label: 'User Registration', desc: 'Allow new user signups', icon: UserCheck },
                { key: 'reviewsEnabled', label: 'User Reviews', desc: 'Allow product reviews', icon: MessageSquare },
              ] as Array<{key: keyof typeof siteControls, label: string, desc: string, icon: any, danger?: boolean}>).map(({ key, label, desc, icon: Icon, danger }) => (
                <div key={key} className={`flex items-center justify-between py-3 border-b last:border-0 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${ danger ? 'bg-red-500/10' : isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <Icon className={`w-4 h-4 ${danger ? 'text-red-500' : isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${danger ? 'text-red-500' : isDark ? 'text-white' : 'text-gray-900'}`}>{label}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSiteControls(prev => ({...prev, [key]: !prev[key]}));
                      showNotification(`${label} ${!siteControls[key] ? 'enabled' : 'disabled'}`);
                    }}
                    className="transition-transform active:scale-90"
                  >
                    {siteControls[key]
                      ? <ToggleRight className={`w-8 h-8 ${danger ? 'text-red-500' : 'text-green-500'}`} />
                      : <ToggleLeft className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />}
                  </button>
                </div>
              ))}
            </div>

            {/* Broadcast Notification */}
            <div className={`p-5 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="w-5 h-5 text-amber-500" />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Broadcast Notification</h3>
              </div>
              <textarea
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="Type a message to broadcast to all users..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border mb-3 text-sm resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
              />
              <button
                onClick={() => {
                  if (broadcastMessage.trim()) {
                    showNotification(`📢 Broadcast sent: "${broadcastMessage.slice(0,40)}..."`);
                    setBroadcastMessage('');
                  }
                }}
                disabled={!broadcastMessage.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-semibold rounded-xl transition-all"
              >
                <Send className="w-4 h-4" /> Send Broadcast
              </button>
            </div>

            {/* Danger Zone */}
            <div className={`p-5 rounded-3xl border-2 border-red-500/30 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-red-500">Danger Zone</h3>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => { if (confirm('Clear all audit logs? This cannot be undone.')) { setAuditLogs([]); showNotification('Audit logs cleared'); } }}
                  className="w-full py-3 border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-all"
                >Clear Audit Logs</button>
                <button
                  onClick={() => { if (confirm('Reset all coin balances to 0? This cannot be undone.')) { setCoinUsers(prev => prev.map(u => ({...u, coins: 0}))); showNotification('All coin balances reset'); } }}
                  className="w-full py-3 border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-all"
                >Reset All Coin Balances</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <MobileBottomNav />

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddProduct(false)} />
          <div className={`relative z-10 w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h3>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className={`p-2 rounded-xl ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Product Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      className={`flex-1 px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                    <button className={`p-3 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="Product title"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    rows={3}
                    placeholder="Product description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Price
                    </label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Original Price
                    </label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({...productForm, originalPrice: Number(e.target.value)})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value as ProductCategory})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home</option>
                    <option value="books">Books</option>
                    <option value="sports">Sports</option>
                    <option value="beauty">Beauty</option>
                    <option value="toys">Toys</option>
                    <option value="automotive">Automotive</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({...productForm, status: e.target.value as ProductStatus})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="available">Available</option>
                    <option value="out-of-stock">Out of Stock</option>
                    <option value="coming-soon">Coming Soon</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddProduct(false)}
                    className={`flex-1 py-3 rounded-xl font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle save
                      if (editingProduct) {
                        // Update existing product
                        const updatedProducts = products.map(p =>
                          p.id === editingProduct.id
                            ? { ...p, ...productForm }
                            : p
                        );
                        setProducts(updatedProducts);
                        if (isSupabaseConfigured) {
                          upsertProduct({ ...editingProduct, ...productForm });
                          if (user?.email) {
                            createAuditLog({
                              actorEmail: user.email,
                              action: `Updated product ${productForm.title}`,
                              entityType: 'product',
                              entityId: editingProduct.id,
                            });
                          }
                        }
                      } else {
                        // Add new product
                        const newProduct = {
                          id: Date.now().toString(),
                          ...productForm,
                          createdAt: new Date().toISOString(),
                          isTrending: false,
                          isFeatured: false,
                          views: 0,
                          clicks: 0
                        };
                        setProducts([...products, newProduct]);
                        if (isSupabaseConfigured) {
                          upsertProduct(newProduct);
                          if (user?.email) {
                            createAuditLog({
                              actorEmail: user.email,
                              action: `Added new product ${productForm.title}`,
                              entityType: 'product',
                              entityId: newProduct.id,
                            });
                          }
                        }
                      }
                      setShowAddProduct(false);
                      setEditingProduct(null);
                      showNotification(`${editingProduct ? 'Updated' : 'Added'} product successfully!`);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium"
                  >
                    {editingProduct ? 'Update' : 'Add'} Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Blog Modal */}
      {showAddBlog && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddBlog(false)} />
          <div className={`relative z-10 w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editingBlog ? 'Edit Blog' : 'Add Blog'}
                </h3>
                <button
                  onClick={() => setShowAddBlog(false)}
                  className={`p-2 rounded-xl ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Cover Image
                  </label>
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={blogForm.coverImage}
                    onChange={(e) => setBlogForm({...blogForm, coverImage: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="Blog title"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Excerpt
                  </label>
                  <textarea
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    rows={2}
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Content
                  </label>
                  <textarea
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    rows={6}
                    placeholder="Blog content (Markdown supported)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category
                    </label>
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="review">Review</option>
                      <option value="guide">Guide</option>
                      <option value="news">News</option>
                      <option value="comparison">Comparison</option>
                      <option value="tips">Tips</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <select
                      value={blogForm.status}
                      onChange={(e) => setBlogForm({...blogForm, status: e.target.value as BlogStatus})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddBlog(false)}
                    className={`flex-1 py-3 rounded-xl font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle save
                      if (editingBlog) {
                        // Update existing blog
                        const updatedBlogs = blogPosts.map(b =>
                          b.id === editingBlog.id
                            ? { ...b, ...blogForm, isApproved: blogForm.status === 'published' }
                            : b
                        );
                        setBlogPosts(updatedBlogs);
                        if (isSupabaseConfigured) {
                          upsertBlogPost({ ...editingBlog, ...blogForm, is_approved: blogForm.status === 'published' });
                          if (user?.email) {
                            createAuditLog({
                              actorEmail: user.email,
                              action: `Updated blog ${blogForm.title}`,
                              entityType: 'blog',
                              entityId: editingBlog.id,
                            });
                          }
                        }
                      } else {
                        // Add new blog
                        const newBlog = {
                          id: Date.now().toString(),
                          ...blogForm,
                          author: user?.email || 'admin',
                          authorAvatar: '',
                          likes: 0,
                          comments: [],
                          isApproved: blogForm.status === 'published',
                          createdAt: new Date().toISOString(),
                          views: 0,
                          image: blogForm.coverImage,
                          tags: blogForm.tags.filter(t => t.trim())
                        };
                        setBlogPosts([...blogPosts, newBlog]);
                        if (isSupabaseConfigured) {
                          upsertBlogPost({
                            ...newBlog,
                            author_id: user?.email || 'admin',
                            slug: blogForm.title.toLowerCase().replace(/\s+/g, '-'),
                            is_approved: blogForm.status === 'published'
                          });
                          if (user?.email) {
                            createAuditLog({
                              actorEmail: user.email,
                              action: `Added new blog ${blogForm.title}`,
                              entityType: 'blog',
                              entityId: newBlog.id,
                            });
                          }
                        }
                      }
                      setShowAddBlog(false);
                      setEditingBlog(null);
                      showNotification(`${editingBlog ? 'Updated' : 'Added'} blog successfully!`);
                    }}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-medium"
                  >
                    {editingBlog ? 'Update' : 'Add'} Blog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Affiliate Modal */}
      {showAddAffiliate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddAffiliate(false)} />
          <div className={`relative z-10 w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editingAffiliate ? 'Edit Affiliate' : 'Add Affiliate'}
                </h3>
                <button onClick={() => setShowAddAffiliate(false)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Platform Name</label>
                  <input type="text" value={affiliateForm.platform} onChange={e => setAffiliateForm({...affiliateForm, platform: e.target.value})}
                    placeholder="e.g. Amazon, Flipkart"
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Affiliate Link</label>
                  <input type="url" value={affiliateForm.link} onChange={e => setAffiliateForm({...affiliateForm, link: e.target.value})}
                    placeholder="https://..."
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Commission (%)</label>
                  <input type="number" value={affiliateForm.commission} onChange={e => setAffiliateForm({...affiliateForm, commission: Number(e.target.value)})}
                    placeholder="0"
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <select value={affiliateForm.status} onChange={e => setAffiliateForm({...affiliateForm, status: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowAddAffiliate(false)}
                    className={`flex-1 py-3 rounded-xl font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const newAff = { id: Date.now().toString(), ...affiliateForm };
                      if (editingAffiliate) {
                        setAffiliates(affiliates.map((a: any) => a.id === editingAffiliate.id ? { ...a, ...affiliateForm } : a));
                        if (isSupabaseConfigured) { upsertAffiliate({ ...editingAffiliate, ...affiliateForm }); }
                      } else {
                        setAffiliates([...affiliates, newAff]);
                        if (isSupabaseConfigured) { upsertAffiliate(newAff); }
                      }
                      setShowAddAffiliate(false);
                      setEditingAffiliate(null);
                      showNotification(`${editingAffiliate ? 'Updated' : 'Added'} affiliate successfully!`);
                    }}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-medium">
                    {editingAffiliate ? 'Update' : 'Add'} Affiliate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Banner Modal */}
      {showAddBanner && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddBanner(false)} />
          <div className={`relative z-10 w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editingBanner ? 'Edit Banner' : 'Add Banner'}
                </h3>
                <button onClick={() => setShowAddBanner(false)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Banner Title</label>
                  <input type="text" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})}
                    placeholder="Banner title"
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Image URL</label>
                  <input type="url" value={bannerForm.image} onChange={e => setBannerForm({...bannerForm, image: e.target.value})}
                    placeholder="https://..."
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Link URL</label>
                  <input type="url" value={bannerForm.link} onChange={e => setBannerForm({...bannerForm, link: e.target.value})}
                    placeholder="https://..."
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Position</label>
                    <select value={bannerForm.position} onChange={e => setBannerForm({...bannerForm, position: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                      <option value="top">Top</option>
                      <option value="middle">Middle</option>
                      <option value="bottom">Bottom</option>
                      <option value="sidebar">Sidebar</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                    <select value={bannerForm.status} onChange={e => setBannerForm({...bannerForm, status: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowAddBanner(false)}
                    className={`flex-1 py-3 rounded-xl font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const newBanner = { id: Date.now().toString(), ...bannerForm };
                      if (editingBanner) {
                        setSponsorBanners(sponsorBanners.map((b: any) => b.id === editingBanner.id ? { ...b, ...bannerForm } : b));
                        if (isSupabaseConfigured) { upsertSponsorBanner({ ...editingBanner, ...bannerForm }); }
                      } else {
                        setSponsorBanners([...sponsorBanners, newBanner]);
                        if (isSupabaseConfigured) { upsertSponsorBanner(newBanner); }
                      }
                      setShowAddBanner(false);
                      setEditingBanner(null);
                      showNotification(`${editingBanner ? 'Updated' : 'Added'} banner successfully!`);
                    }}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-medium">
                    {editingBanner ? 'Update' : 'Add'} Banner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Popup Modal */}
      {showAddPopup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddPopup(false)} />
          <div className={`relative z-10 w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editingPopup ? 'Edit Popup' : 'Add Popup'}
                </h3>
                <button onClick={() => setShowAddPopup(false)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Popup Title</label>
                  <input type="text" value={popupForm.title} onChange={e => setPopupForm({...popupForm, title: e.target.value})}
                    placeholder="Popup title"
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Image URL</label>
                  <input type="url" value={popupForm.image} onChange={e => setPopupForm({...popupForm, image: e.target.value})}
                    placeholder="https://..."
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Link URL</label>
                  <input type="url" value={popupForm.link} onChange={e => setPopupForm({...popupForm, link: e.target.value})}
                    placeholder="https://..."
                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Delay (seconds)</label>
                    <input type="number" min={0} max={60} value={popupForm.delay} onChange={e => setPopupForm({...popupForm, delay: Number(e.target.value)})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                    <select value={popupForm.status} onChange={e => setPopupForm({...popupForm, status: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowAddPopup(false)}
                    className={`flex-1 py-3 rounded-xl font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const newPopup = { id: Date.now().toString(), ...popupForm };
                      if (editingPopup) {
                        setSponsorPopups(sponsorPopups.map((p: any) => p.id === editingPopup.id ? { ...p, ...popupForm } : p));
                        if (isSupabaseConfigured) { upsertSponsorPopup({ ...editingPopup, ...popupForm }); }
                      } else {
                        setSponsorPopups([...sponsorPopups, newPopup]);
                        if (isSupabaseConfigured) { upsertSponsorPopup(newPopup); }
                      }
                      setShowAddPopup(false);
                      setEditingPopup(null);
                      showNotification(`${editingPopup ? 'Updated' : 'Added'} popup successfully!`);
                    }}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-medium">
                    {editingPopup ? 'Update' : 'Add'} Popup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
