import React from 'react'
import { 
    MdAccountCircle as Account, 
    MdExpandMore as Down,
    MdSearch as Search
} from 'react-icons/md'

import { useNavigate } from 'react-router-dom'

const Header = ({
    searchContent,
    setSearchContent
}) => {

    const history = useNavigate()
    const goToSetting = () => {
        history('settings')
    }

    return (
        <header className="
            flex fixed
            z-50
            h-20 w-full 
            bg-amber-700 
            drop-shadow-2xl
        ">
            <div className="grow"/>
            <div className="flex grow-[2]">
                {/* Logo and Search Bar */}
                <div className="flex grow gap-4 justify-center items-center">
                    {/* Logo */}
                    <img
                        src="./images/collab.png"
                        className="h-10"
                    />

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            className="
                                bg-amber-800 
                                outline-none rounded-lg 
                                w-96 p-2 pr-10
                                text-white placeholder-amber-400
                                focus:border
                            "
                            value={searchContent}
                            placeholder="What are you interested in?"
                            onChange = {e => setSearchContent(e.target.value)}
                        />
                        {/* Search Logo */}
                        <div className="
                            absolute right-2 top-1/4
                            text-amber-400 text-xl
                        ">
                            <Search/>
                        </div>
                    </div>
                </div>

                {/* Other Menus */}
                <div className="flex grow gap-2 justify-center items-center">
                    {/* Posts */}
                    <button className="
                        flex items-center h-full
                        text-amber-400 px-2
                        hover:bg-amber-800/75
                    ">
                        Posts
                        <Down/>
                    </button>

                    {/* Projects */}
                    <button className="
                        flex items-center h-full
                        text-amber-400 px-4
                        hover:bg-amber-800/75
                    ">
                        Projects
                        <Down/>
                    </button>

                    {/* Account */}
                    <div className="flex justify-end">
                        <button onClick={goToSetting} className="text-5xl invert">
                            <Account/>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grow"/>
        </header>
    )
}

export default Header