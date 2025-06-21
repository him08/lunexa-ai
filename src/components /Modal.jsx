import { useState, useEffect } from 'react'
import '../App.css'
import { X } from 'lucide-react'
import { ChevronsUpDown } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Modal({ fromAgents, setShowModal }) {
    // MEETINGS
    const [meetingAgent, setMeetingAgent] = useState("");
    const [meetingName, setMeetingName] = useState("");
    const [agents, setAgents] = useState([]);

    // AGENTS
    const [agentName, setAgentName] = useState("");
    const [agentInstructions, setAgentInstructions] = useState("");

    // Dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [agentSearch, setAgentSearch] = useState("");
    const [filteredAgents, setFilteredAgents] = useState([]);
  
    const[changeAgentAvatar,setChangeAgentAvatar]=useState();
    const getAgents = async () => {
        let response = await axios.get('http://localhost:5000/agents');
        let names = response?.data?.data?.map(agent => agent.name);
        setAgents(names);
        setFilteredAgents(names);
    };
    // AVATAR LOGICC >>
    const avatars = ["/bots1.png","/bots2.png","/bots3.png","/bots4.png","/bot5.png", "/bot6.png", "/bot7.png", "/bot8.png", "/bot9.png","/bot10.png","/botts.png"];
    useEffect(()=>{
        if(!fromAgents || agentName.trim() === "") {
            setChangeAgentAvatar("/bot5.png");
            return;
        }
        const timer=setTimeout(()=>{
            const randomAvatar= avatars[Math.floor(Math.random()* avatars.length)];
            setChangeAgentAvatar(randomAvatar);    
        },100);

    return () => clearTimeout(timer);
    },[agentName])

    useEffect(() => {
        if (!fromAgents) getAgents();
    }, []);

    useEffect(() => {
        const results = agents.filter(agent =>
            agent.toLowerCase().includes(agentSearch.toLowerCase())
        );
        setFilteredAgents(results);
    }, [agentSearch, agents]);

    
    const onCreate = async () => {
        if (fromAgents) {
            if (!agentName || !agentInstructions) {
                toast.error('Name and instructions are required');
                return;
            }
            await axios.post('http://localhost:5000/agents', {
                avatar:changeAgentAvatar,
                name: agentName,
                instructions: agentInstructions
            });
            setAgentName("");
            setAgentInstructions("");
            toast.success("Agent created successfully!");
      
        } else {
            await axios.post('http://localhost:5000/meetings', {
                name: meetingName,
                agent: meetingAgent
            });
            setMeetingAgent("");
            setMeetingName("");
            toast.success("Meeting created successfully!");
        }
        setShowModal(false);
       
    };

    const selectAgent = (agent) => {
        setMeetingAgent(agent);
        setIsDropdownOpen(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className={`flex flex-col overflow-auto w-[600px] bg-white rounded-xl gap-4 mx-10 p-4 cursor-pointer transition-all duration-200`}>
                <div className='flex flex-row items-center'>
                    <div className='text-lg font-black w-full'>{fromAgents ? "New Agent" : "New Meeting"}</div>
                    <div onClick={() => setShowModal(false)} className='cursor-pointer ml-auto'>
                        <X size={20} color='black' />
                    </div>
                </div>

                <div className='text-s font-extralight'>
                    {fromAgents ? "Create a new agent" : "Create a new meeting"}
                    {/* AVATAR >>> */}
                    {
                    fromAgents &&
                    <div className='self-start rounded-full overflow-hidden w-30 h-30 '>
                        <img src={changeAgentAvatar || "/bot5.png"} className='w-full h-full object-cover' 
                        onError={(e) => (e.target.src = "/bot5.png")}></img>
                    </div>
                }
                </div>
             

                {/* Name Field */}
                <div>Name</div>
                {fromAgents ? (
                    <div className='p-2 w-full h-10 bg-white flex items-center rounded-xl border-2 border-gray-300 focus-within:border-gray-400'>
                        <input
                            type='text'
                            value={agentName}
                            placeholder='eg Math tutor'
                            className='outline-none w-full text-sm'
                            onChange={(e) => setAgentName(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className='p-2 w-full h-10 bg-white flex items-center rounded-xl border-2 border-gray-300 focus-within:border-gray-400'>
                        <input
                            type='text'
                            value={meetingName}
                            placeholder='eg Math consultations..'
                            className='outline-none w-full text-sm'
                            onChange={(e) => setMeetingName(e.target.value)}
                        />
                    </div>
                )}

                {/* Agent / Instructions Field */}
                <div>{fromAgents ? "Instructions" : "Agent"}</div>
                {!fromAgents ? (
                    <div
                        onClick={() => setIsDropdownOpen(true)}
                        className='p-2 w-full h-10 bg-white flex items-center rounded-xl border-2 border-gray-300 cursor-pointer'
                    >
                        <div className='w-full text-sm text-gray-700'>
                            {meetingAgent || "Select an agent"}
                        </div>
                        <ChevronsUpDown size={20} color='black' />
                    </div>
                ) : (
                    <div className='p-2 w-full h-10 bg-white flex items-center rounded-xl border-2 border-gray-300 focus-within:border-gray-400'>
                        <input
                            type='text'
                            value={agentInstructions}
                            placeholder='You are a helpful math assistant who can help in assignments.'
                            className='outline-none w-full text-sm'
                            onChange={(e) => setAgentInstructions(e.target.value)}
                        />
                    </div>
                )}

                {/* Dropdown Link */}
                {!fromAgents && (
                    <div className='flex justify-center text-sm'>
                        Not found what you're looking for?{" "}
                        <span className='ml-1 text-green-700 hover:underline'>
                            Create a new agent
                        </span>
                    </div>
                )}

                {/* Footer Buttons */}
                <div className='flex flex-row justify-between'>
                    <div
                        onClick={() => setShowModal(false)}
                        className="w-24 h-10 bg-white flex items-center justify-around rounded-xl hover:bg-gray-100 cursor-pointer"
                    >
                        <div className='font-normal text-s'>Cancel</div>
                    </div>
                    <div
                        onClick={onCreate}
                        className="w-24 h-10 bg-green-700 flex items-center justify-around rounded-xl hover:bg-green-600 cursor-pointer"
                    >
                        <div className='text-white font-normal'>Create</div>
                    </div>
                </div>
            </div>

            {/* Agent Dropdown */}
            {isDropdownOpen && (
                <div className="absolute w-[600px] bg-white rounded-xl z-50 p-4 shadow-lg">
                    <div className='mb-2'>
                        <input
                            type="text"
                            value={agentSearch}
                            onChange={(e) => setAgentSearch(e.target.value)}
                            placeholder="Search agents..."
                            className='w-full border border-gray-300 rounded-md p-2 outline-none text-sm'
                        />
                    </div>
                    <div className='max-h-60 overflow-y-auto'>
                        {filteredAgents.length > 0 ? (
                            filteredAgents.map((agent, index) => (
                                <div
                                    key={index}
                                    className='p-2 hover:bg-gray-100 rounded-md cursor-pointer'
                                    onClick={() => selectAgent(agent)}
                                >
                                    {agent}
                                </div>
                            ))
                        ) : (
                            <div className='text-gray-400 p-2'>No agents found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Modal;
