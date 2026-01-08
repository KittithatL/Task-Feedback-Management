import React, { useState } from 'react'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Plus from "../Public/Logo/plus.svg"
import axios from 'axios'

const Leftbar = () => {
  const location = useLocation();
  const { projectId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(""); 
  const [deadline, setDeadline] = useState(""); // เพิ่ม State สำหรับ Deadline
  const [isLoading, setIsLoading] = useState(false);

  const isTaskPage = location.pathname.includes('/tasks');

  const mockUser = { 
    id: "659b8c1234567890abcdef12", 
    name: "นายสมชาย สายปั่น" 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert(isTaskPage ? "กรุณาใส่ชื่อ Task" : "กรุณาใส่ชื่อโปรเจกต์");

    setIsLoading(true);
    try {
      if (isTaskPage) {
        const currentId = projectId || location.pathname.split('/')[2];
        await axios.post(`http://127.0.0.1:8000/tasks/`, {
          project_id: currentId,
          task_title: title,
          description: "",
          deadline: deadline || null, // ส่งค่าวันที่ที่เลือก หรือ null
          status: 'TODO',
          created_by: mockUser.id,
          assigned_to: mockUser.id
        });
      } else {
        await axios.post('http://127.0.0.1:8000/projects/', {
          project_title: title,
          created_by: mockUser.id
        });
      }

      setTitle("");
      setDeadline(""); // ล้างค่า deadline
      setIsModalOpen(false);
      window.location.reload(); 

    } catch (error) {
      console.error("Error:", error.response?.data);
      alert("ล้มเหลว: " + (error.response?.data?.detail?.[0]?.msg || "ตรวจสอบข้อมูลอีกครั้ง"));
    } finally {
      setIsLoading(false);
    }
  };

  const linkStyle = "flex items-center justify-center w-full hover:text-white hover:bg-[#E88F7F] text-[#4F4B48] transition-all duration-200";
  const activeClass = ({ isActive }) => isActive ? `${linkStyle} bg-[#E88F7F] text-white` : linkStyle;

  return (
    <motion.div initial="hidden" animate="show" className='flex-col flex h-full place-items-center pt-10 gap-7'>
      
      {/* 1. Create Button */}
      <div className="h-16">
        <AnimatePresence mode="wait">
          {(location.pathname === '/project' || isTaskPage) && (
            <motion.button
              key={isTaskPage ? 'task-btn' : 'proj-btn'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => setIsModalOpen(true)}
              className='bg-[#EA9584] shadow-md w-72 h-14 text-[20px] font-bold rounded-full text-white flex items-center justify-center gap-2 hover:scale-105 transition-transform'
            >
              {isTaskPage ? "Create new task" : "Create new project"}
              <img src={Plus} alt="Plus" className='w-5 h-5' />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
            
      {/* 2. Menu Navigation (คงเดิม) */}
      <div className='bg-[#FDF1EE] w-80 h-80 rounded-[40px] shadow-md flex-col flex overflow-hidden border border-[#F9E6E2]'>
        <NavLink to="/" className={activeClass} style={{height: '20%'}}>Dashboard</NavLink>
        <NavLink to="/personnel" className={activeClass} style={{height: '20%'}}>Personnel</NavLink>
        <NavLink to="/inventory" className={activeClass} style={{height: '20%'}}>Inventory</NavLink>
        <NavLink to="/feedback" className={activeClass} style={{height: '20%'}}>Feedback</NavLink>
        <NavLink to="/project" className={activeClass} style={{height: '20%'}}>Projects</NavLink>
      </div>

      <div className='bg-[#FDF1EE] w-80 h-52 rounded-[40px] shadow-md flex-col flex overflow-hidden border border-[#F9E6E2]'>
        <NavLink to="/inbox" className={activeClass} style={{height: '33.33%'}}>Inbox</NavLink>
        <NavLink to="/note" className={activeClass} style={{height: '33.33%'}}>Note</NavLink>
        <NavLink to="/list" className={activeClass} style={{height: '33.33%'}}>List</NavLink>
      </div>

      {/* 3. Modal for New Task / Project */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[999]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white p-10 rounded-[40px] shadow-2xl z-10 w-[500px] border border-[#F9E6E2]">
              <h2 className="text-3xl font-bold text-[#4F4B48] mb-6">{isTaskPage ? "New Task" : "New Project"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 mb-8">
                  {/* Title Input */}
                  <div>
                    <label className="text-sm font-bold text-[#9B8186] ml-2">Title</label>
                    <input 
                      autoFocus 
                      className="w-full p-4 rounded-2xl bg-[#FAF0ED] border-2 border-transparent outline-none focus:border-[#EA9584] text-xl text-[#4F4B48]"
                      placeholder={isTaskPage ? "What needs to be done?" : "Project name..."}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Deadline Input (แสดงเฉพาะตอนสร้าง Task) */}
                  {isTaskPage && (
                    <div>
                      <label className="text-sm font-bold text-[#9B8186] ml-2">Deadline (Optional)</label>
                      <input 
                        type="date"
                        className="w-full p-4 rounded-2xl bg-[#FAF0ED] border-2 border-transparent outline-none focus:border-[#EA9584] text-xl text-[#4F4B48]"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-5">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-[#9B8186] font-bold text-lg px-4">Cancel</button>
                  <button type="submit" disabled={isLoading} className="bg-[#EA9584] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#E88F7F] disabled:opacity-50 transition-colors">
                    {isLoading ? "Saving..." : "Create Now"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Leftbar