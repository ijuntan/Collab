import React, {useState} from 'react'
import AuthService from '../services/authService'
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
            <div class="
                flex flex-col h-screen
            ">
                <header class="
                    h-20 bg-amber-700
                "/>
                <div class="
                    flex grow justify-center items-center
                ">
                    <div class="
                        flex flex-col relative gap-2 mb-20
                        border border-radius border-2 border-transparent
                        rounded-lg p-6 bg-amber-700
                    ">
                        <div class="
                            absolute right-2 top-1 flex justify-end
                        ">
                            <button onClick={handleBack} class="text-white font-bold hover:text-gray-200">
                                x
                            </button>
                        </div>
                        
                        {errorMsg &&
                            <div class="flex wrap w-80 mt-4 text-rose-950">
                                Password confirmation doesn't match with your new password.
                            </div>
                        }
                        

                        <div class="flex wrap w-80 mt-4 text-white">
                            Please enter your new password.
                        </div>

                        <div class="
                            relative mt-8 pl-2
                            w-full h-10 
                            border-2 border-black rounded
                            ">
                            <input
                                type='password' 
                                class="
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

                        <div class="
                            relative mb-8 pl-2
                            w-full h-10 
                            border-2 border-black rounded
                            ">
                            <input
                                type='password' 
                                class="
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

                        <button class="
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