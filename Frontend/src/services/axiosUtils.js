import axios from 'axios'

const service = axios.create({
    baseURL: process.env.REACT_APP_END_URL + "/api/v1/",
})

//service.defaults.withCredentials = true

service.interceptors.request.use(
    config => {
        config.baseURL = process.env.REACT_APP_END_URL + "/api/v1/"
        return config
    }
);

// service.interceptors.response.use(
//     response => {
//       // Modify response data here if needed
//       return response;
//     },
//     error => {
//       if (error.response && error.response.status === 402) {
//         localStorage.clear()
//         window.location.reload()
//       }
//       return Promise.reject(error);
//     }
//   );


export { service as axios };