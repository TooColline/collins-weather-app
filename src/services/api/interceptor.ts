import axios from 'axios'

axios.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_API_KEY
    if (apiKey) {
      config.params = {
        ...config.params,
        appid: apiKey,
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axios
