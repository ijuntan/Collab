import { axios } from './axiosUtils'

const API_URL = "post"

const PostService = {
    getPost(skip) {
        return axios.get(`${API_URL}/posts`,{
            params: {
                skip:skip
            }
        })
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
    getPostByUser(id) {
        return axios.get(`${API_URL}/user_posts/${id}`)
    },
    getPostById(id) {
        return axios.get(`${API_URL}/${id}`)
    },
    createPost(content) {
        return axios.post(`${API_URL}/`, content)
    },
    uploadPost(content, id) {
        return axios.post(`${API_URL}/${id}`, content)
    },
    deletePost(id) {
        return axios.delete(`${API_URL}/${id}`)
    },
    updatePost(id, content) {
        return axios.patch(`${API_URL}/${id}`, content)
    },

    uploadImage(content, id) {
        return axios.post(`${API_URL}/image/${id}`, content)
    },

    actionToPost(action) {
        return axios.post(`${API_URL}/action`, action)
    },
    getActionByUser(id) {
        return axios.get(`${API_URL}/action/${id}`)
    },
    updateActionPost(act) {
        return axios.patch(`${API_URL}/action`, act)
    },
}

export default PostService