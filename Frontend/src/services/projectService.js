import { axios } from './axiosUtils'

const API_URL = "project"

const ProjectService = {
    getProjects(id) {
        return axios.get(`${API_URL}/projects/${id}`)
    },
    getProject(id) {
        return axios.get(`${API_URL}/${id}`)
    },
    createProject(content) {
        return axios.post(`${API_URL}/`, content)
    },
    deleteProject(id) {
        return axios.delete(`${API_URL}/${id}`)
    },
    updateProject(id, content) {
        return axios.patch(`${API_URL}/${id}`, content)
    },

    addLinkToProject(id, content) {
        return axios.patch(`${API_URL}/addlink/${id}`, content)
    },
    deleteLinkFromProject(id, content) {
        return axios.patch(`${API_URL}/deletelink/${id}`, content)
    },

    createDocument(content) {
        return axios.post(`${API_URL}/document`, content)
    },
    deleteDocument(id) {
        return axios.delete(`${API_URL}/document/${id}`)
    },

    inviteMember(id, content) {
        return axios.patch(`${API_URL}/invite/${id}`, content)
    } 
}

export default ProjectService