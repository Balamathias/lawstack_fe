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

  aiAnalysis: (id: string) => ['aiAnalysis', id],

  SEARCH: 'search',
  SEARCH_FILTERS: 'searchFilters',
  SEARCH_RESULTS: 'searchResults',

  // Cases keys
  get_cases: "get_cases",
  get_case: "get_case",
  create_case: "create_case",
  update_case: "update_case",
  delete_case: "delete_case",
  analyze_case: "analyze_case",
  summarize_case: "summarize_case",
  recommend_cases: "recommend_cases",
  similar_cases: "similar_cases",
  rollback_case_version: "rollback_case_version",
  case_history: "case_history",
  add_case_note: "add_case_note",
  add_case_attachment: "add_case_attachment",
  add_case_evidence: "add_case_evidence",
  add_case_citation: "add_case_citation",
  case_analytics: "case_analytics",
  bulk_update_case_status: "bulk_update_case_status",
} as const