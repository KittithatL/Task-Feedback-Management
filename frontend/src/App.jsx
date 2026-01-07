import './App.css'
import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/navbar"
import Leftbar from '../Components/leftbar';
import Project from '../Components/project'

function App() {
  return (
    <div className=' min-h-screen bg-[#F6E2DC] flex flex-col overflow-hidden'>
      {/* Header */}
      <div className=' h-15 bg-[#FCF2F0] rounded-b-3xl'>
        <Navbar />
      </div>

      {/* Body */}
      <div className=' min-w-screen flex-1 h-full flex'>

        <div className=' w-1/4'>
          {/* Left */}
          <Leftbar />
        </div>

        <div className=' w-full'>
          {/* Right */}
          <Routes>
            <Route path='/project' element={<Project />} />
          </Routes>
        </div>

      </div>
    </div>
  )
}

export default App
