import { useState } from 'react'
import '../App.css'
import { PanelLeftClose } from 'lucide-react'
import { Search } from 'lucide-react'
import { PanelLeft } from 'lucide-react'

function SearchBar({ setShowSideBar, showSideBar }) {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex items-center bg-[#FFFFFF] gap-4 text-white p-4 shadow-md w-full">
        {/* CLOSE SIDE BAR BUTTON */}
        <div onClick={() => setShowSideBar((prev) => !prev)} className={`flex w-10 h-10 justify-center items-center box-border border-2 border-gray-300 hover:bg-[#F5F5F5] rounded-xl shadow-md cursor-pointer `}>
          {
            showSideBar
              ? <PanelLeftClose color="black" size={20} />
              : <PanelLeft color="black" size={20} />
          }
        </div>
      </div>
    </>
  )
}

export default SearchBar
