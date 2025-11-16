# Hult Prize KCE# Hult Prize - Khwopa College of Engineering



Web application for Hult Prize at Khwopa College of Engineering.A full-featured web application for managing Hult Prize activities at Khwopa College of Engineering. Built with Next.js, TypeScript, Supabase, and Tailwind CSS with a beautiful white and pink theme.



## Features## Features



- User authentication & profiles- 🔐 **Authentication System**: Secure user registration and login with Supabase

- QR code generation for users- 👥 **User Dashboard**: Personalized dashboard for participants

- Admin QR scanner for attendance- 📅 **Events Management**: Browse and register for Hult Prize events

- Event management- 🎨 **Beautiful UI**: Modern design with white and pink color scheme

- PWA enabled- 📱 **Responsive Design**: Works seamlessly on all devices

- ⚡ **Fast Performance**: Built with Next.js 14+ App Router

## Setup- 🔒 **Secure**: Protected routes with middleware authentication



1. Install dependencies:## Tech Stack

```bash

npm install- **Framework**: Next.js 14+ (App Router)

```- **Language**: TypeScript

- **Database & Auth**: Supabase

2. Configure `.env.local`:- **Styling**: Tailwind CSS

```env- **Runtime**: Node.js

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key## Getting Started

```

### Prerequisites

3. Run database setup:

   - Open Supabase SQL Editor- Node.js 18+ installed

   - Execute `COMPLETE-DATABASE-SETUP.sql`- A Supabase account and project



4. Start dev server:### Installation

```bash

npm run dev1. Clone the repository:

```   ```bash

   git clone <repository-url>

Open http://localhost:3000   cd hult-web

   ```

## Admin Access

2. Install dependencies:

Login format: `admin001@hultprize.kce`   ```bash

   npm install

Scanner: http://localhost:3000/admin/scanner   ```



## Deploy3. Set up environment variables:

   - Copy `.env.local` and add your Supabase credentials:

```bash   ```env

npm run build   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url

vercel --prod   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

```   ```



---4. Run the development server:

   ```bash

Built with Next.js, TypeScript, Supabase & Tailwind CSS   npm run dev

   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Supabase Setup

### Database Schema

Create the following tables in your Supabase project:

#### Users Table (extends auth.users)
```sql
-- The auth.users table is automatically created by Supabase
-- Add user metadata in the auth.users metadata field
```

#### Teams Table
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Team Members Table
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);
```

#### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_time VARCHAR(50),
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Event Registrations Table
```sql
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
```

#### Submissions Table
```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  submission_url VARCHAR(500),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending'
);
```

### Row Level Security (RLS)

Enable RLS on all tables and add appropriate policies:

```sql
-- Example: Allow users to read all events
CREATE POLICY "Allow public read access to events"
ON events FOR SELECT
USING (true);

-- Example: Allow users to register for events
CREATE POLICY "Allow users to register for events"
ON event_registrations FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## Project Structure

```
hult-web/
├── src/
│   ├── app/
│   │   ├── about/
│   │   ├── dashboard/
│   │   ├── events/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── Navbar.tsx
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── middleware.ts
│   └── middleware.ts
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Design System

### Colors
- **Primary Pink**: `#ec4899`
- **Primary Dark**: `#db2777`
- **Primary Light**: `#fbcfe8`
- **Accent**: `#fce7f3`
- **White**: `#ffffff`

### Components
- Custom button styles: `btn-primary`, `btn-secondary`
- Card component: `card`
- Gradient backgrounds: `gradient-pink`, `gradient-light`

## Features to Add

- [ ] Team creation and management
- [ ] Project submission system
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] File upload for submissions
- [ ] Judging and scoring system
- [ ] Real-time chat or discussion forums
- [ ] Resource library

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your institution.

## Support

For support, email hultprize@kce.edu.np or create an issue in the repository.

---

Built with ❤️ for Hult Prize at Khwopa College of Engineering
