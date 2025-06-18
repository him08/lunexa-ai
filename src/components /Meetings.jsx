import { useState } from 'react'
import '../App.css'
import { Plus } from 'lucide-react'
import { Search } from 'lucide-react'
import { ChevronsUpDown } from 'lucide-react'
import Footer from './Footer'
import Dashboard from './Dashboard'
import Modal from './Modal'

function Meetings() {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
         <Dashboard setShowModal={setShowModal}/>
         <div className='flex justify-center'>
         <Modal showModal={showModal} setShowModal={setShowModal}/>
         </div>
        </>

    )
}

export default Meetings
