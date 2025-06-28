
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
console.log(PUBLISHABLE_KEY)
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
      <App />
      </ClerkProvider>
    </BrowserRouter>
)
