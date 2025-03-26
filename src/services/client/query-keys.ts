import { SearchFilters } from '@/@types/db';

export const QUERY_KEYS = {
  // User & Auth keys
  get_users: "get_users",
  get_user: "get_user",
  create_user: "create_user",
  update_user: "update_user",
  delete_user: "delete_user",
  
  // Question keys
  get_questions: "get_questions",
  get_question: "get_question",
  create_question: "create_question",
  update_question: "update_question",
  delete_question: "delete_question",
  get_question_insights: "get_question_insights",
  get_question_insights_edge: "get_question_insights_edge",
  
  // Course keys
  get_courses: "get_courses",
  get_course: "get_course",
  create_course: "create_course",
  update_course: "update_course",
  delete_course: "delete_course",
  
  // Institution keys
  get_institutions: "get_institutions",
  get_institution: "get_institution",
  create_institution: "create_institution",
  update_institution: "update_institution",
  delete_institution: "delete_institution",
  
  // Bookmark keys
  get_bookmarks: "get_bookmarks",
  create_bookmark: "create_bookmark",
  delete_bookmark: "delete_bookmark",
  get_bookmark: "get_bookmark",
  
  // Note keys
  get_notes: "get_notes",
  create_note: "create_note",
  update_note: "update_note",
  delete_note: "delete_note",
  
  // Chat keys
  get_chats: "get_chats",
  get_chat: "get_chat",
  create_chat: "create_chat",
  update_chat: "update_chat",
  delete_chat: "delete_chat",
  
  // Message keys
  get_messages: "get_messages",
  create_message: "create_message",

  // other
  get_cookies: "get_cookies",
  get_user_bookmarks: "get_user_bookmarks",

  // Contribution keys
  get_contributions: "get_contributions",
  get_contribution: "get_contribution",
  create_contribution: "create_contribution",
  update_contribution: "update_contribution",
  delete_contribution: "delete_contribution",
  get_contribution_insights: "get_contribution_insights",
  get_contribution_insights_edge: "get_contribution_insights_edge",

  ai_insights: "ai_insights",

  // Quiz related keys
  get_quizzes: 'get_quizzes',
  get_quiz: 'get_quiz',
  create_quiz: 'create_quiz',
  start_quiz: 'start_quiz',
  submit_answer: 'submit_answer',
  complete_quiz: 'complete_quiz',
  get_quiz_stats: 'get_quiz_stats',
  generate_mcq: 'generate_mcq',

  // Search related keys
  SEARCH: 'search',
  SEARCH_FILTERS: 'search-filters',
  DASHBOARD_STATS: 'dashboard-stats',
  RECENT_ACTIVITY: 'recent-activity',

  search: (filters: SearchFilters) => ['search', filters],
  aiAnalysis: (query: string) => ['ai', 'analysis', query],
} as const