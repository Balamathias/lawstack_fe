import { getQuestions } from '@/services/server/questions'
import { ScrollText, Clock, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Explorer = async () => {
    const { data } = await getQuestions({
        params: {
            page_size: 6,
            ordering: 'created_at',
        }
    })

    return (
        <div className="space-y-4 mt-10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <ScrollText className="h-6 w-6" />
                Recent Questions
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.map((question) => (
                    <Link
                        href={`/past-questions/${question.id}`}
                        key={question.id}
                        className="group p-4 rounded-lg border border-secondary hover:border-primary/50 transition-all hover:shadow-md bg-secondary/50 hover:bg-secondary/100 backdrop-blur-md flex flex-col gap-4 justify-between"
                    >
                        <div className="flex justify-between items-start">
                            <p className="font-medium line-clamp-2 hover:text-green-500">{question?.text_plain || question.text}</p>
                            <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex items-center gap-2 mt-3 justify-between">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                <time>{new Date(question.created_at).toLocaleDateString()}</time>
                            </div>

                            <span className="text-xs text-muted-foreground px-2.5 py-1.5 bg-secondary/10 border rounded-full">{question.course_name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Explorer