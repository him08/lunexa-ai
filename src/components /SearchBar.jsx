import { useState } from 'react'
import '../App.css'
import { PanelLeftClose } from 'lucide-react'
import { Search } from 'lucide-react'

function SearchBar() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="flex items-center bg-[#FFFFFF] gap-4 text-white p-4 shadow-md w-full">
    {/* CLOSE SIDE BAR BUTTON */}
    <div className='w-10 h-10 flex justify-center items-center box-border size-32 border-2 border-gray-300 hover:bg-[#F5F5F5] rounded-xl shadow-md '>
    <PanelLeftClose color="black" size={20}/>
    </div>
    <div className=' p-2 w-66 h-10 box-border size-32 border-2 border-gray-300 shadow-md hover:bg-[#F5F5F5] flex justify-start gap-2 items-center rounded-xl'>
        <Search size={20} color="black" />
        <div className='text-black'>Search</div>
    </div>
    </div>
    </>
  )
}

export default SearchBar;
