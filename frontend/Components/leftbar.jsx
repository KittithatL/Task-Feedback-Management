import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Plus from "../Public/Logo/plus.svg"
import axios from 'axios'

const Leftbar = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ยิง Backend(Fake user)
  const mockUser = {
    id: "659b8c1234567890abcdef12",
    name: "นายสมชาย สายปั่น",
    email: "somchai@taskco.com",
    role: "Admin",
    profile_img: "https://cdn.discordapp.com/attachments/1349015589854773249/1458460161545867264/612496708_1177626007772966_646329492784512138_n_.jpg?ex=695fb85f&is=695e66df&hm=8dac70ee48481a0c18baa485438cf7bf430233a66a73a71d7acfd69cd468f3fa&"
  };
  
  const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!projectTitle.trim()) return alert("กรุณาใส่ชื่อโปรเจกต์");

        setIsLoading(true);
        try {
            const payload = {
                title: projectTitle,
                created_by: mockUser.id
            };
            
            const response = await axios.post('http://127.0.0.1:8000/projects/', payload);

            if (response.status === 200 || response.status === 201) {
                alert(`โปรเจกต์ "${projectTitle}" ถูกสร้างโดยคุณ ${mockUser.name} เรียบร้อยแล้ว!`);
                setProjectTitle(""); 
                setIsModalOpen(false);
                window.location.reload(); 
            }
        } catch (error) {
            console.error("Create Project Error:", error);
            alert("ไม่สามารถสร้างโปรเจกต์ได้ กรุณาเช็คการเชื่อมต่อ Backend");
        } finally {
            setIsLoading(false);
        }
    };

  const linkStyle = "flex items-center justify-center w-full hover:text-white hover:bg-[#E88F7F] text-[#4F4B48] transition-all duration-200";
  const activeClass = ({ isActive }) => isActive ? `${linkStyle} bg-[#E88F7F] text-white` : linkStyle;
  

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };



  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className='flex-col flex h-full place-items-center pt-10 gap-7'
    >
        {/* 1. ปุ่ม Create Project พร้อม Animation */}
        <div className="h-16"> {/* ล็อกความสูงไว้ไม่ให้เมนูเด้งไปมา */}
          <AnimatePresence>
            {location.pathname === '/project' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className='bg-[#EA9584] shadow-md w-72 h-14 text-[20px] font-bold rounded-full text-white flex items-center justify-center gap-2'
              >
                Create new project 
                <img src={Plus} alt="Plus" className='w-5 h-5' />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
            
        {/* 2. Menu Block 1 */}
        <motion.div variants={itemVariants} className='bg-[#FDF1EE] w-80 h-80 rounded-[40px] shadow-md flex-col flex overflow-hidden'>
          <NavLink to="/" className={activeClass} style={{height: '20%'}}>Dashboard</NavLink>
          <NavLink to="/personnel" className={activeClass} style={{height: '20%'}}>Personnel</NavLink>
          <NavLink to="/inventory" className={activeClass} style={{height: '20%'}}>Inventory</NavLink>
          <NavLink to="/feedback" className={activeClass} style={{height: '20%'}}>Feedback</NavLink>
          <NavLink to="/project" className={activeClass} style={{height: '20%'}}>Projects</NavLink>
        </motion.div>

        {/* 3. Menu Block 2 */}
        <motion.div variants={itemVariants} className='bg-[#FDF1EE] w-80 h-52 rounded-[40px] shadow-md flex-col flex overflow-hidden'>
          <NavLink to="/inbox" className={activeClass} style={{height: '33.33%'}}>Inbox</NavLink>
          <NavLink to="/note" className={activeClass} style={{height: '33.33%'}}>Note</NavLink>
          <NavLink to="/list" className={activeClass} style={{height: '33.33%'}}>List</NavLink>
        </motion.div>

        {/* 4. Pop-up Modal (Create Project) */}
        <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => !isLoading && setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.7, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.7, opacity: 0, y: 100 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="bg-white p-10 rounded-[40px] shadow-2xl z-10 w-125"
                        >
                            <h2 className="text-3xl font-bold text-[#4F4B48] mb-6">New Project</h2>
                            <form onSubmit={handleCreateProject}>
                                <input 
                                    autoFocus
                                    type="text"
                                    placeholder="Enter project title..."
                                    className="w-full p-4 rounded-2xl border-2 border-[#FDF1EE] outline-none focus:border-[#EA9584] mb-8 text-xl"
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                    disabled={isLoading}
                                />
                                <div className="flex justify-end gap-5">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-[#9B8186] font-bold text-lg">Cancel</button>
                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-[#EA9584] text-white px-10 py-3 rounded-2xl font-bold hover:bg-[#E88F7F] transition-all text-lg shadow-lg"
                                    >
                                        {isLoading ? "Saving..." : "Create"}
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