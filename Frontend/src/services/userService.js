import axios from 'axios'
import authHeader from './authHeader'

const API_URL = "http://localhost:8080/api/v1/user/"

const userService = {
    getUserDash() {
        return axios.get(API_URL + 'dash', { header: authHeader() })
    },
    getUserByName(name) {
        return axios.get(API_URL + `${name}`)
    },
    getUsersByName(name) {
        return axios.get(API_URL + `all/${name}`)
    },
    followFriend(selfName, friendName) {
        return axios.patch(API_URL + `follow`, {selfName: selfName, friendName: friendName})
    },
    unfollowFriend(selfName, friendName) {
        return axios.patch(API_URL + `unfollow`, {selfName: selfName, friendName: friendName})
    },
}

export default userService