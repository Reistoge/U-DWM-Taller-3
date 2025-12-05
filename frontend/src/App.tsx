import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
 import './App.css'
import Dashboard from './Pages/Dashboard'
import Registers from './Pages/Registers'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/registers" element={<Registers/>}/>

        {/* Add more routes here */}
      </Routes>
    </Router>
  )
}

export default App
