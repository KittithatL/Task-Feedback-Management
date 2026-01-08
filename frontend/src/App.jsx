import './App.css'
import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/navbar"
import Leftbar from '../Components/leftbar';
import Project from '../Components/project';
import Task from '../Components/Task'; // 1. อย่าลืม Import หน้า Task เข้ามา

function App() {
  return (
    <div className='min-h-screen max-h-screen bg-[#F6E2DC] flex flex-col overflow-hidden'>
      {/* Header */}
      <div className='h-15 bg-[#FCF2F0] rounded-b-3xl'>
        <Navbar />
      </div>

      {/* Body */}
      <div className='min-w-screen h-full flex-1 flex'>

        <div className='w-1/4'>
          {/* Left */}
          <Leftbar />
        </div>

        <div className='w-full'>
          {/* Right */}
          <Routes>
            {/* หน้าแสดงโปรเจกต์ทั้งหมด */}
            <Route path='/project' element={<Project />} />
            
            {/* 2. เพิ่ม Route สำหรับหน้า Task โดยใช้ :projectId เป็นตัวแปร dynamic */}
            <Route path='/project/:projectId/tasks' element={<Task />} />
            
            {/* แถม: หน้า Dashboard หรือหน้าอื่นๆ ถ้ามี */}
            <Route path='/' element={<div className="p-10 text-4xl font-bold">Dashboard</div>} />
          </Routes>
        </div>

      </div>
    </div>
  )
}

export default App