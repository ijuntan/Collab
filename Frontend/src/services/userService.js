import { axios } from './axiosUtils'
import authHeader from './authHeader'

const API_URL = "user"

const userService = {
    getUserDash() {
        return axios.get(API_URL + '/dash', { header: authHeader() })
    },
    getUserByName(name) {
        return axios.get(API_URL + `/name/${name}`)
    },
    followFriend(selfName, friendName) {
        return axios.patch(API_URL + `/follow`, {selfName: selfName, friendName: friendName})
    },
    unfollowFriend(selfName, friendName) {
        return axios.patch(API_URL + `/unfollow`, {selfName: selfName, friendName: friendName})
    },

    getNotifications(id) {
        return axios.get(API_URL + `/notifications/${id}`)
    },
    getNotification(id) {
        return axios.get(API_URL + `/notification/${id}`)
    },
    sendNotification(content) {
        return axios.post(API_URL + `/notification`, content)
    },
    deleteNotification(id) {
        return axios.delete(API_URL + `/notification/${id}`)
    },
    updateNotification(id, action) {
        return axios.patch(API_URL + `/notification/${id}`, action)
    },

    sendInvitation(content) {
        return axios.post(API_URL + `/invitation`, content)
    },
    updateInvitation(id, action) {
        return axios.patch(API_URL + `/invitation/${id}` , action)
    },

    uploadProfilePic(id, image) {
        return axios.post(API_URL + `/image/${id}`, image)
    }
}

export default userService