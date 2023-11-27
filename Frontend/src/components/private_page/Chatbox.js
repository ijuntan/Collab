import React, { Fragment, useContext, useEffect, useState, useRef } from 'react'
import { Dialog, Transition} from '@headlessui/react'
import { 
    MdAccountCircle as Account,
    MdCancel as Cancel,
    MdSend,
} from 'react-icons/md'

import ChatService from '../../services/chatService'
import { UserContext } from '../../services/authComponent'
import {io} from "socket.io-client"

const Chatbox = ({
    account,
    user,
    setChatTo,
}) => {
    const socket = useRef()
    const [conversation, setConversation] = useState(null)
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [text, setText] = useState("") 

    const postMsg = async() => {
        try {
            const msg = {
                receiver: user._id,
                sender: account._id,
                message: text,
            }

            socket.current.emit("sendMessage", msg)
            const promise = await ChatService.postMessage(msg)
            if(promise) {
                setConversation(prev => [...prev, {
                sender: msg.sender,
                message: msg.message,
                time: Date.now()
            }])
                setText("")
            }
        }
        catch(err) {
            console.log(err.response.data.error)
        }
    }

    useEffect(()=>{
        socket.current = io(process.env.REACT_APP_SOCKET_URL, {transports: ['websocket']})
        socket.current.emit("addUser", account._id)
        socket.current.on("getMessage", data=> {
            setArrivalMessage({
                message: data.message,
                sender: data.sender,
                time: new Date()
            })
        })

        return () => {
            socket.current.disconnect()  
        }

    },[])

    useEffect(()=>{
        arrivalMessage && setConversation(prev => [...prev, arrivalMessage])
    },[arrivalMessage])

    useEffect(() => {
        const fetchMsg = async() => {
            try {
                const conv = await ChatService.getConversation(account._id, user._id)
                if(conv.data) {
                    const msgs = conv.data.messages.sort((a,b) => new Date(b.date) - new Date(a.date))
                    setConversation(msgs)
                }
                else setConversation([])
            } catch(err) {
                console.log(err)
            }
        }
        fetchMsg()
    }, [ , user, setConversation])

    const DateDiff = ({time}) => {
        const now = new Date()
        const then = new Date(time)
        const diff = Math.floor((now - then)/ (1000 * 3600 * 24))
        let text = ""

        if(diff < 1) text=`${then.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
        else if(diff > 30) text= Math.floor(diff/30) + " Months Ago"
        else text= diff + " Days Ago"

        return(
            <div className='text-slate-500 text-xs mt-1'>
                {text}
            </div>
        )
    }

    return (
        <div className="fixed flex flex-col bottom-0 right-10 h-1/2 w-2/6 rounded-t-lg bg-white">
            {/* Header */}
            <div className="flex bg-amber-800 p-2 items-center rounded-t-lg">
                <div className="flex items-center gap-2">
                    <img className='rounded-full w-10 h-10 bg-gray-200 object-cover' src={user.profilePic || "/images/profile.svg"}/>
                    {user.username}
                </div>

                <div className='flex justify-end grow'>
                    <button onClick={()=> {
                        setChatTo(null) 
                    }}>
                        <Cancel/>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className='flex-col gap-2 grow overflow-auto p-4'>
                {   conversation ?
                    conversation.map(item => (
                        <div className={`flex text-black p-2
                            ${item.sender === account._id 
                                ? "justify-end"
                                : ""
                            }
                        `}>
                            <div className={`p-3 rounded-lg
                                ${item.sender === account._id 
                                    ? "bg-cream-300"
                                    : "bg-slate-200"
                                }
                            `}>
                                {item.message}
                                <DateDiff time={item.time}/>
                            </div>
                        </div>
                    ))
                    :
                    <div className='flex text-black'></div>
                }
            </div>
                         
            {/* Footer */}
            <div className="flex gap-2 border-t-1 py-2 px-4">
                <textarea
                    className="
                        outline-none rounded-lg 
                        p-2 pr-10 w-full border
                        text-black
                    "
                    value={text}
                    placeholder="Enter text..."
                    onChange = {e => setText(e.target.value)}
                    //onKeyDown= {e => e.key==="Enter" && findFriend(friendFound)}
                />
                <button className='flex items-center justify-center text-black rounded-xl w-10 hover:bg-slate-200'
                    onClick={postMsg}
                >
                    <MdSend/>
                </button>
            </div>
        </div>
    )
}

export default Chatbox