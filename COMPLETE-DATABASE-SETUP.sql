-- Complete Database Setup - Run ALL of this in Supabase SQL Editor
-- This creates all tables needed for the Hult Prize app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  email VARCHAR(255),
  student_id VARCHAR(50),
  department VARCHAR(100),
  year INTEGER,
  phone VARCHAR(20),
  bio TEXT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Table (for QR code scanning)
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scanned_by UUID REFERENCES auth.users(id),
  event_id UUID,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location VARCHAR(255),
  notes TEXT
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_time VARCHAR(50),
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'upcoming',
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for attendance -> events
ALTER TABLE attendance ADD CONSTRAINT attendance_event_fkey 
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Event Registrations Table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'confirmed',
  UNIQUE(event_id, user_id)
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  submission_url VARCHAR(500),
  submission_file_path VARCHAR(500),
  submitted_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending',
  score INTEGER,
  feedback TEXT
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Allow public read access to profiles" ON profiles;
CREATE POLICY "Allow public read access to profiles"
ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;
CREATE POLICY "Allow users to update their own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to insert their own profile" ON profiles;
CREATE POLICY "Allow users to insert their own profile"
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Attendance Policies
DROP POLICY IF EXISTS "Allow users to view their own attendance" ON attendance;
CREATE POLICY "Allow users to view their own attendance"
ON attendance FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = scanned_by);

DROP POLICY IF EXISTS "Allow admins to insert attendance records" ON attendance;
CREATE POLICY "Allow admins to insert attendance records"
ON attendance FOR INSERT
WITH CHECK (auth.uid() = scanned_by);

-- Events Policies
DROP POLICY IF EXISTS "Allow public read access to events" ON events;
CREATE POLICY "Allow public read access to events"
ON events FOR SELECT USING (true);

-- Teams Policies
DROP POLICY IF EXISTS "Allow public read access to teams" ON teams;
CREATE POLICY "Allow public read access to teams"
ON teams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to create teams" ON teams;
CREATE POLICY "Allow users to create teams"
ON teams FOR INSERT WITH CHECK (auth.uid() = leader_id);

DROP POLICY IF EXISTS "Allow team leaders to update their teams" ON teams;
CREATE POLICY "Allow team leaders to update their teams"
ON teams FOR UPDATE USING (auth.uid() = leader_id);

-- Team Members Policies
DROP POLICY IF EXISTS "Allow public read access to team members" ON team_members;
CREATE POLICY "Allow public read access to team members"
ON team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to join teams" ON team_members;
CREATE POLICY "Allow users to join teams"
ON team_members FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to leave teams" ON team_members;
CREATE POLICY "Allow users to leave teams"
ON team_members FOR DELETE USING (auth.uid() = user_id);

-- Event Registrations Policies
DROP POLICY IF EXISTS "Allow users to view their registrations" ON event_registrations;
CREATE POLICY "Allow users to view their registrations"
ON event_registrations FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to register for events" ON event_registrations;
CREATE POLICY "Allow users to register for events"
ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to cancel their registrations" ON event_registrations;
CREATE POLICY "Allow users to cancel their registrations"
ON event_registrations FOR DELETE USING (auth.uid() = user_id);

-- Submissions Policies
DROP POLICY IF EXISTS "Allow team members to view their submissions" ON submissions;
CREATE POLICY "Allow team members to view their submissions"
ON submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = submissions.team_id
    AND team_members.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Allow team members to create submissions" ON submissions;
CREATE POLICY "Allow team members to create submissions"
ON submissions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = submissions.team_id
    AND team_members.user_id = auth.uid()
  )
);

-- Announcements Policies
DROP POLICY IF EXISTS "Allow public read access to published announcements" ON announcements;
CREATE POLICY "Allow public read access to published announcements"
ON announcements FOR SELECT USING (is_published = true);

-- Functions and Triggers

-- Automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS teams_updated_at ON teams;
CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create profiles for any existing users
INSERT INTO profiles (id, full_name, email)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  au.email
FROM auth.users au
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO events (title, description, event_date, event_time, location, status)
VALUES 
  ('Hult Prize OnCampus Information Session', 'Learn about the Hult Prize competition and how to participate.', '2025-12-01', '2:00 PM - 4:00 PM', 'KCE Auditorium', 'upcoming'),
  ('Team Formation Workshop', 'Find team members and start building your Hult Prize team.', '2025-12-08', '10:00 AM - 12:00 PM', 'KCE Seminar Hall', 'upcoming'),
  ('Ideation Workshop', 'Develop and refine your social enterprise ideas with expert guidance.', '2025-12-15', '1:00 PM - 5:00 PM', 'KCE Innovation Lab', 'upcoming')
ON CONFLICT DO NOTHING;

-- Verify tables were created
SELECT 
  'Tables created successfully!' as status,
  COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'attendance', 'events', 'teams', 'team_members', 'event_registrations', 'submissions', 'announcements');
