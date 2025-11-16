export interface Team {
  id: string
  name: string
  description: string | null
  leader_id: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: string
  joined_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  event_time: string | null
  location: string | null
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  max_participants: number | null
  created_at: string
  updated_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  user_id: string
  registered_at: string
  status: 'confirmed' | 'cancelled' | 'waitlist'
}

export interface Submission {
  id: string
  team_id: string
  title: string
  description: string | null
  submission_url: string | null
  submission_file_path: string | null
  submitted_by: string
  submitted_at: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  score: number | null
  feedback: string | null
}

export interface Announcement {
  id: string
  title: string
  content: string
  created_by: string
  created_at: string
  is_published: boolean
}

export interface Profile {
  id: string
  full_name: string | null
  student_id: string | null
  department: string | null
  year: number | null
  phone: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  user_id: string
  scanned_by: string | null
  event_id: string | null
  scanned_at: string
  location: string | null
  notes: string | null
}
