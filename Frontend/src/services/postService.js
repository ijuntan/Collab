import axios from 'axios'

const API_URL = "http://localhost:8080/api/v1/post/"

const PostService = {
    getPost() {
        return axios.get(`${API_URL}getpost`)
    },
    getPostByCategory(filter) {
        return axios.get(`${API_URL}getpostbycategory/${filter}`)
    },
    getPostBySearch(search) {
        return axios.get(`${API_URL}getpostbysearch/${search}`)
    },
    getPostById(id) {
        return axios.get(`${API_URL}getpostbyid/${id}`)
    },
    createPost(content) {
        return axios.post(`${API_URL}createpost`, content)
    },
    createComment(content) {
        return axios.post(`${API_URL}createcomment`, content)
    },
    actionToPost(action) {
        return axios.post(`${API_URL}actiontopost`, action)
    },
    getActionByUser(id) {
        return axios.get(`${API_URL}getactionbyuser/${id}`)
    },
    updateActionPost(act) {
        return axios.put(`${API_URL}updateactionpost`, act)
    }

}

export default PostService