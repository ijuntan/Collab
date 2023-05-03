import React, {useState} from 'react'
import AuthService from '../services/authService'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [successMsg, setSuccessMsg] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)
    const history = useNavigate()

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleBack = () => {
        history(-1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await AuthService.forgotpassword({email})
            setSuccessMsg(true)
            setErrorMsg(false)
        }
        catch(err) {
            console.log('err: ', err.response.data.error)
            setSuccessMsg(false)
            setErrorMsg(true)
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
                        
                        {
                            successMsg &&
                            <div class="flex wrap w-80 mt-4 text-green-400">
                                Reset link sent to your email successfully!
                            </div>
                        }
                        
                        {
                            errorMsg &&
                            <div class="flex wrap w-80 mt-4 text-rose-950">
                                Something has gone wrong, try again!
                            </div>
                        }
                        <div class="flex wrap w-80 mt-4 text-white">
                            Enter the email associated with your account and we'll send you a link to reset your password.
                        </div>

                        <div class="
                            relative my-8 pl-2
                            w-full h-10 
                            border-2 border-black rounded
                            ">
                            <input 
                                class="
                                bg-transparent border-none outline-none
                                w-full h-full
                                peer font-bold
                                placeholder:text-black
                                "
                                value={email || ""}
                                placeholder='Email'
                                required
                                onChange = {e => handleEmail(e)}
                            />
                        </div>

                        <button class="
                            bg-transparent rounded-lg p-4 font-bold border-white border text-white
                            hover:bg-white hover:text-amber-700
                        "
                        onClick={handleSubmit}
                        >
                            Submit
                        </button>

                        <button class="
                            bg-cream-200 rounded-lg p-4 font-bold text-amber-700
                            hover:contrast-125
                        "
                        onClick={handleBack}
                        >
                            Back
                        </button>
                    </div>  
                </div>
            </div>
    )
}

export default ForgotPassword