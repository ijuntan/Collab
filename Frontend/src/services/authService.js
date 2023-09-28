import { axios } from './axiosUtils'

const API_URL = "user"

const AuthService = {
    signup(cred) {
        return axios.post(`${API_URL}/signup`, cred)
    },
    login(cred){
        return axios.post(`${API_URL}/login`, cred)
    },
    logout(){
        return localStorage.removeItem('token')
    },
    forgotpassword(cred){
        return axios.post(`${API_URL}/forgotpassword`, cred)
    },
    resetpassword(resetToken, cred){
        return axios.put(`${API_URL}/resetpassword/${resetToken}`, cred)
    }
}

export default AuthService