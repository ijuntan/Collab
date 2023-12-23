import React, { useEffect, useState } from 'react'
import AuthService from '../../services/authService'
import { useNavigate, useParams } from 'react-router-dom'

const VerifyEmail = () => {
    const [loading, setLoading] = useState(true)
    const { emailToken } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await AuthService.verifyEmail(emailToken)
                if(res) {
                    setLoading(false)
                    alert('Your email has been verified')
                }
            } catch (error) {
                navigate('/error')
            }
        }

        verifyEmail()
    }, [])

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
                        {
                            loading ? (
                                <div className="
                                    flex flex-col gap-2
                                ">
                                    <p className="
                                        text-2xl text-center text-white
                                    ">
                                        Verifying...
                                    </p>
                                </div>
                            ) : (
                                <div className="
                                    flex flex-col gap-2
                                ">
                                    <p className="
                                        text-2xl text-center text-white
                                    ">
                                        Your email has been verified
                                    </p>
                                    <button className="
                                        bg-white text-black
                                        rounded-lg p-2
                                        hover:bg-black hover:text-white
                                    " onClick={() => navigate('/')}>
                                        Login
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
    )
}

export default VerifyEmail