import './App.css'
import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/navbar"
import Task from '../Components/Task';
import Dashborad from '../Components/Dashborad';
import Teams from '../Components/Teams';
import Inventory from '../Components/Inventory';
import Reports from '../Components/Reports';

function App() {
  return (
    <div className=' min-h-screen bg-[#FAF3E3] flex flex-col overflow-hidden'>
      <div className='shrink-0'>
        <Navbar />
      </div>

      <div className=' flex-1 pt-10 px-10 pb-10 flex flex-col min-h-0'>
          <Routes>  
            <Route path='/' element={<Dashborad />} />
            <Route path='/Task' element={<Task />} />
            <Route path='/Teams' element={<Teams />} />
            <Route path='/Inventory' element={<Inventory />} />
            <Route path='/Reports' element={<Reports />} />
          </Routes>
      </div>
    </div>
  )
}

export default App
