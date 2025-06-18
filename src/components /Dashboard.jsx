import { useState } from 'react'
import '../App.css'
import { Plus } from 'lucide-react'
import { Search } from 'lucide-react'
import { ChevronsUpDown } from 'lucide-react'
import Footer from './Footer'

function Dashboard({fromAgents,setShowModal}) {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className='bg-[#F5F5F5] h-full w-full flex-col '>
                <div className=' p-5 mt-3 flex row justify-between'>
                    <div className='text-xl font-medium'>{fromAgents ? "My Agents" : "My Meetings"}</div>
                    {/* NEW MEETING BUTTON */}
                    <div onClick={()=>setShowModal(true)}className=' mx-5 w-36 h-12 gap-2 bg-[#3BAC5D] flex justify-center items-center rounded-lg cursor-pointer hover:bg-green-600'>
                        <div><Plus size={20} color='white' /></div>
                        <div className='font-medium text-s text-white'> {fromAgents ? "New Agent" :"New Meeting"}</div>
                    </div>
                </div>
                <div className='flex flex-row '>
                    {/* FILTER BUTTON */}
                    <div className='p-2 mx-5 w-44 h-10 gap-2 bg-[#FFFFFF] flex items-center rounded-xl box-border size-32 border-2 border-gray-300  focus-within:border-gray-400 focus-within:border-3 focus-within:scale-105 transition-all duration-200'>
                        <div> <Search size={20} color="black" /></div>
                        <input name='Search'
                            type='text'
                            placeholder='Filter by name'
                            className='outline-none w-full text-sm'>
                        </input>
                    </div>
                    {/* STATUS */}

                    {!fromAgents &&
                    <>
                    <div className="p-2 mx-5 w-32 h-10 gap-2 bg-[#FFFFFF] flex items-center justify-around rounded-xl box-border size-32 border-2 border-gray-300  hover:bg-[#F5F5F5] cursor-pointer">
                        <div className='font-extralight text-s'>Status</div>
                        <div><ChevronsUpDown size={20} color="black" /></div>
                    </div>
                    {/* AGENT */}
                    <div className="p-2 mx-5 w-32 h-10 gap-2 bg-[#FFFFFF] flex items-center justify-around rounded-xl box-border size-32 border-2 border-gray-300  hover:bg-[#F5F5F5] cursor-pointer">
                        <div className='font-extralight text-s'>Agent</div>
                        <div><ChevronsUpDown size={20} color="black" /></div>
                    </div>
                    </>
                   }
                </div>
                {/* RESULT BOX */}
                <div className='bg-[#FFFFFF] h-20 m-7 flex justify-center items-center rounded-xl'>
                <div className='font-extralight text-s'>No results.</div>
                </div>
            < Footer />
            <div className='flex justify-center items-center'><img className="w-86 h-56" src="/processing.svg"></img></div>
            <div className='flex justify-center items-center font-medium'>{fromAgents ? "Create your first Agent": "Create your first Meeting"}</div>
            
         
            </div>
        </>

    )
}

export default Dashboard
