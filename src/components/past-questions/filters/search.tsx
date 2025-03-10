'use client'

import DynamicModal from '@/components/dynamic-modal'
import MarkdownPreview from '@/components/markdown-preview'
import { DialogTitle } from '@/components/ui/dialog'
import { useDebounce } from '@/hooks/use-debounce'
import { truncateString } from '@/lib/utils'
import { useQuestionSuggestions } from '@/services/client/question'
import { Loader, LucideSearch } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'
import React from 'react'

interface Props {
    trigger: React.ReactNode
}

const SearchModal = ({ trigger }: Props) => {
  
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebounce(query, 500)
  const router = useRouter()

  const { data: suggestions, isPending } = useQuestionSuggestions(debouncedQuery)

  const renderSuggestions = () => {
      
      if (isPending) {
          return (
              <div className='w-full p-4 py-5 h-full flex items-center justify-center'>
            <Loader className='animate-spin' />
        </div>
      );
    }

    if (!suggestions?.data?.length) {
        return <div className='w-full p-4 py-5 h-full flex items-center justify-center'>No suggestions found</div>;
    }
    
    if (suggestions?.data && suggestions.data.length > 0) {
      return (
        <ul>
          {suggestions.data.map((suggestion, index) => (
            <li key={index} className='cursor-pointer' role='button' onClick={() => router.push(`/past-questions/${suggestion.id}`)}>
              <div className='p-3 hover:bg-secondary/70 py-4 rounded-lg flex justify-center flex-col gap-2'>
                <div className=''>
                  <MarkdownPreview content={truncateString(suggestion.text, 112)} />
                </div>
                <p className='text-xs text-muted-foreground'>{suggestion.course}</p>
                <p className='text-xs text-muted-foreground'>{suggestion.year} - {suggestion.session}</p>
              </div>
            </li>
          ))}
        </ul>
      );
    }
  };
  

  const clearInput = () => {
    setQuery('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleClearButtonClick = () => {
    clearInput();
  };

  return (
    <DynamicModal
        trigger={trigger}
        dialogClassName='sm:w-full sm:max-w-3xl'
        drawerClassName=''
        hideDrawerCancelIcon
        title={
            <DialogTitle className='flex items-center gap-2 h-10 px-3 mx-2 sm:mx-0'>
                <input 
                    placeholder='Search past questions by text, course, or year, session, etc...'
                    className='w-full h-full focus-within:outline-none bg-transparent focus:border-none focus:outline-none ml-2 sm:ml-0'
                    value={query}
                    onChange={handleChange}
                    autoFocus
                />
                <LucideSearch size={20} className='text-muted-foreground' />
            </DialogTitle>
        }
    >
      <div className='max-h-[500px] md:max-h-[400px] overflow-y-auto px-3'>
        {renderSuggestions()}
      </div>
    </DynamicModal>
  )
}

export default SearchModal