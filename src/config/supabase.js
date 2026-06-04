import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qyhylfcgbdnlxshuvnap.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5aHlsZmNnYmRubHhzaHV2bmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMjE0MjIsImV4cCI6MjA3ODg5NzQyMn0.0CXBdIqjn4bUjF2caaEDJh-OxS3pwJp9KVl7F-N9dwI'

export const supabase = createClient(supabaseUrl, supabaseKey)