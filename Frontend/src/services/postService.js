import axios from 'axios'

const API_URL = "http://localhost:8080/api/v1/post"

const PostService = {
    getPost() {
        return axios.get(`${API_URL}/posts`)
    },
    getPostByCategory(filter) {
        return axios.get(`${API_URL}/posts/${filter}`)
    },
    getPostBySearch(search) {
        return axios.get(`${API_URL}/search`, {
            params: {
                s: search
            }
        })
    },
    getPostById(id) {
        return axios.get(`${API_URL}/${id}`)
    },
    createPost(content) {
        return axios.post(`${API_URL}/`, content)
    },
    deletePost(id) {
        return axios.delete(`${API_URL}/${id}`)
    },
    updatePost(id, content) {
        return axios.patch(`${API_URL}/${id}`, content)
    },

    actionToPost(action) {
        return axios.post(`${API_URL}/action`, action)
    },
    getActionByUser(id) {
        return axios.get(`${API_URL}/action/${id}`)
    },
    updateActionPost(act) {
        return axios.put(`${API_URL}/action`, act)
    }
}

export default PostService