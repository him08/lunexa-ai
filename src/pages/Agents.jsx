import { useState } from 'react'
import '../App.css'
import { Plus } from 'lucide-react'
import { Search } from 'lucide-react'
import { ChevronsUpDown } from 'lucide-react'
import Footer from '../components /Footer'
import Dashboard from '../components /Dashboard'
import Modal from '../components /Modal'

function Agents() {

    const [showModal, setShowModal] = useState(false)
    const [triggerAgentUpdate, setTriggerAgentUpdate] = useState(false)
    return (
        <>
         <Dashboard  setShowModal={ setShowModal} fromAgents={true} setTriggerAgentUpdate={setTriggerAgentUpdate} triggerAgentUpdate={triggerAgentUpdate}/>
         {showModal && <Modal fromAgents={true} setShowModal={setShowModal} setTriggerAgentUpdate={setTriggerAgentUpdate}/> }
        </>

    )
}

export default Agents
