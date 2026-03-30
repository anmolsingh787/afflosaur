# AFFLOSAUR Admin Panel Blueprint

This document summarizes the admin control plan (mobile-first, secure, and role-based).

## Security And Admin Controls
- Admin access is restricted to a whitelist of three emails in src/config/adminAccess.ts.
- Role-based access control:
  - Admin: full control
  - Moderator: limited control
- 2FA required for admin logins (OTP/Authenticator).
- Session expiration with auto logout.
- Token-protected API calls for all admin operations.
- Audit logs for every edit (who, what, when).

## Dashboard
- Summary cards: total products, active deals, pending quests, user coins.
- Quick actions: add product, add affiliate, write blog, view analytics.
- Alerts: out of stock, coming soon, pending requests.

## Products
- Add/edit product details and images (mobile upload).
- Status: available, out_of_stock, coming_soon, hidden.
- Inline edits and save button.

## Affiliates
- Add/edit affiliate links and commission.
- Status: active, inactive, hidden.
- Link validation before save.

## Blogs
- Rich text editor, image upload.
- Draft/publish/schedule.
- AI summary and SEO hints.

## Analytics
- Revenue, clicks, conversions, mission activity.
- Filters by product, category, affiliate, and date.
- Charts (line/bar/pie) optimized for mobile.

## Users And Coins
- View users, edit coins, manage streaks.
- Lock/ban users and assign rewards.

## Mobile Navigation
- Fixed nav with: Products, Affiliates, Blogs, Analytics, Settings.
- Per-page primary action button (green).
