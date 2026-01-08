import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ArrowLeft, Clock, AlertCircle, Trash2, Calendar } from 'lucide-react'; 
import axios from 'axios';

const Task = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState({
    "TODO": { name: "To Do", items: [] },
    "IN_PROGRESS": { name: "In Progress", items: [] },
    "DONE": { name: "Done", items: [] }
  });

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/tasks/project/${projectId}`);
      const grouped = {
        "TODO": { name: "To Do", items: res.data.filter(t => t.status === 'TODO') },
        "IN_PROGRESS": { name: "In Progress", items: res.data.filter(t => t.status === 'IN_PROGRESS') },
        "DONE": { name: "Done", items: res.data.filter(t => t.status === 'DONE') }
      };
      setColumns(grouped);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ฟังก์ชันลบ Task ---
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/tasks/${taskId}`);
      
      // อัปเดต State ในหน้าจอทันทีโดยไม่ต้อง Refresh ทั้งหน้า
      const newColumns = { ...columns };
      Object.keys(newColumns).forEach(colId => {
        newColumns[colId].items = newColumns[colId].items.filter(item => item.id !== taskId);
      });
      setColumns(newColumns);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("ลบงานไม่สำเร็จ");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceCol = columns[source.droppableId];
      const destCol = columns[destination.droppableId];
      const sourceItems = [...sourceCol.items];
      const destItems = [...destCol.items];
      
      const [removed] = sourceItems.splice(source.index, 1);
      const updatedItem = { ...removed, status: destination.droppableId };
      destItems.splice(destination.index, 0, updatedItem);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems }
      });

      try {
        await axios.patch(`http://127.0.0.1:8000/tasks/${draggableId}`, { 
          status: destination.droppableId 
        });
      } catch (error) {
        console.error("Update failed:", error);
        fetchTasks(); 
      }
    }
  };

  return (
    <div className="p-2 h-screen flex flex-col bg-[#F9EBE7] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/project')}
            className="p-3 bg-white rounded-full shadow-sm hover:bg-[#EA9584] hover:text-white transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-[#4F4B48]">Project Board</h1>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-[#EA9584] font-bold text-xl italic">
          Loading Tasks...
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-2 h-7/8 overflow-x-auto pb-4 custom-scrollbar w-full">
            {Object.entries(columns).map(([colId, col]) => (
              <div key={colId} className=" w-1/3 flex flex-col bg-[#FDF1EE] rounded-[40px] p-6 shadow-inner border border-white/50">
                <div className="flex items-center justify-between mb-6 px-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colId === 'DONE' ? 'bg-green-400' : colId === 'IN_PROGRESS' ? 'bg-yellow-400' : 'bg-[#EA9584]'}`} />
                    <h2 className="text-xl font-bold text-[#4F4B48]">{col.name}</h2>
                  </div>
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-[#8B7E7B] font-bold shadow-sm">
                    {col.items.length}
                  </span>
                </div>
                
                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef} 
                      className={`flex-1 overflow-y-auto space-y-4 px-1 custom-scrollbar transition-colors rounded-2xl ${snapshot.isDraggingOver ? 'bg-white/30' : ''}`}
                    >
                      {col.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-5 rounded-[25px] shadow-sm border border-[#F9E6E2] group relative hover:border-[#EA9584] transition-all ${snapshot.isDragging ? 'shadow-2xl rotate-2' : ''}`}
                            >
                              {/* ปุ่มลบ Task */}
                              <button 
                                onClick={() => handleDeleteTask(item.id)}
                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete task"
                              >
                                <Trash2 size={18} />
                              </button>

                              <h3 className="text-lg font-bold text-[#4F4B48] mb-2 pr-6 leading-tight">
                                {item.task_title}
                              </h3>
                              
                              {item.description && (
                                <p className="text-[#8B7E7B] text-xs mb-4 line-clamp-2 italic">{item.description}</p>
                              )}

                              <div className="space-y-2 border-t border-gray-50 pt-3">
                                {/* วันที่สร้าง */}
                                <div className="flex items-center gap-2 text-gray-400">
                                  <Calendar size={12} />
                                  <span className="text-[10px]">
                                    Created: {item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH') : '-'}
                                  </span>
                                </div>

                                {/* Deadline */}
                                <div className="flex items-center justify-between">
                                  <div className={`flex items-center gap-2 ${item.deadline ? 'text-[#EA9584]' : 'text-gray-300'}`}>
                                    <Clock size={12} />
                                    <span className="text-[10px] font-bold">
                                      {item.deadline ? `Due: ${new Date(item.deadline).toLocaleDateString('th-TH')}` : 'No deadline'}
                                    </span>
                                  </div>

                                  {item.assigned_to && (
                                    <div className="w-6 h-6 bg-[#FBCDCB] rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                                      ID
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default Task;