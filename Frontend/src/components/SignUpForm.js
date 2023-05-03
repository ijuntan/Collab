import React, { useState, useContext, useEffect, Fragment } from 'react'
import { MainContext } from '../MainContext';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import { Dialog, Transition } from '@headlessui/react'
import {MdVisibility as Eyes, MdVisibilityOff as NoEyes} from 'react-icons/md'


const SignUpForm = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {jwt, setJwt} = useContext(MainContext)
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
        alert(username)
        try {
            const user = {
                username,
                email,
                password
            }
            const response = await AuthService.signup(user)
            //alertToggleSuccess()
        }
        catch(error) {
            console.log('err: ', error.response.data.error)
            //alertToggleError(error.response.data.error)
        }
        
    }
    
    useEffect(() => {
        if(jwt || jwt !== '') {
            return history('/dash')
        }
    }, [jwt, history, setJwt])
  
    useEffect(() => {
        console.log(username)
    }, [username])

    return(
      <Transition show={props.showForm}>
        <Dialog class="fixed inset-0" onClose={props.closeModal}>
          <div class="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel class="
                flex flex-col 
                backdrop-blur-lg p-10 rounded-lg 
                border border-2 w-96
              "
              >
                <Dialog.Title
                  class="
                    text-6xl font-bebas text-center pb-10
                  "
                >
                  Sign Up
                </Dialog.Title>
  
                <div class="flex flex-col gap-10">
                  <div class="
                    relative m-y-8
                    w-full h-10 
                    border-b-2 border-black
                  ">
                    <input
                      required
                      type='text'
                      class="
                        bg-transparent border-none outline-none
                        w-full h-full
                        peer font-bold
                      "
                      name="username"
                      value={username || ""}
                      onChange = {e => handleChange(e)}
                    />
                    <label 
                      class="
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
                  
                  <div class="
                    relative m-y-8
                    w-full h-10 
                    border-b-2 border-black
                  ">
                    <input
                      required
                      type='text'
                      class="
                        bg-transparent border-none outline-none
                        w-full h-full
                        peer font-bold
                      "
                      name="email"
                      value={email || ""}
                      onChange = {e => handleChange(e)}
                    />
                    <label 
                      class="
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

                  <div class="
                    relative m-y-8
                    w-full h-10 
                    border-b-2 border-black
                  ">
                    <button class="
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
                      class="
                        bg-transparent border-none outline-none
                        w-full h-full
                        peer font-bold
                      "
                      name="password"
                      value={password}
                      onChange = {e => handleChange(e)}
                    />
                    <label 
                      class="
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
                    class="w-full bg-amber-700 rounded-md mt-10 mb-4 py-2 font-bold text-white"
                    onClick = {e => handleSubmit(e)}
                >
                  Sign up
                </button>
  
                <div class="flex gap-1">
                  Already have an account?
                  <button class="text-cream-300" onClick = {e => props.setShowLogin(true)}>
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