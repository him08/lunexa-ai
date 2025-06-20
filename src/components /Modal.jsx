import { useState, useEffect } from 'react'
import '../App.css'
import { Search } from 'lucide-react';
import { X } from 'lucide-react';
import { ClockArrowUp } from 'lucide-react';
import { CircleCheck } from 'lucide-react';
import { Video } from 'lucide-react';
import { Loader } from 'lucide-react';
import { CircleX } from 'lucide-react';
import { ChevronsUpDown } from 'lucide-react'
import axios from 'axios';



function Modal({ fromAgents, setShowModal }) {
    // MEETINGSS >>
    const [meetingAgent, setMeetingAgent] = useState("");
    const [meetingName, setMeetingName] = useState("");
    const [agents, setAgents] = useState([])
    // AGENTS >>
    const [agentName, setAgentName] = useState("");
    const [agentInstructions, setAgentInstructions] = useState("");


    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [agentSearch, setAgentSearch] = useState("");
    const [filteredAgents, setFilteredAgents] = useState(agents);

    useEffect(() => {
        console.log(filteredAgents)
    }, [filteredAgents])

    const getAgents = async () => {
        let response = await axios.get('http://localhost:5000/agents');
        let names = response?.data?.data?.map((agent) => agent.name)
        setAgents(names)
        setFilteredAgents(names)
    }
    useEffect(() => {
        !fromAgents && getAgents()
    }, [])

    useEffect(() => {
        const results = agents.filter(agent =>
            agent.toLowerCase().includes(agentSearch.toLowerCase())
        );
        setFilteredAgents(results);
    }, [agentSearch]);

    const onCreate = async () => {
        if (fromAgents && (!agentName || !agentInstructions)) {
            alert('name and instructions are required')
        }
        if (agentName && agentInstructions && fromAgents) {
            await axios.post('http://localhost:5000/agents', {
                name: agentName,
                instructions: agentInstructions
            });
            setAgentName("")
            setAgentInstructions("")
        }
        else {
            await axios.post('http://localhost:5000/meetings', {
                name: meetingName,
                agent: meetingAgent
            })
            setMeetingAgent("")
            setMeetingName("")
        }
    };

    const selectAgent = (agent) => {
        setAgentName(agent);
        setMeetingName(agent);
        setIsDropdownOpen(false);
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                <div className={`flex flex-col overflow-auto w-[600px] bg-white rounded-xl gap-4 mx-10 p-4 cursor-pointer transition-all duration-200 ${isDropdownOpen ? 'backdrop-blur-xs' : ''}`}>
                    <div className='flex flex-row items-center'>
                        <div className='text-lg font-black w-full'>{fromAgents ? "New Agent" : "New Meeting"}</div>
                        <div onClick={() => setShowModal(false)} className='cursor-pointer ml-auto'>
                            <X size={20} color='black' />
                        </div>
                    </div>

                    <div className='text-s font-extralight'>{fromAgents ? "Create a new agent" : "Create a new meeting"}</div>

                    <div>Name</div>
                    <div className='p-2 w-full h-10 bg-white flex items-center rounded-xl border-2 border-gray-300 focus-within:border-gray-400'>
                        <input
                            type='text'
                            value={fromAgents && agentName}
                            placeholder={fromAgents ? 'eg Math tutor' : 'eg Math consultations..'}
                            className='outline-none w-full text-sm'
                            onChange={(e) => {
                                setAgentName(e.target.value);
                                setMeetingName(e.target.value);
                            }}
                        />
                    </div>

                    <div>{fromAgents ? "Instructions" : "Agent"}</div>
                    {
                        !fromAgents ?
                            <div
                                onClick={() => setIsDropdownOpen(true)}
                                className='p-2 w-full h-10 bg-white flex items-center rounded-xl border-2 border-gray-300 cursor-pointer'
                            >
                                <div className='w-full text-sm text-gray-700'>{agentName || "Select an agent"}</div>
                                <ChevronsUpDown size={20} color='black' />
                            </div> :
                            <div className='p-2 w-full h-10 bg-white flex items-center rounded-xl border-2 border-gray-300 focus-within:border-gray-400'>
                                <input
                                    type='text'
                                    value={fromAgents && agentInstructions}
                                    placeholder={'You are a helpful math assistant who can help in assignments.'}
                                    className='outline-none w-full text-sm'
                                    onChange={(e) => setAgentInstructions(e.target.value)}
                                />
                            </div>
                    }

                    {!fromAgents && (
                        <div className='flex justify-center'>Not found what you are looking for? <span className='text-green-700 hover:underline'>Create a new agent</span></div>
                    )}

                    <div className='flex flex-row justify-between'>
                        <div onClick={() => setShowModal(false)} className="w-24 h-10 bg-white flex items-center justify-around rounded-xl hover:bg-gray-100 cursor-pointer">
                            <div className='font-normal text-s'>Cancel</div>
                        </div>
                        <div className="w-24 h-10 bg-green-700 flex items-center justify-around rounded-xl hover:bg-green-600 cursor-pointer">
                            <div onClick={onCreate} className='text-white font-normal'>Create</div>
                        </div>
                    </div>
                </div>

                {isDropdownOpen && (
                    <div className="absolute w-[600px] bg-white rounded-xl z-50 p-4 shadow-lg">
                        <div className='mb-2'>
                            <input
                                type="text"
                                value={agentSearch}
                                onChange={(e) => {
                                    setAgentSearch(e.target.value);
                                    setMeetingAgent(e.target.value)
                                }}
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
                                )
                                )
                            ) : (
                                <div className='text-gray-400 p-2'>No agents found</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
export default Modal