'use client'

import React from 'react'
import { toast } from 'sonner'
import DynamicModal from '../dynamic-modal'
import { LucideHeart } from 'lucide-react'
import { Question, User } from '@/@types/db'
import { DialogTitle } from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useCreateContribution } from '@/services/client/contributions'

interface Props {
    trigger: React.ReactNode;
    user: User,
    question: Question,
}

const HeartModal: React.FC<Props> = ({ trigger, user, question }) => {
    const [text, setText] = React.useState('')
    const [error, setError] = React.useState<string | null>(null)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const [isOpen, setIsOpen] = React.useState(false)

    const { mutate: shareThought, isPending: isSubmitting } = useCreateContribution()

    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (error) setError(null);
    }

    const validateThought = (thought: string): boolean => {
        if (!thought.trim()) {
            setError("Please enter your thoughts before submitting");
            return false;
        }
        
        if (thought.length < 10) {
            setError("Your thought is too short. Please add more context to help others.");
            return false;
        }
        
        return true;
    }

    const handleSubmit = async () => {
        if (!validateThought(text)) return;
        
        const payload = {
            text,
            user: user.id,
            past_question: question.id
        }

        shareThought(payload, {
            onSuccess: (data) => {
                if (data?.error) {
                    setError(data.error);
                    return;
                }

                setIsOpen(false);
                setText('');
                toast.success('Thought shared successfully', { duration: 5000, action: (
                    <Button className='bg-gradient-to-l from-pink-500 to-red-500 text-white rounded-full' size='sm' onClick={() => toast.dismiss()}>
                        Dismiss
                    </Button>
                )});
            },
            
            onError: (error) => {
                setError(error.message);
            }
        })
    }

    return (
        <DynamicModal
            trigger={trigger}
            title={
                <DialogTitle className="flex items-center gap-2 p-2.5">
                    <LucideHeart size={18} className='text-pink-500' />
                    <span className='bg-gradient-to-l from-pink-500 to-red-500 text-transparent bg-clip-text font-semibold text-lg'>Thoughts</span>
                </DialogTitle>
            }
            dialogClassName='sm:max-w-xl'
            open={isOpen}
            setOpen={setIsOpen}
        >
            <div className='max-h-[500px] md:max-h-[400px] overflow-y-auto p-2.5'>
                <div className='flex flex-col w-full gap-2'>
                    <Textarea 
                        ref={textareaRef}
                        value={text}
                        onChange={handleTextChange}
                        placeholder='How did you answer this question in your exams? Share your thought to help others learn. 😊'
                        className='min-h-[80px] w-full rounded-xl outline-none border ring-1 resize-none overflow-hidden'
                        disabled={isSubmitting}
                    />
                    
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                    
                    <div className="flex items-center gap-4 w-full mt-2 sm:justify-end">

                        <Button 
                            onClick={() => setIsOpen(false)}
                            size={'lg'}
                            className="rounded-xl max-sm:basis-[48%]"
                            variant="secondary"
                        >
                            Close
                        </Button>

                        <Button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            size={'lg'}
                            className="bg-gradient-to-l from-pink-500 to-red-500 text-white rounded-xl"
                        >
                            {isSubmitting ? 'Sharing...' : 'Share Thought'}
                        </Button>
                    </div>
                </div>
            </div>
        </DynamicModal>
    )
}

export default HeartModal
