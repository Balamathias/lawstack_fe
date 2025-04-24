'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useInstitutions } from '@/services/client/institutions'
import { useUpdateUser } from '@/services/client/auth'
import { User } from '@/@types/db'
import { toast } from 'sonner'
import Logo from '../logo'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import LoadingOverlay from '../loading-overlay'
import { 
  Building as BuildingLibrary, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  GraduationCap, 
  BookOpen, 
  Building2, 
  School, 
  Filter, 
  X,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepInstitutionProps {
  user?: User | null;
}

const StepInstitution = ({ user }: StepInstitutionProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null)
  const [selectedInstitutionName, setSelectedInstitutionName] = useState<string | null>(null)
  const [institutionType, setInstitutionType] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const { data: institutionsData, isLoading } = useInstitutions()
  const { mutate: updateUser, isPending } = useUpdateUser()

  const institutions = institutionsData?.data || []

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 500)
    }
  }, [])

  // Filter institutions by search query and type
  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        institution.alias?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = !institutionType || institution.type === institutionType
    
    return matchesSearch && matchesType
  })

  const handleSelectInstitution = (id: string, name: string) => {
    setSelectedInstitution(id)
    setSelectedInstitutionName(name)
    
    // Scroll to bottom when an institution is selected
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    }, 100)
  }

  const handleSubmit = () => {
    if (!selectedInstitution) {
      return toast.error('Please select an institution')
    }

    updateUser({ institution: selectedInstitution }, {
      onSuccess: (data) => {
        if (data?.error) {
          return toast.error(data.message || data?.error?.message)
        }
        toast.success('Institution saved successfully!')
        router.replace('/dashboard?rel=welcome')
      },
      onError: (error) => {
        toast.error('An error occurred. Please try again.')
      }
    })
  }

  // Get unique institution types for filtering
  const uniqueTypes = Array.from(new Set(institutions.map(i => i.type)))

  return (
    <div className='w-full min-h-[90vh] flex items-center justify-center md:px-4 py-8 md:py-12 relative overflow-hidden'>
      {/* Decorative background patterns */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-pulse-glow pointer-events-none"></div>
      
      {(isPending || isLoading) && (<LoadingOverlay loader="2" />)}
      
      <Card className='w-full max-w-4xl p-2 md:p-6 md:p-8 glass-effect shadow-xl border border-border/50 animate-fade-in relative backdrop-blur-lg'>
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-40 h-40 bg-primary/10 rotate-45 blur-2xl -z-10"></div>
        </div>
        
        <div className='flex flex-col gap-y-6 relative z-10'>
          <div className='mx-auto mb-2 transform hover:scale-105 transition-transform duration-300'>
            <Logo />
          </div>

          <div className="space-y-3 text-center animate-fade-in-delay">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 text-primary border border-primary/20 mb-3 shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium tracking-wider">FINAL STEP</span>
            </div>
            
            <h2 className='text-lg md:text-xl font-medium tracking-tight flex flex-wrap items-center justify-center gap-2'>
              <BuildingLibrary className="h-7 w-7 text-primary animate-pulse-custom" />
              <span>Select your School,</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 animate-gradient-shift">{user?.first_name || 'counselor'}</span>
            </h2>
            
            <p className='text-muted-foreground text-xs md:text-sm max-w-lg mx-auto hidden'>
              Connect with your academic institution to access specialized resources and connect with peers from your community.
            </p>
          </div>

          <div className="animate-slide-in-up mt-4">
            {/* Search and filter controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  ref={searchInputRef}
                  className='h-12 pl-10 rounded-lg border-input/60 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all w-full pr-10 shadow-sm'
                  placeholder="Search for your institution..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
                <div className="absolute inset-0 rounded-lg border border-primary/0 group-focus-within:border-primary/10 group-focus-within:bg-primary/[0.02] pointer-events-none transition-all"></div>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hidden">
                <Button 
                  variant={!institutionType ? "default" : "outline"}
                  size="sm"
                  onClick={() => setInstitutionType(null)}
                  className={cn(
                    "rounded-full whitespace-nowrap h-10 px-4 transition-all duration-300",
                    !institutionType ? "shadow-md" : ""
                  )}
                >
                  <Filter className="mr-1 h-4 w-4" /> All
                </Button>
                {uniqueTypes.map(type => (
                  <Button 
                    key={type}
                    variant={institutionType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInstitutionType(type)}
                    className={cn(
                      "rounded-full whitespace-nowrap h-10 px-4 transition-all duration-300",
                      institutionType === type ? "shadow-md" : ""
                    )}
                  >
                    {type === 'university' && <School className="mr-1 h-4 w-4" />}
                    {type === 'college' && <GraduationCap className="mr-1 h-4 w-4" />}
                    {type === 'law_school' && <BookOpen className="mr-1 h-4 w-4" />}
                    {type === 'organization' && <Building2 className="mr-1 h-4 w-4" />}
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Institutions list */}
            <div 
              ref={listRef}
              className="bg-background/50 rounded-xl border border-border/40 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/60 scrollbar-track-transparent p-1 backdrop-blur-md shadow-inner"
            >
              {filteredInstitutions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[200px]">
                  <BuildingLibrary className="h-12 w-12 mb-3 text-muted-foreground/50 animate-pulse-custom" />
                  <p className="mb-3 text-lg">No institutions found matching your search</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setInstitutionType(null)
                    }}
                    className="rounded-full px-4 hover:bg-primary/5 transition-all duration-300"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
                  {filteredInstitutions.map(institution => (
                    <div 
                      key={institution.id}
                      onClick={() => handleSelectInstitution(institution.id, institution.name)}
                      className={cn(
                        "p-3 md:p-4 rounded-lg cursor-pointer transition-all duration-300 relative group",
                        selectedInstitution === institution.id
                          ? "bg-primary/10 border border-primary/30 shadow-md"
                          : "hover:bg-background hover:shadow-md border border-transparent hover:border-border/60"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "mt-1 p-2 rounded-md text-foreground flex items-center justify-center transition-all duration-300",
                          selectedInstitution === institution.id 
                            ? "bg-primary/20 text-primary shadow-sm" 
                            : "bg-secondary/40 group-hover:bg-secondary/60"
                        )}>
                          {institution.type === 'university' && <School className="h-5 w-5" />}
                          {institution.type === 'college' && <GraduationCap className="h-5 w-5" />}
                          {institution.type === 'law_school' && <BookOpen className="h-5 w-5" />}
                          {institution.type === 'organization' && <Building2 className="h-5 w-5" />}
                          {!['university', 'college', 'law_school', 'organization'].includes(institution.type) && 
                            <BuildingLibrary className="h-5 w-5" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h3 className={cn(
                              "font-medium text-sm md:text-base truncate pr-6 transition-all duration-300",
                              selectedInstitution === institution.id ? "text-primary" : "group-hover:text-foreground/90"
                            )}>
                              {institution.name}
                            </h3>
                            {selectedInstitution === institution.id && (
                              <CheckCircle2 className="h-5 w-5 text-primary absolute right-3 top-3 animate-fade-in" />
                            )}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1 flex-wrap gap-x-3 gap-y-1">
                            {institution.alias && (
                              <span className="bg-secondary/30 px-2 py-0.5 rounded-md">
                                {institution.alias}
                              </span>
                            )}
                            <span className="opacity-80">{institution.city} {institution.state}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "absolute inset-0 border border-primary/0 rounded-lg pointer-events-none transition-all",
                        selectedInstitution === institution.id
                          ? "border-primary/20 shadow-[0_0_0_1px_rgba(var(--primary),0.1)]"
                          : "group-hover:border-primary/10"
                      )}></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected institution confirmation */}
            {selectedInstitution && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in bg-foreground/5 p-4 rounded-lg backdrop-blur-sm border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10 text-primary shadow-sm">
                    <BuildingLibrary className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Institution:</p>
                    <p className="font-medium">{selectedInstitutionName}</p>
                  </div>
                </div>
                
                <Button
                  onClick={handleSubmit}
                  className="h-12 px-8 rounded-lg text-base font-medium shadow-lg hover:shadow-primary/30 transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-x-2 group">
                      <span>Complete Setup</span>
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default StepInstitution