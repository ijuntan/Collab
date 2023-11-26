import React, { useContext, useState } from 'react'
import AuthService from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../../services/MainContext'
import userService from '../../services/userService'
import { UserContext } from '../../services/authComponent'
import ProfilePic from '../../utils/ProfilePic'

const Settings = () => {
    const {setJwt} = useContext(MainContext)
    const { user, fetchUser } = useContext(UserContext);
    const [profilePic, setProfilePic] = useState(user?.profilePic)

    const history = useNavigate();

    const handleExit = () => {
        history(-1)
    }

    const logout = () => {
        AuthService.logout()
        setJwt('')
        return history('/')
    }

    const uploadPic = async(e) => {
        try {
            setProfilePic(URL.createObjectURL(e.target.files[0]))
            const file = e.target.files[0]

            const formData = new FormData();
            formData.append('image', file);

            await userService.uploadProfilePic(user._id, formData)
            fetchUser()
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="flex justify-center items-center w-full h-100">
            <div className="flex relative flex-col justify-center items-center rounded-lg p-4 bg-white drop-shadow-2xl mb-40">
                <button onClick={handleExit} className="absolute right-2 top-1 font-bold">
                    x
                </button>
                <div className='flex flex-col items-center'>
                    <ProfilePic width={40} height={40} src="self"/>

                    <div className="text-2xl font-bold mt-4">
                        {user.username}
                    </div>
                </div>
                
                <label className="w-full bg-amber-700 rounded-lg mt-4 py-2 px-10 text-white font-bold hover:bg-amber-800 text-center cursor-pointer" 
                    for="profile-upload"
                >
                    Set Profile Picture
                </label>
                <input type="file" id="profile-upload" 
                    className='hidden'
                    accept="image/png, image/jpeg"
                    onChange={uploadPic}
                />
                
                <button className="w-full bg-amber-700 rounded-lg mt-4 py-2 px-10 text-white font-bold hover:bg-amber-800"
                    onClick={() => history('/dash/post')}
                >
                    My Posts
                </button>

                <button className="w-full bg-amber-700 rounded-lg mt-4 py-2 px-10 text-white font-bold hover:bg-amber-800"
                    onClick={() => history('/dash/project')}
                >
                    My Projects
                </button>

                <button className="w-full bg-amber-700 rounded-lg mt-4 py-2 px-10 text-white font-bold hover:bg-amber-800">
                    Connect Social Link
                </button>
                <button onClick={logout} className="w-full bg-amber-700 rounded-lg mt-4 py-2 px-10 text-white font-bold hover:bg-amber-800">
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Settings