import React, { useContext, useState } from 'react'
import { UserContext } from '../../services/authComponent'
import { Outlet} from 'react-router-dom'
import Header from "./Header"

const PrivateScreen = () => {
    const {user} = useContext(UserContext);
    const [searchContent, setSearchContent] = useState("")

    return (
        <div className="flex flex-col min-h-screen bg-cream-200">
            <Header searchContent={searchContent} setSearchContent={setSearchContent}/> 
            
            <div className="flex grow pt-20">
                <Outlet context={{user, searchContent}}/>
            </div>
        </div>
    )
}

export default PrivateScreen

