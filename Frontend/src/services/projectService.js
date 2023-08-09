import axios from 'axios'

const API_URL = "http://localhost:8080/api/v1/project"

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
    }
}

export default ProjectService