import { useState } from 'react'
import '../App.css'
import { Plus } from 'lucide-react'
import { Search } from 'lucide-react'
import { ChevronsUpDown } from 'lucide-react'
import Footer from './Footer'
import Dashboard from './Dashboard'

function Agents() {
    const [count, setCount] = useState(0)

    return (
        <>
         <Dashboard fromAgents={true} />
        </>

    )
}

export default Agents
