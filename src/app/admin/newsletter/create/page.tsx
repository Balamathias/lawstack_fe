import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import NewsletterForm from '@/components/admin/newsletter/newsletter-form'
import { getNewsletterCategories } from '@/services/server/newsletter'

const CreateNewsletterPage = async () => {
  const { data: categories = [] } = await getNewsletterCategories();
  
  return (
    <div className="max-w-7xl flex flex-col space-y-2.5 sm:space-y-4 md:py-12 py-4 md:mx-auto w-full px-4 pb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link 
            href="/admin/newsletter" 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Newsletters
          </Link>
          <h2 className="text-2xl font-bold">
            Create Newsletter
          </h2>
          <p className="text-muted-foreground mt-1">
            Compose a new newsletter to send to your subscribers
          </p>
        </div>
      </div>
      
      <NewsletterForm categories={categories} />
    </div>
  )
}

export default CreateNewsletterPage