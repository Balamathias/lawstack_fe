'use client'

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { addQueryParams } from '@/lib/utils';
import { useRouter } from 'nextjs-toploader/app';

const SearchCourse: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const searchParams = useSearchParams()
    const qs = searchParams?.toString()

    const router = useRouter()

    const handleClear = () => {
        setSearchTerm('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const url = addQueryParams(qs, { search: searchTerm })

        router.push(url)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
        >
            <div
                className={`relative rounded-xl ${
                    isFocused ? 'shadow-lg' : ''
                }`}
            >
                <form 
                    onSubmit={handleSubmit}
                    className="relative bg-secondary/45 rounded-lg overflow-hidden flex items-center p-2 py-[7px] focus:ring">
                    <Search
                        className="h-5 w-5 text-muted-foreground ml-2 flex-shrink-0"
                        aria-hidden="true"
                    />
                    <input
                        type="text"
                        placeholder="Search for courses..."
                        className="w-full border-none focus:outline-none bg-transparent py-1.5 px-4 text-muted-foreground placeholder:text-muted-foreground ring-0 focus-within:ring-0 focus:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {searchTerm && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleClear}
                            className="flex-shrink-0 mr-2 p-1 rounded-full hover:bg-secondary/80"
                            aria-label="Clear search"
                            type='button'
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </motion.button>
                    )}
                </form>
            </div>
        </motion.div>
    );
};

export default SearchCourse;