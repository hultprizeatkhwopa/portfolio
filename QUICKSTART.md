# Quick Start Guide - Hult Prize KCE Web App

## 🎉 Congratulations!
Your Hult Prize web application has been successfully created and is now running!

## 📋 What's Been Set Up

### ✅ Complete Application Structure
- **Home Page** - Beautiful landing page with pink/white theme
- **Login/Signup Pages** - Authentication ready to go
- **Dashboard** - User dashboard with quick actions
- **Events Page** - Browse and manage events
- **About Page** - Information about Hult Prize

### ✅ Technology Stack
- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS with custom pink/white theme
- Supabase integration for auth and database
- Responsive design for all devices

## 🚀 Next Steps

### 1. Configure Supabase (Required)
To enable authentication and database features:

1. **Create a Supabase Project**:
   - Go to https://supabase.com
   - Create a new project

2. **Get Your Credentials**:
   - Go to Project Settings > API
   - Copy the Project URL and anon/public key

3. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

4. **Run Database Schema**:
   - Open Supabase SQL Editor
   - Copy and run the SQL from `supabase-schema.sql`
   - **IMPORTANT**: Then run `supabase-migration-add-email.sql` to add email column and create any missing profiles

### 2. Test the Application
1. Make sure the dev server is running: `npm run dev`
2. Open http://localhost:3000
3. Try creating an account (after Supabase is configured)
4. Explore all pages

### 3. Customize Content
Edit these files to customize for your institution:
- `src/app/page.tsx` - Home page content
- `src/app/about/page.tsx` - About page content
- `src/app/events/page.tsx` - Events list
- `src/components/Navbar.tsx` - Navigation menu

### 4. Customize Theme Colors
Edit `src/app/globals.css` to change colors:
```css
:root {
  --primary: #ec4899;        /* Main pink color */
  --primary-dark: #db2777;   /* Darker pink */
  --primary-light: #fbcfe8;  /* Light pink */
  --accent: #fce7f3;         /* Very light pink */
}
```

## 📁 Project Structure

```
hult-web/
├── src/
│   ├── app/                    # Pages
│   │   ├── page.tsx           # Home page
│   │   ├── about/             # About page
│   │   ├── events/            # Events page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   └── dashboard/         # Dashboard page
│   ├── components/            # Reusable components
│   │   └── Navbar.tsx         # Navigation bar
│   ├── lib/                   # Utilities
│   │   └── supabase/          # Supabase clients
│   └── types/                 # TypeScript types
├── .env.local                 # Environment variables
├── supabase-schema.sql        # Database schema
└── README.md                  # Full documentation
```

## 🎨 Design System

### Colors
- **Primary Pink**: #ec4899
- **Primary Dark**: #db2777
- **Primary Light**: #fbcfe8
- **Accent**: #fce7f3
- **White**: #ffffff

### Custom Classes
- `.btn-primary` - Pink button
- `.btn-secondary` - White button with pink border
- `.card` - White card with shadow
- `.gradient-pink` - Pink gradient background
- `.gradient-light` - Light pink gradient

## 🔧 Available Commands

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Run ESLint
```

## 📊 Database Schema

The `supabase-schema.sql` file includes:
- **Users** - Authentication (handled by Supabase Auth)
- **Teams** - Team information and members
- **Events** - Event listings and registrations
- **Submissions** - Project submissions
- **Announcements** - News and updates
- **Profiles** - Extended user information

## 🆘 Troubleshooting

### Build Errors
If you get build errors, try:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Authentication Not Working
- Verify Supabase credentials in `.env.local`
- Check Supabase project is active
- Ensure database schema is applied

### Styling Issues
- Clear browser cache
- Restart dev server
- Check Tailwind config in `tailwind.config.ts`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🎯 Features to Add

Consider adding these features:
- [ ] Team creation and management
- [ ] Project submission system
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] File upload for submissions
- [ ] Judging and scoring system
- [ ] Real-time chat/discussion forums
- [ ] Resource library

## 💡 Tips

1. **Development**: Use `npm run dev` for hot-reloading during development
2. **Environment Variables**: Never commit `.env.local` to version control
3. **Database**: Always test schema changes in a staging environment first
4. **Deployment**: Consider using Vercel for easy deployment with Next.js

## 🎓 Support

For questions or issues:
- Check the README.md for detailed documentation
- Review the code comments
- Consult the official documentation links above

---

**Built with ❤️ for Hult Prize at Khwopa College of Engineering**

Happy coding! 🚀
