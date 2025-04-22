import axios from "axios"
import Cookies from "js-cookie"


export const getRequest = (url) => {
    const apiUrl = import.meta.env.VITE_API_URL + url;
    const token = Cookies.get('auth')

    return axios.get(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}
export const postRequest = (url, body) => {
    const apiUrl = import.meta.env.VITE_API_URL + url;
    console.log(apiUrl)
    const token = Cookies.get('access_token')

    return axios.post(apiUrl, body, {
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
}
