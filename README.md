# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- Google OAuth authentication (no email/password)
- Add bookmarks with URL and title
- Private bookmarks per user
- Real-time updates across tabs
- Delete your own bookmarks
- Deployed on Vercel

## Tech Stack

- Next.js 14 (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- TypeScript

## Setup Instructions

### 1. Install Dependencies

```bash
cd bookmark-app
npm install
```



2. Go to Authentication > Providers > Google
   - Enable Google provider
   - Add your Google OAuth credentials (Client ID and Secret)
   - Add authorized redirect URLs

. Copy your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy
5. Add the Vercel URL to Supabase Auth > URL Configuration > Redirect URLs

## Problems Encountered and Solutions

### Problem 1: Real-time Updates Not Working
**Issue**: Bookmarks weren't syncing across tabs initially.

**Solution**: 
- Enabled Realtime on the bookmarks table using `alter publication supabase_realtime add table bookmarks`
- Implemented Supabase Realtime subscription with proper channel management
- Added cleanup function to unsubscribe when component unmounts

### Problem 2: Row Level Security Blocking Queries
**Issue**: Users couldn't see their bookmarks even after authentication.

**Solution**:
- Created proper RLS policies for SELECT, INSERT, and DELETE operations
- Ensured policies check `auth.uid() = user_id` to match the authenticated user
- Tested policies in Supabase SQL Editor before deploying

### Problem 3: Google OAuth Redirect Issues
**Issue**: After Google sign-in, users were redirected to wrong URL or got errors.

**Solution**:
- Set proper `redirectTo` option in `signInWithOAuth` to use `window.location.origin`
- Added all deployment URLs (localhost and Vercel) to Supabase Auth redirect whitelist
- Configured Google OAuth console with correct authorized redirect URIs

### Problem 4: Environment Variables Not Loading
**Issue**: Supabase client initialization failed in production.

**Solution**:
- Used `NEXT_PUBLIC_` prefix for client-side environment variables
- Added environment variables in Vercel project settings
- Redeployed after adding variables

### Problem 5: TypeScript Errors with Supabase Types
**Issue**: Type errors when working with Supabase responses.

**Solution**:
- Defined proper TypeScript interfaces for Bookmark type
- Used proper type assertions for Supabase realtime payload
- Configured tsconfig.json with strict mode for better type safety

## Live Demo

[Your Vercel URL will go here after deployment]

## Testing

To test the app:
1. Open the app in two different browser tabs
2. Sign in with Google
3. Add a bookmark in one tab
4. Watch it appear instantly in the other tab (real-time sync)
5. Delete a bookmark
6. Open in incognito mode with a different Google account to verify privacy (you won't see other users' bookmarks)
