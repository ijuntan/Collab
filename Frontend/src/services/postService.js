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
    createPost(content) {
        return axios.post(`${API_URL}createpost`, content)
    }
}

export default PostService