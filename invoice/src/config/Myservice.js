import axios from 'axios'
import { MAIN_URL } from './Url';
export function adduser(data) {
    return axios.post(`${MAIN_URL}adduser`, data);
}
export function getuser(data) {
    return axios.post(`${MAIN_URL}getuser`, data);
}
export function addinvoice(data) {
    return axios.post(`${MAIN_URL}addinvoice`, data);

}
export function getrecords(id, token) {
    return axios.get(`${MAIN_URL}getinvoice/${id}`, {
        headers: { "authorization": `Bearer ${token}` }
    });

}
export function updaterecords(data) {
    return axios.put(`${MAIN_URL}updaterecords`, data);

}
export function dashdata(id, token) {
    return axios.get(`${MAIN_URL}getdash/${id}`, {
        headers: { "authorization": `Bearer ${token}` }
    });

}
// export function getmenu(token) {
//     return axios.get(`${MAIN_URL}getmenu`, {
//         headers: { "authorization": `Bearer ${token}` }
//     });
// }
