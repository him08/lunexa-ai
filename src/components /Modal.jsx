import { useState } from 'react'
import '../App.css'
import { Search } from 'lucide-react';
import { X } from 'lucide-react';
import { ClockArrowUp } from 'lucide-react';
import { CircleCheck } from 'lucide-react';
import { Video } from 'lucide-react';
import { Loader } from 'lucide-react';
import { CircleX } from 'lucide-react';
import { ChevronsUpDown } from 'lucide-react'
function Modal({ fromAgents,showModal, setShowModal }) {

    return (
        <>
            {
                showModal &&
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                    <div className='flex flex-col overflow-auto w-[600px] h-104 bg-[#FFFFFF] rounded-xl gap-4 mx-10 p-4 cursor-pointer'>
                        <div className='flex flex-row items-center'>
                            <div className='text-lg font-black w-full'>{ fromAgents ?"New Agent" : "New Meeting"}</div>
                            <div onClick={()=>setShowModal(false)} className='cursor-pointer ml-auto'>
                                <X size={20} color='black' />
                            </div>
                        </div>
                        <div className='text-s font-extralight'>{fromAgents ?"Create a new agent" :"Create a new meeting"}</div>
                        <div>Name</div>
                        <div className='p-2 w-full h-10 gap-2 bg-[#FFFFFF] flex items-center rounded-xl box-border size-32 border-2 border-gray-300  focus-within:border-gray-400 focus-within:border-3 focus-within:scale-105 transition-all duration-200'>
                            <input
                                type='text'
                                placeholder={fromAgents ?'eg Math tutor':'eg Math consultations..'}
                                className='outline-none w-full text-sm'>
                            </input>
                        </div>
                        <div> {fromAgents?"Instructions":"Agent"} </div>
                        <div className='p-2 w-full h-10 gap-2 bg-[#FFFFFF] flex items-center rounded-xl box-border border-2 border-gray-300  focus-within:border-gray-400 focus-within:border-3 focus-within:scale-105 transition-all duration-200'>
                            <input
                                type='text'
                                placeholder={fromAgents?'You are a helpful math assistant that can answer questions and help tutor':'eg Math Consultations..'}
                                className='outline-none w-full text-sm'>
                            </input>
                            <ChevronsUpDown size={20} color='black'/>
                        </div>
                       { !fromAgents &&
                        <div className='flex justify-center'>Not found what you are looking for? <span className='text-green-700 hover:underline'> Create a new agent</span></div>
                       }
                        <div className='flex flex-row justify-between'>
                            <div onClick={() => setShowModal(false)} className=" w-24 h-10  bg-[#FFFFFF] flex items-center justify-around rounded-xl hover:bg-[#F5F5F5] cursor-pointer">
                                <div className='font-normal text-s'>Cancel</div>
                            </div>
                            <div className="w-24 h-10  bg-green-700 flex items-center justify-around rounded-xl  hover:bg-green-600 cursor-pointer">
                                <div className=' text-white font-normal '>Create</div>
                            </div>
                        </div>
                    </div>

                </div>

            }







            {/* STATUS ONE >> */}
            {/* <div className='flex flex-col w-[580px] h-80 bg-[#FFFFFF] rounded-xl gap-4 mx-10 cursor-pointer'>
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

            </div> */}
        </>

    )
}

export default Modal;
