# MyRoom.tn — Complete Project

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Create .env file
Copy `.env.example` to `.env` and fill in your Supabase keys:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start development
```bash
npm run dev
```

## 📁 Project Structure

```
myroom/
├── src/
│   ├── components/     # Reusable components
│   │   ├── SEO.jsx
│   │   ├── Navbar.jsx
│   │   ├── ListingCard.jsx
│   │   └── WhatsAppButton.jsx
│   ├── pages/           # Main pages
│   │   ├── Home.jsx
│   │   ├── Listings.jsx
│   │   ├── ListingDetail.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Profile.jsx
│   │   ├── Favorites.jsx
│   │   └── PostListing.jsx
│   ├── admin/           # Admin panel
│   │   └── AdminDashboard.jsx
│   ├── lib/
│   │   └── supabase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   ├── robots.txt
│   └── sitemap.xml
└── ...config files
```

## 🗄️ Supabase Setup

1. Create new project at supabase.com
2. Go to SQL Editor
3. Copy content of `supabase-schema.sql`
4. Click "Run"
5. Go to Storage → Create buckets: `avatars` and `listings` (public)

## 🚀 Deploy on Vercel

1. Push to GitHub (private repo)
2. Import on vercel.com
3. Add environment variables
4. Deploy

## 📝 Features

- ✅ Homepage with search
- ✅ Listing search with filters
- ✅ Listing detail with WhatsApp
- ✅ User registration (Student/Landlord)
- ✅ Login/Logout
- ✅ Forgot password
- ✅ Profile page (edit info, photo)
- ✅ My listings (for landlords)
- ✅ My favorites (for students)
- ✅ Post new listing (for landlords)
- ✅ Admin dashboard
- ✅ Scam reporting
- ✅ SEO optimized
- ✅ PWA ready
