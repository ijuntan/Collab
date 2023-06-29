import React, {useState} from 'react'
import AuthService from '../../services/authService'
import { useNavigate, useParams } from 'react-router-dom'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [errorMsg, setErrorMsg] = useState(false)

    const history = useNavigate()
    const match = useParams()

    const handleBack = () => {
        history('/')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password !== passwordConfirm) {
            return setErrorMsg(true)
        }
        try {
            await AuthService.resetpassword(match.resetToken, {password});
            handleBack();
        }
        catch(err){
            console.log('err: ', err.response.data.error)
            setErrorMsg(true);
        }
    }

    return (
            <div className="
                flex flex-col h-screen
            ">
                <header className="
                    h-20 bg-amber-700
                "/>
                <div className="
                    flex grow justify-center items-center
                ">
                    <div className="
                        flex flex-col relative gap-2 mb-20
                        border border-radius border-2 border-transparent
                        rounded-lg p-6 bg-amber-700
                    ">
                        <div className="
                            absolute right-2 top-1 flex justify-end
                        ">
                            <button onClick={handleBack} className="text-white font-bold hover:text-gray-200">
                                x
                            </button>
                        </div>
                        
                        {errorMsg &&
                            <div className="flex wrap w-80 mt-4 text-rose-950">
                                Password confirmation doesn't match with your new password.
                            </div>
                        }
                        

                        <div className="flex wrap w-80 mt-4 text-white">
                            Please enter your new password.
                        </div>

                        <div className="
                            relative mt-8 pl-2
                            w-full h-10 
                            border-2 border-black rounded
                            ">
                            <input
                                type='password' 
                                className="
                                bg-transparent border-none outline-none
                                w-full h-full
                                peer font-bold
                                placeholder:text-black
                                "
                                value={password || ""}
                                placeholder='Password'
                                required
                                onChange = {e => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="
                            relative mb-8 pl-2
                            w-full h-10 
                            border-2 border-black rounded
                            ">
                            <input
                                type='password' 
                                className="
                                bg-transparent border-none outline-none
                                w-full h-full
                                peer font-bold
                                placeholder:text-black
                                "
                                value={passwordConfirm || ""}
                                placeholder='Password Confirm'
                                required
                                onChange = {e => setPasswordConfirm(e.target.value)}
                            />
                        </div>

                        <button className="
                            bg-transparent rounded-lg p-4 font-bold border-white border text-white
                            hover:bg-white hover:text-amber-700
                        "
                        onClick={handleSubmit}
                        >
                            Reset Password
                        </button>
                    </div>  
                </div>
            </div>
    )
}

export default ResetPassword