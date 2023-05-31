import React, { useState } from 'react'
import { MdOutlineKeyboardControlKey as Up, MdExpandMore as Down } from 'react-icons/md'
const temp = [
    "User One","User Two","User Three","User Four"
]

const Sidebar = () => {
    const [closeChat, setCloseChat] = useState(false)

    return (
        <div class={`flex flex-col gap-4 fixed p-6 bg-amber-200 ${closeChat? 'h-20':'h-screen'} duration-200 drop-shadow-2xl left-4 top-4 rounded-lg`}>
            <div class="flex text-gray-700 font-bold w-60 text-xl">
                <div class="flex justify-center ml-4 grow">
                    CHATBOX
                </div>
                <button onClick={() => setCloseChat(prev => !prev)} class="">
                    {
                        closeChat
                        ?
                            <Up/>
                        :
                            <Down/>
                    }
                </button>
            </div>
            
            <div class={` ${closeChat && 'invisible'} flex flex-col gap-2`}>
            {
                temp.map((item,index) => (
                    <div class="bg-white border border-2 rounded-xl border-gray-600 p-4" key={index}>
                        {item}
                    </div>
                ))
            }
            
            </div>
        </div>
    )
}

export default Sidebar