import React from 'react'
import { ArrowLeft, Building2, Globe, MapPin, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { getInstitution } from '@/services/server/institutions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const ViewInstitutionPage = async ({ params: _params }: PageProps) => {
  const params = await _params
  const institutionResponse = await getInstitution(params.id)
  
  if (!institutionResponse?.data) {
    return notFound()
  }
  
  const institution = institutionResponse.data
  
  return (
    <div className='max-w-7xl flex flex-col space-y-6 md:py-12 py-4 md:mx-auto w-full px-4 pb-16'>
      <div>
        <Link 
          href="/admin/institutions" 
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Institutions
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h2 className='text-2xl font-bold'>
              {institution.name}
              {institution.short_name && (
                <Badge variant="outline" className="ml-2 bg-secondary/20">
                  {institution.short_name}
                </Badge>
              )}
            </h2>
            <p className="text-muted-foreground mt-1">
              {institution.type.charAt(0).toUpperCase() + institution.type.slice(1)}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/institutions/${params.id}/edit`}>
              <Button variant="outline">Edit Institution</Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main institution content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            {institution.description ? (
              <div className="whitespace-pre-wrap">{institution.description}</div>
            ) : (
              <p className="text-muted-foreground italic">No description provided</p>
            )}
          </CardContent>
        </Card>
        
        {/* Institution contact & location */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Address
              </div>
              <p>{institution.address}</p>
              <p>{institution.city}, {institution.state}</p>
              <p>{institution.country}</p>
            </div>
            
            {institution.website && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  Website
                </div>
                <a 
                  href={institution.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {institution.website}
                </a>
              </div>
            )}
            
            {institution.email && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <a 
                  href={`mailto:${institution.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {institution.email}
                </a>
              </div>
            )}
            
            {institution.phone && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
                <p>{institution.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ViewInstitutionPage
