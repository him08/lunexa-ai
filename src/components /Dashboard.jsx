import { useEffect, useState } from 'react'
import '../App.css'
import { Plus } from 'lucide-react'
import { Search } from 'lucide-react'
import { ChevronsUpDown } from 'lucide-react'
import Footer from './Footer'
import { CornerDownRight } from 'lucide-react'
import { Video } from 'lucide-react'
import {ClockFading} from 'lucide-react'
import { ClockArrowUp } from 'lucide-react'
import {Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MeetingDetails from './MeetingDetails'
// import { SignedIn, SignedOut, SignInButton,useUser} from '@clerk/clerk-react';
import { useUser, SignInButton, useClerk } from '@clerk/clerk-react';
import { RedirectToSignIn } from '@clerk/clerk-react'
import { useAuth } from '@clerk/clerk-react';
import { jwtDecode } from "jwt-decode";
import axiosClient from '../utilities/axiosConfig'
import Cookies from "js-cookie";



// DELETE MEETINGS >>>>>>>

const deleteMeeting=(id)=> {
    console.log(id)
   let res= axiosClient.delete(`http://localhost:5000/meetings/${id}`)
   console.log(res.data)
}
const mapMeet = (e) => {
    const obj = {
        name: e.name,
        agent: e.agent,
        _id: e._id

    }
    return obj;
}


function Dashboard({ fromAgents, setShowModal ,triggerMeetingUpdate,setTriggerMeetingUpdate,setTriggerAgentUpdate,triggerAgentUpdate}) {
    const navigate= useNavigate()
    const [agents, setAgents] = useState([])
    const [meetings, setMeetings] = useState([])
    const [searchTerm,setSearchTerm] =useState("")
    const [currentPage,setCurrentPage]=useState(1)
    const itemsPerPage =5
    const indexOfLastItem =currentPage * itemsPerPage
    const indexOfFirstItem= indexOfLastItem - itemsPerPage
    const [redirectToSignIn,setRedirectToSignIn]=useState(false)
    const token = Cookies.get('auth')
    
    const { user, isSignedIn } = useUser();
    const { getToken, sessionId } = useAuth();

    // const fetchToken = async () => {
    //     const token = await getToken();
    //     const decoded = jwtDecode(token);
    //     console.log("Token:", token);
    //     console.log("Decoded Token:", decoded);
    // console.log("User ID:", decoded.sub);
    //   };
    // if(isSignedIn){
    // fetchToken()
    // }

    const setTokenCookie = async () => {
            const token = await getToken({template: 'JWT'});
            Cookies.set("auth", token);
            window.location.reload()
    }
    useEffect(() => {
        if(isSignedIn && !token){
        setTokenCookie()
        }
        else if(isSignedIn === false && token){
            Cookies.remove("auth")
            window.location.reload()
        }
    },[isSignedIn])


    // FOR SIGN IN FOR CLERK >>>
    const handleNewClick = () => {
        if (isSignedIn) {
            setShowModal(true);
        } else {
            // Trigger Sign In popup
          setRedirectToSignIn(true)
        }
    };
    const mapFunc = (e) => {
        const obj = {
            name: e.name,
            avatar: e.avatar,
            instructions: e.instructions
        }
        return obj;
    }

    const filteredAgents =agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const filteredMeetings = meetings.filter(meeting =>
        meeting.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    const paginatedAgents =filteredAgents.slice(indexOfFirstItem,indexOfLastItem)
    const paginatedMeetings=filteredMeetings.slice(indexOfFirstItem,indexOfLastItem)
    
    const displayMeetings = (e) => {
        return (
          
            <>     
                <div className='flex flex-col space-y-1 hover:bg-gray-100 cursor-pointer'onClick={()=> navigate(`/meetings/${e._id}`)}>
                    {/* AVATAR AND NAME */}
                    <div className=' flex mt-3 ml-3 flex-row items-center w-full relative'>
                    
                        <div className='flex justify-start font-bold flex-1'>{e.name}</div>
                        <div className='flex justify-around mr-40 items-center gap-50'>
                        {/* MEETINGS */}
                        <div className='px-2 py-1 text-xs bg-gray-100 font-normal flex items-center gap-2 rounded-md'>
                            <ClockFading size={14} color='blue' />
                            <span>Upcoming</span>
                        </div>
                        <div className='px-2 py-1 text-xs bg-gray-100 font-normal flex items-center gap-2 rounded-md'>
                        <ClockArrowUp  size={14} color='blue' />
                            <span>No duration</span>
                        </div>
                        <div onClick={()=>deleteMeeting(e._id)} className='text-xs bg-white font-normal flex items-center gap-2 rounded-md'>
                        <Trash2 size={14} color='red' />
                        </div>
                      
                        </div>
                    </div>
                    {/* INSTRUCTIONS */}
                    <div className=' flex flex-row mt-0 ml-4 mb-2 p-1 gap-2 items-center'>
                        <div><CornerDownRight color='gray' size={20} /></div>
                        <div>{e.agent.name}</div>
                        <img height={25} width={40} src={e.agent.avatar} />
                    </div>
                    <div className=' hover:bg-gray-100 h-0.5 bg-gray-200 rounded-xl '></div>
                </div>
            </>
        )


    }
    //    DISPLAY AGENT ON SCREEN DASHBOARD >>>>
    const displayAgent = (e) => {
        return (
            <>
                <div className='flex flex-col space-y-1 hover:bg-gray-100 cursor-pointer'>
                    {/* AVATAR AND NAME */}
                    <div className=' flex flex-row items-center w-full relative'>
                        <img height={40} width={50} src={e.avatar} />
                        <div className='font-bold'>{e.name}</div>

                        {/* MEETINGS */}
                        <div className='absolute right-4 px-2 py-1 mr-50 text-xs bg-gray-100 font-normal flex items-center gap-2 rounded-md'>
                            <Video size={14} color='blue' />
                            <span>3 Meetings</span>
                        </div>

                    </div>
                    {/* INSTRUCTIONS */}
                    <div className=' flex flex-row mt-0 ml-4 mb-2 p-1 gap-2 items-center'>
                        <div><CornerDownRight color='gray' size={20} /></div>
                        <div>{e.instructions}</div>

                    </div>
                    <div className=' hover:bg-gray-100 h-0.5 bg-gray-200 rounded-xl '></div>
                </div>
            </>
        )
    }

    const getMeetings = async () => {
        let response = await axiosClient.get('http://localhost:5000/meetings')
        let meetingsData = response?.data?.data
        let filteredMeetings = meetingsData.map(mapMeet)
        setMeetings(filteredMeetings)
    }

    const getAgents = async () => {
        let response = await axiosClient.get('http://localhost:5000/agents')
        let agentData = response?.data?.data
        let filteredAgentData = agentData.map(mapFunc)


        setAgents(filteredAgentData);

    }

    useEffect(()=>{
        if(triggerMeetingUpdate){
            getMeetings()
            setTriggerMeetingUpdate(false)
        }
    },[triggerMeetingUpdate])

    useEffect(()=>{
        if(triggerAgentUpdate){
            getAgents()
            setTriggerAgentUpdate(false)
        }
    },[triggerAgentUpdate])

    useEffect(() => {
        if (!fromAgents && isSignedIn) {
            getMeetings()
        }
    }, [!fromAgents,isSignedIn])

    useEffect(() => {
        if (fromAgents && isSignedIn) {
            getAgents()
        }
    }, [fromAgents,isSignedIn])

    return (
        <>
          { redirectToSignIn && <RedirectToSignIn/>
            }
            <div className='bg-[#F5F5F5] h-full w-full flex-col '>
                <div className=' p-5 mt-3 flex row justify-between'>
                    <div className='text-xl font-medium'>{fromAgents ? "My Agents" : "My Meetings"}</div>
                    {/* NEW MEETING BUTTON */}
                    <div onClick={handleNewClick} className=' mx-5 w-36 h-12 gap-2 bg-[#3BAC5D] flex justify-center items-center rounded-lg cursor-pointer hover:bg-green-600'>
                        <div><Plus size={20} color='white' /></div>
                        <div className='font-medium text-s text-white' > {fromAgents ? "New Agent" : "New Meeting"}</div>
                    </div>
                </div>
                <div className='flex flex-row '>
                    {/* FILTER BUTTON */}
                    <div className='p-2 mx-5 w-44 h-10 gap-2 bg-[#FFFFFF] flex items-center rounded-xl box-border size-32 border-2 border-gray-300  focus-within:border-gray-400 focus-within:border-3 focus-within:scale-105 transition-all duration-200'>
                        <div> <Search size={20} color="black" /></div>
                        <input name='Search'
                            value={searchTerm}
                            type='text'
                            placeholder='Filter by name'
                            className='outline-none w-full text-sm'
                            onChange={(e)=>setSearchTerm(e.target.value)}>
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
                <div className='bg-[#FFFFFF] m-7 flex-col justify-center items-center rounded-xl'>
                    <div className='font-extralight text-s'
                    >

                        {fromAgents ?
                            (
                                paginatedAgents.length > 0 ? (
                                 paginatedAgents.map(displayAgent)
                                )
                                    : (
                                        <div className='h-30 flex justify-center items-center font-light' >
                                            No results.
                                        </div>
                                    )
                            )
                            :
                            (
                                paginatedMeetings.length > 0 ? (
                                    paginatedMeetings.map(displayMeetings)
                                ) : (
                                    <div className='h-30 flex justify-center items-center font-light'>
                                        No results.
                                    </div>
                                )
                            )}


                    </div>
                </div>
                < Footer  
                 currentPage={currentPage} 
                 totalPages={Math.ceil((fromAgents ? filteredAgents.length : filteredMeetings.length) / itemsPerPage)} 
                 setCurrentPage={setCurrentPage} 
                />
                {
                    (!agents || !meetings) &&
                    <>
                        <div className='flex justify-center items-center'><img className="w-86 h-56" src="/processing.svg"></img></div>
                        <div className='flex justify-center items-center font-medium'>{fromAgents ? "Create your first Agent" : "Create your first Meeting"}</div>
                        </>
                }
                
            </div>
        </>

    )
}

export default Dashboard
