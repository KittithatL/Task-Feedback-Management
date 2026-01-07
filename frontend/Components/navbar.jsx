import React from 'react'
import { NavLink } from 'react-router-dom'
import Bell from '../Public/Logo/Bell.svg'
import account from '../Public/Logo/account_circle.png'
import { useState } from 'react'

const navbar = () => {
    const mockUser = {
        id:"12345678",
        name:"นายสมชาย สายปั่น",
        email:"somchai@taskco.com",
        role:"Admin",
        profile_img:"https://cdn.discordapp.com/attachments/1349015589854773249/1458460161545867264/612496708_1177626007772966_646329492784512138_n_.jpg?ex=695fb85f&is=695e66df&hm=8dac70ee48481a0c18baa485438cf7bf430233a66a73a71d7acfd69cd468f3fa&"
    };

    const [user] = useState(mockUser);

    return(
    <div className=' h-full text-2xl flex items-center justify-between px-20'>
        <div className=' text-[38px] font-bold'>
            <NavLink to="/">
                Taskaco
            </NavLink>
        </div>
        <div className=' text-[28px] flex gap-5 items-center text-[#9B8186]'>
            <div>
                <img src={Bell} alt="Notification" className='w-10 h-10'/>
            </div>
            <p>{user.name}</p>
            <div className=' w-14 h-14 rounded-full overflow-hidden flex items-center justify-center'>
                <img src={user.profile_img || account} alt="account picture" className={user.profile_img ? 'w-full h-full object-cover' : 'w-16 h-16'} onError={(e)=>{
                    e.target.src = account;
                    e.target.className = 'w-14 h-14'
                }}/>
            </div>
        </div>
    </div>
    )
}

export default navbar