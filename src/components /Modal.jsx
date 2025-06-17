import { useState } from 'react'
import '../App.css'
import { Search } from 'lucide-react';
import { X } from 'lucide-react';
import { ClockArrowUp } from 'lucide-react';
import { CircleCheck } from 'lucide-react';
import { Video } from 'lucide-react';
import { Loader } from 'lucide-react';
import { CircleX } from 'lucide-react';
function Modal() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className='flex flex-col w-[580px] h-80 bg-[#FFFFFF] rounded-xl gap-4 mx-10 cursor-pointer'>
                <div className=' p-2 flex flex-row items-center gap-2'>
               
                    <div className='flex items-center gap-2 w-full rounded-md px-1 py-1'>
                        <Search size={20} />
                        <input
                            name="status"
                            type="text"
                            placeholder="Search..."
                            className="outline-none text-sm"
                        />
                    </div>
                    <X size={20} color="black" />
                </div>
                <div className='p-2 flex flex-row hover:bg-[#F5F5F5]'>
                    <ClockArrowUp size={20} color="black" />
                    <div className='mx-2'>Upcoming</div>
                </div>
                <div className='flex flex-row p-2 hover:bg-[#F5F5F5]'>
                    <CircleCheck size={20} color="black" />
                    <div className='mx-2'>Completed</div>
                </div>
                <div className='flex flex-row  p-2 hover:bg-[#F5F5F5]'>
                    <Video size={20} color="black" />
                    <div className='mx-2'>Active</div>
                </div>
                <div className='flex flex-row  p-2 hover:bg-[#F5F5F5]'>
                    <Loader size={20} color="black" />
                    <div className='mx-2'>Processing</div>
                </div>
                <div className='flex flex-row  p-2 hover:bg-[#F5F5F5]'>
                    <CircleX size={20} color="black" />
                    <div className='mx-2'>Cancelled</div>
                </div>

            </div>
        </>

    )
}

export default Modal;
