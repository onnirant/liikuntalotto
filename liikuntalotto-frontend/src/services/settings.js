/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
const baseUrl = '/api/settings'

const get = () => {
  const request = axios.get(`${baseUrl}/0`)
  return request.then(response => response.data)
}

const update = (newObject) => {
  const request = axios.put(`${baseUrl}/0`, newObject)
  return request.then(response => response.data)
}

export default { get, update }