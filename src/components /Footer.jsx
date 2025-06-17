import { useState } from 'react'
import '../App.css'

function Footer() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className='flex flex-row justify-between items-center  px-7 mt-4'>
                <div>Page 1 of 1</div>
                <div className='flex flex-row gap-2'>
                <div className="p-2 w-20 h-8 gap-2 bg-[#FFFFFF] flex items-center justify-center rounded-md box-border size-32 border-2 border-gray-300  hover:bg-[#F5F5F5] cursor-pointer">
                    <div className='font-extralight text-s'>Previous</div>
                </div>
                <div className="p-2 w-20 h-8 gap-2 bg-[#FFFFFF] flex items-center justify-center rounded-md box-border size-32 border-2 border-gray-300  hover:bg-[#F5F5F5] cursor-pointer">
                    <div className='font-extralight text-s'>Next</div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Footer
