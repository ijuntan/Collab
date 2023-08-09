import React, { useContext, useState } from 'react'
import { UserContext } from '../../services/authComponent'
import { Outlet} from 'react-router-dom'
import Header from "./Header"

const filterCategory = [
    "None",
    "Website",
    "AI",
    "Electronics",
    "Science",
    "Business"
]

const PrivateScreen = () => {
    const {user} = useContext(UserContext);
    const [searchContent, setSearchContent] = useState("")

    return (
        <div className="flex flex-col min-h-screen">
            <Header searchContent={searchContent} setSearchContent={setSearchContent}/> 
            
            <div className="flex grow bg-cream-200 pt-20">
                <Outlet context={{user, searchContent}}/>
            </div>
        </div>
    )
}

export default PrivateScreen

