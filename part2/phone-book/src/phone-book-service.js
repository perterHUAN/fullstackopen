import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";
function getAll() {
  return axios.get(baseUrl).then((response) => response.data);
}

function postNewEntry(data) {
  return axios.post(baseUrl, data).then((response) => {
    console.log(response);
    return response.data;
  });
}
function deletEntry(id) {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
}
function updateEntry(id, data) {
  return axios.put(`${baseUrl}/${id}`, data).then((response) => {
    console.log(response.data);
    return response.data;
  });
}
export { getAll, postNewEntry, deletEntry, updateEntry };
