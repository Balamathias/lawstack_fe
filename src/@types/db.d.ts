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
    /** @deprecated: Date Joined would be removed in the future, use `joined` instead. */
    date_joined: string,
    joined: string
    institution: string | null,
    institution_name: string | null,
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
    exam_type: string | null,
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
    updated_at: string,
    institution_name?: string
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
  
export interface MessageAttachment {
  id: string;
  filename: string;
  file_type: string;
  size: number;
  url: string;
  created_at: string;
}

export interface Message {
    id: string,
    content: string,
    created_at: string,
    updated_at: string | null,
    feedback: string | null,
    sender: 'user' | 'ai',
    attachments?: MessageAttachment[] | null
}

export interface AIQuestion {
  id: string,
  question_text: string,
  option_a: string,
  option_b: string,
  option_c: string,
  option_d: string,
  correct_answer?: string, // Only available after quiz completion
  explanation?: string,    // Only available after quiz completion
  source_question: string,
  source_question_text: string,
  course: string,
  course_name: string,
  difficulty: 'easy' | 'medium' | 'hard',
  created_at: string
}

export interface QuizQuestion {
  id: string,
  order: number,
  question_id: string,
  question_text: string,
  options: {
    a: string,
    b: string,
    c: string,
    d: string
  },
  correct_answer?: string, // Only available after completion
  explanation?: string     // Only available after completion
}

export interface QuizAnswer {
  selected_option: string,
  is_correct: boolean,
  time_taken: number
}

export interface Quiz {
  id: string,
  title: string,
  course: string,
  course_name: string,
  status: 'pending' | 'in_progress' | 'completed' | 'expired',
  total_questions: number,
  correct_answers: number,
  duration: number, // in minutes
  started_at: string | null,
  completed_at: string | null,
  created_at: string,
  completion_time: number | null, // in seconds
  score: number,
  questions: QuizQuestion[],
  answers?: Record<string, QuizAnswer> // question_id -> answer data
}

export interface QuizStatistics {
  quizzes_completed: number,
  total_questions_answered: number,
  total_correct_answers: number,
  overall_accuracy: number,
  course_performance: {
    course_id: string,
    course_name: string,
    quizzes_taken: number,
    total_questions: number,
    correct_answers: number,
    accuracy: number
  }[],
  recent_performance: {
    quiz_id: string,
    title: string,
    course_name: string,
    completed_at: string,
    score: number,
    total_questions: number,
    correct_answers: number
  }[]
}

export interface SearchFilters {
  query?: string,
  institution?: string,
  course?: string,
  year?: string,
  type?: string,
  page?: number,
  limit?: number
}

export interface SearchResults {
  count: number,
  next: string | null,
  previous: string | null,
  past_questions: Question[],
  courses: Course[],
  institutions: Institution[]
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  paystack_plan_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_percent: number;
  discount_amount: number;
  valid_from: string;
  valid_to: string;
  max_uses: number;
  used_count: number;
  is_active: boolean;
}

export type SubscriptionStatus = 'active' | 'pending' | 'expired' | 'canceled';

export interface Subscription {
  id: string;
  user: string | User;
  plan: Plan;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  is_auto_renew: boolean;
  coupon?: Coupon | null;
  trial_end?: string | null;
  grace_period_end?: string | null;
  paystack_subscription_code?: string | null;
  paystack_email_token?: string | null;
  paystack_customer_code?: string | null;
  paystack_authorization_code?: string | null;
  paystack_last_payment?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionResponse {
  message: string;
  data: Subscription | Subscription[] | null;
  status: number;
  error: any;
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export interface PlanResponse {
  message: string;
  data: Plan | Plan[] | null;
  status: number;
  error: any;
}

export interface CouponResponse {
  message: string;
  data: Coupon | Coupon[] | null;
  status: number;
  error: any;
}

export interface PaystackInitResponse {
  message: string;
  data: { authorization_url: string } | null;
  status: number;
  error: any;
}