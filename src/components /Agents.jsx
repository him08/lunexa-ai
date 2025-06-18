import { useState } from 'react'
import '../App.css'
import { Plus } from 'lucide-react'
import { Search } from 'lucide-react'
import { ChevronsUpDown } from 'lucide-react'
import Footer from './Footer'
import Dashboard from './Dashboard'
import Modal from './Modal'

function Agents() {

    const [showModal, setShowModal] = useState(false)
    return (
        <>
         <Dashboard  setShowModal={ setShowModal} fromAgents={true} />
         <Modal fromAgents={true} showModal={showModal} setShowModal={setShowModal}/>
        </>

    )
}

export default Agents
