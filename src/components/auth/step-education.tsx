'use client'

import React, { useState } from 'react'
import { Input } from '../ui/input'
import Logo from '../logo'
import { Button } from '../ui/button'
import { User } from '@/@types/db'
import { useUpdateUser } from '@/services/client/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Building2, ArrowRight, Loader2, GraduationCap, BookOpen, School } from 'lucide-react'
import LoadingOverlay from '../loading-overlay'
import { motion } from 'framer-motion'
import { useGetInstitutions } from '@/services/client/institution'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Combobox } from '../ui/combobox'

interface Props {
    user: User | null
}

const StepEducation = ({ user }: Props) => {
    const { mutate: updateUser, isPending } = useUpdateUser()
    const router = useRouter()
    
    // Get institutions data for selection
    const { data: institutionsResponse, isLoading: loadingInstitutions } = useGetInstitutions()
    const institutions = institutionsResponse?.data || []
    
    // Form state
    const [institution, setInstitution] = useState<string>(user?.institution || '')
    const [level, setLevel] = useState<string>(user?.level?.toString() || '')
    const [specialization, setSpecialization] = useState<string>(user?.specialization || '')
    
    // Educational levels for law students
    const levels = [
        { value: '100', label: '100 Level' },
        { value: '200', label: '200 Level' },
        { value: '300', label: '300 Level' },
        { value: '400', label: '400 Level' },
        { value: '500', label: '500 Level' }
    ]
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
  
        if (!institution || !level) {
            return toast.error('Please select your institution and education level')
        }
  
        updateUser({ 
            institution,
            level: parseInt(level),
            specialization
        }, {
            onSuccess: (data) => {
                if (data?.error) {
                    return toast.error(data.message || data?.error?.message)
                }
  
                toast.success('Education information saved successfully.')
                router.replace('/finish-up?step=4')
            },
            onError: (error) => {
                toast.error('An error occurred. Please try again.')
            }
        })
    }

    return (
        <div className='w-full flex items-center justify-center'>
            {isPending && (<LoadingOverlay />)}
            
            <form 
                onSubmit={handleSubmit}
                className='w-full flex flex-col gap-y-6 max-w-[500px]'
            >
                <motion.div 
                    className='mx-auto mb-8'
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <Logo />
                </motion.div>

                <motion.div 
                    className="space-y-2 text-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
                        Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">Education</span> Details
                    </h2>
                    <p className='text-muted-foreground max-w-md mx-auto'>
                        Help us personalize your experience by sharing your academic information.
                    </p>
                </motion.div>

                <div className='space-y-4 mt-4'>
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            Institution
                        </label>
                        <Combobox
                            items={institutions.map(inst => ({
                                label: inst.name,
                                value: inst.id
                            }))}
                            placeholder="Select your institution"
                            className="h-12 w-full"
                            value={institution}
                            onChange={setInstitution}
                            emptyMessage="No institutions found"
                            searchPlaceholder="Search institutions..."
                            isLoading={loadingInstitutions}
                        />
                    </motion.div>

                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            Level of Study
                        </label>
                        <Select value={level} onValueChange={setLevel}>
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select your level" />
                            </SelectTrigger>
                            <SelectContent>
                                {levels.map(level => (
                                    <SelectItem key={level.value} value={level.value}>
                                        {level.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            Area of Specialization (Optional)
                        </label>
                        <Input 
                            className='h-12 rounded-lg border-input/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                            placeholder='e.g., Constitutional Law, Corporate Law...'
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button
                            className='h-12 w-full rounded-lg text-base font-medium shadow-lg hover:shadow-primary/20 transition-all duration-300 mt-2'
                            disabled={isPending || !institution || !level}
                        >
                            {isPending ? (
                                <div className="flex items-center gap-x-2">
                                    <Loader2 size={20} className='animate-spin' />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-x-2">
                                    <span>Continue</span>
                                    <ArrowRight size={18} />
                                </div>
                            )}
                        </Button>
                    </motion.div>
                </div>
            </form>
        </div>
    )
}

export default StepEducation
