export interface User {
    id: string,
    username: string,
    email: string,
    first_name: string | null,
    last_name: string | null,
    is_active?: boolean,
    is_staff?: boolean,
    is_superuser?: boolean,
    avatar: string | null,
    phone: string | null,
    created_at: string,
}

export interface Question {
    id: string,
    text: string,
    text_plain: string | null,
    year: string,
    course: string,
    level: string,
    session: string | null,
    marks: number,
    semester: string,
    course_name: string,
    institution: string,
    institution_name: string,
    type: string,
    tags: string[],
    created_at: string,
    updated_at: string | null,
    uploaded_by: string | User,
}

export interface QuestionSuggestion {
  id: string,
  text: string,
  year: string,
  course: string,
  semester: string,
  institution: string,
  session: string | null,
  tags: string[],
}

export interface Course {
    id: string,
    institution: string[],
    name: string,
    code: string,
    description: string,
    level: string,
    duration: string,
    credit_units: number,
    ordering: number | null,
    created_at: string,
    updated_at: string
}

export interface Bookmark {
    id: string,
    user: string | User,
    past_question: Question,
    created_at: string,
    updated_at: string | null,
}

export interface Contribution {
    id: string,
    text: string,
    past_question: string,
    contributor: User,
    upvotes_count: number,
    downvotes_count: number,
    created_at: string,
    updated_at: string | null,
}

export interface Note {
  id: string,
  title: string,
  content: string,
  author_name: string,
  created_at: string,
  updated_at: string,
  label: string
}

export interface Chat {
    id: string,
    title: string,
    chat_type: 'general' | 'course_specific' | 'past_question' | 'exam_prep',
    created_at: string,
    updated_at: string | null,
    course: string | null,
    course_name: string | null,
    past_question: string | null,
    past_question_text: string | null,
    message_preview: string | null,
    messages: Message[]
  }
  
export interface Message {
    id: string,
    content: string,
    created_at: string,
    updated_at: string | null,
    feedback: string | null,
    sender: 'user' | 'ai',
}
