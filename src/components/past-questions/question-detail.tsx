import { getCourse } from '@/services/server/courses';
import { getQuestion } from '@/services/server/questions';
import { LucideBook, LucideCalendar, LucideUser, LucideUserCircle } from 'lucide-react';
import React from 'react'
import { Separator } from '../ui/separator';

interface Props {
    id: string;
}

const QuestionDetail: React.FC<Props> = async ({ id }) => {
  const { data, error } = await getQuestion(id);
  const { data: course, error: courseError } = await getCourse(data?.course!);
  
  if (!data || error || !course || courseError) {
    return (
        <div className='flex flex-col gap-4'>
            <h1>Question not found</h1>
        </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
            <h1 className='text-lg sm:text-xl text-muted-foreground antialiased leading-relaxed font-serif'>{data.text}</h1>
            <Separator />
        </div>
        <div className='flex items-center flex-wrap gap-2 text-xs'>
            <div className='flex items-center gap-2 text-muted-foreground'>
                <LucideUserCircle size={20} />
                <span className=''>{(typeof data?.uploaded_by === 'string') && data.uploaded_by}</span>
            </div>

            <div className='flex items-center gap-2 text-muted-foreground'>
                <LucideBook size={20} />
                <span className=''>{course?.name} ({course?.code})</span>
            </div>

            <div className='flex items-center gap-2 text-muted-foreground'>
                <LucideCalendar size={20} />
                <span className=''>{data?.session} ({data?.year}) (Semester {data?.semester})</span>
            </div>
        </div>
    </div>
  )
}

export default QuestionDetail