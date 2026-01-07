import React from 'react'

const Task = () => {
  return (
    <div className=' flex-1 flex flex-col gap-4'>
      {/* Search / Filter */}
      <section className='w-full h-20 bg-white shrink-0 flex gap-3'>
        <div className=' flex-1 text-[24px] place-self-center px-4'>
          <input type="text" placeholder='Search...' className=' w-1/2 px-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-md focus:outline-none' />
        </div>
      </section >

      {/* Progress */}
      <section className=' bg-white flex-1'>
        
      </section >
    </div>
  )
}

export default Task