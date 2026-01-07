import React from 'react'
import { NavLink } from 'react-router-dom'
import DevKU from "../Public/Logo/DEV-KU-Logo.svg"

const navbar = () => {
    const activeClass = "text-[#8E80A0] underline text-[24px]";
    const normalClass = "text-[#3E2C23] text-[24px] hover:text-[#8E80A0] hover:underline"

  return (
    <nav className=' flex justify-between items-center py-3 px-10'>
        {/* App name or Logo */}
        <div>
            <img src={DevKU} alt='DevKU Logo' className='h-20' />
        </div>
        {/* Menu */}
        {/* Dashboard */}
        <NavLink to="/" className={({ isActive })=>
            `pb-1 ${isActive ? activeClass : normalClass}`
        }>
            Dashboard
        </NavLink>

        {/* Task */}
        <NavLink to="/Task" className={({ isActive })=>
            `pb-1 ${isActive ? activeClass : normalClass}`
        }>
            Task
        </NavLink>

        {/* Teams */}
        <NavLink to="/Teams" className={({ isActive })=>
            `pb-1 ${isActive ? activeClass : normalClass}`
        }>
            Teams
        </NavLink>

        {/* Inventory */}
        <NavLink to="/Inventory" className={({ isActive })=>
            `pb-1 ${isActive ? activeClass : normalClass}`
        }>
            Inventory
        </NavLink>

        {/* Reports */}
        <NavLink to="/Reports" className={({ isActive })=>
            `pb-1 ${isActive ? activeClass : normalClass}`
        }>
            Reports
        </NavLink>
    </nav>
      
  )
}

export default navbar