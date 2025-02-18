import { SlidersHorizontal } from 'lucide-react'
import React from 'react'

const Filters = () => {
  return (
    <button className='flex items-center justify-center bg-transparent backdrop-blur-md hover:text-green-600 cursor-pointer'>
        <SlidersHorizontal className='text-gray-500' size={20} />
    </button>
  )
}

export default Filters