import axios from "axios";
const baseUrl = "http://localhost:3001/persons";
function getAll() {
  return axios.get(baseUrl).then((response) => response.data);
}

function postNewEntry(data) {
  return axios.post(baseUrl, data).then((response) => response.data);
}
function deletEntry(id) {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
}
export { getAll, postNewEntry, deletEntry };
