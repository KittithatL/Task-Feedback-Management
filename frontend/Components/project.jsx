import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RotateCcw, ChevronRight, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import axios from 'axios';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate(); // 2. ประกาศ navigate

  useEffect(() => {
    fetchProjects();
  }, [activeTab]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const isTrash = activeTab === 'trash';
      const response = await axios.get(`http://127.0.0.1:8000/projects/?show_trash=${isTrash}`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id, e, type) => {
    e.stopPropagation(); // สำคัญ: ป้องกันไม่ให้การคลิกปุ่มลบไปทับกับการเปิดหน้า Task

    if (type === 'permanent_delete') {
      if (!window.confirm("คำเตือน: การลบถาวรจะไม่สามารถกู้คืนข้อมูลได้อีก คุณแน่ใจหรือไม่?")) return;
    }

    try {
      if (type === 'delete') {
        await axios.delete(`http://127.0.0.1:8000/projects/${id}`);
      } else if (type === 'restore') {
        await axios.patch(`http://127.0.0.1:8000/projects/${id}/restore`);
      } else if (type === 'permanent_delete') {
        await axios.delete(`http://127.0.0.1:8000/projects/${id}/permanent`);
      }
      setProjects(prev => prev.filter(p => (p._id || p.id) !== id)); // รองรับทั้ง id และ _id
    } catch (error) {
      console.error("Action failed:", error);
      alert("การทำงานล้มเหลว");
    }
  };

  return (
    <div className="p-5 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h1 className="text-[40px] font-bold text-[#4F4B48]">
          {activeTab === 'all' ? 'Projects' : 'Trash'}
        </h1>
        <div className="flex bg-[#F7E1DE] rounded-full p-1 shadow-inner">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-6 py-1 rounded-full font-medium transition-all ${activeTab === 'all' ? 'bg-[#EA9584] text-white shadow-sm' : 'text-[#4F4B48] hover:text-[#EA9584]'}`}
          >
            All project
          </button>
          <button 
            onClick={() => setActiveTab('trash')}
            className={`px-6 py-1 rounded-full font-medium transition-all ${activeTab === 'trash' ? 'bg-[#EA9584] text-white shadow-sm' : 'text-[#4F4B48] hover:text-[#EA9584]'}`}
          >
            Trash
          </button>
        </div>
      </div>

      <div className="custom-scrollbar bg-[#FAF0ED] rounded-[50px] p-10 flex-1 overflow-y-auto shadow-inner border border-[#F9E6E2]">
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="text-center text-gray-400 py-20">Loading...</div>
            ) : projects.length > 0 ? (
              projects.map((item, index) => {
                const projectId = item._id || item.id; // 3. รองรับ ID จาก MongoDB
                return (
                  <ProjectCard 
                    key={projectId} 
                    data={item} 
                    index={index} 
                    mode={activeTab} 
                    onAction={(e, type) => handleAction(projectId, e, type)}
                    onNavigate={() => activeTab === 'all' && navigate(`/project/${projectId}/tasks`)} // 4. ส่ง function นำทาง
                  />
                )
              })
            ) : (
              <div className="text-center py-20 text-gray-400 italic">
                {activeTab === 'all' ? 'No projects found.' : 'Trash is empty.'}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ data, index, mode, onAction, onNavigate }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      onClick={onNavigate} // 5. คลิกที่การ์ดเพื่อไปหน้า Task
      className={`h-32 shrink-0 rounded-[35px] shadow-sm flex items-center px-10 justify-between cursor-pointer group transition-all border border-transparent hover:border-white/30 ${
        mode === 'all' ? 'bg-[#FBCDCB] hover:bg-[#F9BCB9]' : 'bg-gray-200'
      }`}
    >
      <div>
        <h3 className="text-2xl font-bold text-[#4F4B48] group-hover:text-white transition-colors truncate max-w-100">
          {data.project_title}
        </h3>
        <p className="text-[#8B7E7B] group-hover:text-white/80 font-medium">
          {data.created_at ? new Date(data.created_at).toLocaleDateString('th-TH', { dateStyle: 'medium' }) : 'No Date'}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {mode === 'all' ? (
          <button 
            onClick={(e) => onAction(e, 'delete')}
            className="p-3 bg-white/40 hover:bg-[#EA9584] hover:text-white rounded-full text-[#EA9584] transition-all opacity-0 group-hover:opacity-100 shadow-sm backdrop-blur-sm"
          >
            <Trash2 size={22} />
          </button>
        ) : (
          <button 
            onClick={(e) => onAction(e, 'restore')}
            className="p-3 bg-white/40 hover:bg-green-500 hover:text-white rounded-full text-green-600 transition-all opacity-0 group-hover:opacity-100 shadow-sm backdrop-blur-sm"
          >
            <RotateCcw size={22} />
          </button>
        )}

        {mode === 'all' ? (
          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-white group-hover:bg-[#EA9584] transition-all shadow-sm">
            <ChevronRight size={28} />
          </div>
        ) : (
          <button
            onClick={(e) => onAction(e, 'permanent_delete')}
            className="w-12 h-12 bg-red-500/20 hover:bg-red-600 text-red-600 hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100"
          >
            <XCircle size={28} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Project;