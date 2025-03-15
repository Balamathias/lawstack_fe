import React from 'react'
import Link from 'next/link'
import { BookPlus, HelpCircle, ArrowRight, Building2 } from 'lucide-react'

const AdminShortcuts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Add Course Card */}
      <Link href="/admin/courses/add" className="group">
        <div className="h-full bg-white dark:bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border hover:border-blue-200 dark:hover:border-blue-800 overflow-hidden relative">
          <div className="flex items-center mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <BookPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-2 transition-all duration-300">
              <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Add Course</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Create and publish new educational content</p>
          <div className="absolute bottom-0 left-0 h-1 bg-blue-500 w-0 group-hover:w-full transition-all duration-300"></div>
        </div>
      </Link>

      {/* Add Question Card */}
      <Link href="/admin/questions/add" className="group">
        <div className="h-full bg-white dark:bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border hover:border-purple-200 dark:hover:border-purple-800 overflow-hidden relative">
          <div className="flex items-center mb-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
              <HelpCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-2 transition-all duration-300">
              <ArrowRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Add Question</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Create new assessment questions for your courses</p>
          <div className="absolute bottom-0 left-0 h-1 bg-purple-500 w-0 group-hover:w-full transition-all duration-300"></div>
        </div>
      </Link>
      
      {/* Add Institution Card */}
      <Link href="/admin/institutions/add" className="group">
        <div className="h-full bg-white dark:bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border hover:border-green-200 dark:hover:border-green-800 overflow-hidden relative">
          <div className="flex items-center mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
              <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-2 transition-all duration-300">
              <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Add Institution</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Register and manage educational institutions</p>
          <div className="absolute bottom-0 left-0 h-1 bg-green-500 w-0 group-hover:w-full transition-all duration-300"></div>
        </div>
      </Link>
    </div>
  )
}

export default AdminShortcuts