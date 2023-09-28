import { axios } from './axiosUtils'

const API_URL = "chat/"

const userService = {
    getConversation(id1, id2) {
        return axios.get(API_URL + `${id1}/${id2}`)
    },
    postMessage(msg) {
        return axios.post(API_URL + `msg`, msg)
    },
}

export default userService