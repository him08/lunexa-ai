import { X, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosClient from '../utilities/axiosConfig';
function BotModal({ setShowBotModal }) {
    const [messages, setMessages] = useState([
        { from: "bot", text: "👋 Welcome! Please select an agent to start." }
    ]);
    const [userInput, setUserInput] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("");
    const [agents, setAgents] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    // as soon as the user selects the agent >>>

    const onAgentSelect = async (e) => {
        const agentName = e.target.value
        setSelectedAgent(agentName)
        console.log(e.target.value)
        setMessages(prev => [
            ...prev,
            { from: "bot", text: `Hey, you selected ${e.target.value}` }
        ]);

        const API_URL = import.meta.env.VITE_API_URL;
        const foundAgent = agents.find(agent => agent.name === agentName)
        const instructions = foundAgent?.instructions
        const prompt = `Act like agent ${agentName} your instructions are ${instructions} you have to stick only to these instructions and respond according to them, now please answer all my questions based ont this."}`
        let response = await axiosClient.post(`${API_URL}/generate-response`, {
            prompt: prompt
        })
        console.log("ishan", response?.data?.reply)
        setMessages(prev => [...prev, { from: "bot", text: response?.data?.reply }])

    }
    const mapFunc = (e) => {
        const obj = {
            name: e.name,
            instructions: e.instructions,
            avatar: e.avatar

        }
        return obj
    }

    const findAgent = (agent) => {
        if (agent.name === selectedAgent) {
            return true;
        }
    }

    // as soon as the user sends questions 

    const sendMessage = async () => {
        if (!userInput.trim() || !selectedAgent) return;
        const userMessage = userInput.trim()
        setMessages([...messages, { from: "user", text: userInput }]);
        setUserInput("");
        try {
            const foundAgent = agents.find(agent => agent.name === selectedAgent)
            const instructions = foundAgent?.instructions
            const chatHistory = messages.map(msg => `${msg.from === "user" ? 'User' : 'Agent'}:${msg.text}`).join('\n')
            const prompt = `you are agent ${selectedAgent}.You strictly adhere these instructions :${instructions}.
        Never answer questions that are not related to your domain.You must always refuse to answer the other domain questions and must say that you are sorry that you cant answer this domain specific questions and request to switch to some other agent 
        Now continue this conversation based only on the instructions above.
        Here is the conversation so far:
        ${chatHistory} Here is the last question of user 
        "${userMessage}". Answer it accordingly .`
        console.log(prompt)
            const response = await axiosClient.post(`${API_URL}/generate-response`, {
                prompt: prompt
            })
            const botReply = response?.data?.reply || "Sorry, I couldn't process that.";
            setMessages(prev => [...prev, { from: "bot", text: botReply }]);
        }
        catch (err) {
            console.error("Error:", err);
            setMessages(prev => [...prev, { from: "bot", text: "❌ Failed to get response from the bot." }]);
        }


    };

    const getAgents = async () => {
        let response = await axiosClient.get(`${API_URL}/agents`)
        let agentData = response?.data?.data
        let filteredAgentData = agentData.map(mapFunc)

        setAgents(filteredAgentData);



    }
    useEffect(() => {
        // Simulate API call

        getAgents();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="flex flex-col w-full max-w-[680px] h-full max-h-[700px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden relative">

                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white">
                    <h2 className="text-lg font-semibold flex items-center gap-2"><Bot size={20} /> Support Chat</h2>
                    <X onClick={() => setShowBotModal(false)} className="cursor-pointer hover:scale-110 transition-transform" />
                </div>

                {/* Agent Selection */}
                <div className="px-4 py-3 bg-gray-50 border-b">
                    <label className="text-sm font-medium text-gray-700">Select Agent</label>
                    <select
                        value={selectedAgent}
                        onChange={(e) => onAgentSelect(e)}
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-emerald-600 focus:border-emerald-600 outline-none cursor-pointer"
                    >
                        <option value="">-- Choose an agent --</option>
                        {agents.map((agent, idx) => (
                            <option key={idx} value={agent.name}>{agent.name}</option>
                        ))}
                    </select>
                </div>

                {/* Messages Area */}
                <div className="flex flex-col flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`px-4 py-2 max-w-[70%] text-sm rounded-xl ${msg.from === "user" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="flex items-center gap-2 p-3 border-t bg-white">
                    <input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={selectedAgent ? "Type a message..." : "Select an agent first"}
                        className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-emerald-600 focus:border-emerald-600"
                        disabled={!selectedAgent}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!selectedAgent || !userInput.trim()}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedAgent && userInput.trim()
                                ? 'bg-emerald-600 text-white hover:bg-emerald-600 cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BotModal;
