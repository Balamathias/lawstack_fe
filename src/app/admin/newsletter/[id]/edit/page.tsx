import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import NewsletterForm from '@/components/admin/newsletter/newsletter-form'
import { getNewsletter, getNewsletterCategories } from '@/services/server/newsletter'
import { notFound } from 'next/navigation'

interface EditNewsletterPageProps {
  params: {
    id: string
  }
}

const EditNewsletterPage = async ({ params }: EditNewsletterPageProps) => {
  const { data: newsletter, error } = await getNewsletter(params.id);
  const { data: categories = [] } = await getNewsletterCategories();
  
  if (error || !newsletter) {
    notFound();
  }
  
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
            Edit Newsletter
          </h2>
          <p className="text-muted-foreground mt-1">
            Make changes to your newsletter before sending
          </p>
        </div>
      </div>
      
      <NewsletterForm newsletter={newsletter} categories={categories} />
    </div>
  )
}

export default EditNewsletterPage