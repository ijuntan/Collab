import axios from 'axios'

const API_URL = "http://localhost:8080/api/v1/comment"

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
}

export default CommentService