import axios from 'axios'
import authHeader from './authHeader'

const API_URL = "http://localhost:8080/api/v1/"

const userService = {
    getUserDash() {
        return axios.get(API_URL + 'user/dash', { header: authHeader() })
    },
    getUserByName(name) {
        return axios.get(API_URL + `user/${name}`)
    }
}

export default userService