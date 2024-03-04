import axios from "axios";
/*
  use relative path, because the backend code and
  frontend code in the same root directory.

  but if we run in development, it will be wrong.
*/
const baseUrl = "/api/persons";
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
