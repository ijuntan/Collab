import { axios } from './axiosUtils'

const API_URL = "comment"

const CommentService = {
    getComment(id) {
        return axios.get(`${API_URL}/${id}`)
    },
    createComment(content) {
        return axios.post(`${API_URL}/`, content)
    },
    deleteComment(id) {
        return axios.delete(`${API_URL}/${id}`)
    },
    updateComment(id, content) {
        return axios.patch(`${API_URL}/${id}`, content)
    },

    actionToComment(action) {
        return axios.post(`${API_URL}/action`, action)
    },
    updateActionComment(act) {
        return axios.patch(`${API_URL}/action`, act)
    }
}

export default CommentService