import React from 'react'
import { LucideSearch } from 'lucide-react'
import Filters from './filters'
import SearchModal from './filters/search'

interface Props {
  search?: string
}

const Search = ({ search }: Props) => {
  return (
    <div className='flex w-full items-center gap-x-1.5 bg-secondary/50 rounded-lg px-2.5 h-12'>
        <SearchModal 
          trigger={
            <span className='flex w-full items-center gap-x-1.5'>
              <LucideSearch size={20} className='text-muted-foreground' />
              <input 
                  placeholder='Search past questions by text, course, or year, session, etc...'
                  className='w-full h-full focus-within:outline-none bg-transparent focus:border-none focus:outline-none'
                  defaultValue={search || ''}
                  aria-label='Search'
              />
            </span>
          }
        />
        <Filters />
    </div>
  )
}

export default Search