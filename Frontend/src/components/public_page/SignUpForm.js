import React, { useState, useContext, useEffect, Fragment } from 'react'
import { MainContext } from '../../services/MainContext';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import { Dialog, Transition } from '@headlessui/react'
import {MdVisibility as Eyes, MdVisibilityOff as NoEyes} from 'react-icons/md'


const SignUpForm = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {jwt, setJwt} = useContext(MainContext)

    const [error, setError] = useState('')

    const history = useNavigate()
  
    const handleChange = (e) => {
      switch(e.target.name) {
          case 'username':
            setUsername(e.target.value)
            break;
          case 'email':
            setEmail(e.target.value)
            break;
          case 'password':
            setPassword(e.target.value)
            break;
          default:
            break;
      }
      
    }
  
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const user = {
              username,
              email,
              password
          }
          const success = await AuthService.signup(user)
          alert('Please check your email to verify your account')
          if(success) props.setShowLogin(true)
        }
        catch(error) {
          setError(error?.response?.data?.error)
        }
        
    }
    
    useEffect(() => {
        if(jwt || jwt !== '') {
            return history('/dash')
        }
    }, [jwt, history, setJwt])

    return(
      <Transition show={props.showForm}>
        <Dialog className="fixed inset-0" onClose={props.closeModal}>
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="
                flex flex-col 
                backdrop-blur-lg p-10 rounded-lg 
                border border-2 w-96
              "
              >
                <Dialog.Title
                  className="
                    text-6xl font-bebas text-center pb-10
                  "
                >
                  Sign Up
                </Dialog.Title>
  
                <div className="flex flex-col gap-10">
                  <div className="
                    relative m-y-8
                    w-full h-10 
                    border-b-2 border-black
                  ">
                    <input
                      required
                      type='text'
                      className="
                        bg-transparent border-none outline-none
                        w-full h-full
                        peer font-bold
                      "
                      name="username"
                      value={username || ""}
                      onChange = {e => handleChange(e)}
                    />
                    <label 
                      className="
                        absolute top-1/2 left-1 -translate-y-1/2
                        pointer-events-none
                        transition duration-500
                        peer-focus:-translate-y-8 peer-focus:text-sm
                        peer-valid:-translate-y-8 peer-valid:text-sm
                      "
                    >
                      Username
                    </label>
                  </div>
                  
                  <div className="
                    relative m-y-8
                    w-full h-10 
                    border-b-2 border-black
                  ">
                    <input
                      required
                      type='text'
                      className="
                        bg-transparent border-none outline-none
                        w-full h-full
                        peer font-bold
                      "
                      name="email"
                      value={email || ""}
                      onChange = {e => handleChange(e)}
                    />
                    <label 
                      className="
                        absolute top-1/2 left-1 -translate-y-1/2
                        pointer-events-none
                        transition duration-500
                        peer-focus:-translate-y-8 peer-focus:text-sm
                        peer-valid:-translate-y-8 peer-valid:text-sm
                      "
                    >
                      Email
                    </label>
                  </div>

                  <div className="
                    relative m-y-8
                    w-full h-10 
                    border-b-2 border-black
                  ">
                    <button className="
                      absolute top-1/2 right-1 -translate-y-1/2
                      transition duration-500
                    "
                      onClick={()=>setShowPassword(!showPassword)}
                    >
                      {
                        showPassword
                        ?
                        <Eyes/>
                        :
                        <NoEyes/>
                      }
                    </button>
                    <input
                      required
                      type={showPassword?'text':'password'}
                      className="
                        bg-transparent border-none outline-none
                        w-full h-full
                        peer font-bold
                      "
                      name="password"
                      value={password}
                      onChange = {e => handleChange(e)}
                    />
                    <label 
                      className="
                        absolute top-1/2 left-1 -translate-y-1/2
                        pointer-events-none
                        transition duration-500
                        peer-focus:-translate-y-8 peer-focus:text-sm
                        peer-valid:-translate-y-8 peer-valid:text-sm
                      "
                    >
                      Password
                    </label>
                  </div>
                </div>
                
                <button 
                    className="w-full bg-amber-700 rounded-md mt-8 mb-2 py-2 font-bold text-white"
                    onClick = {e => handleSubmit(e)}
                >
                  Sign up
                </button>

                {
                  error !== "" &&
                  <div className="text-red-700">
                    {error}
                  </div>
                }

                <div className="flex gap-1">
                  Already have an account?
                  <button className="text-cream-300" onClick = {e => props.setShowLogin(true)}>
                    Login
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    )
}

export default SignUpForm