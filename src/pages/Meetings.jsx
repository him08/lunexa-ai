import { useState } from 'react'
import '../App.css'
import { Plus } from 'lucide-react'
import { Search } from 'lucide-react'
import { ChevronsUpDown } from 'lucide-react'
import Footer from '../components /Footer'
import Dashboard from '../components /Dashboard'
import Modal from '../components /Modal'

function Meetings() {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
         <Dashboard setShowModal={setShowModal}/>
         <div className='flex justify-center'>
        {showModal && <Modal setShowModal={setShowModal}/> }
         </div>
        </>

    )
}

export default Meetings
