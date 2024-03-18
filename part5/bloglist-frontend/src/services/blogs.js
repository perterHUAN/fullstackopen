import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const login = async (credentials) => {
  const response = await axios.post("/api/login", credentials);
  return response.data;
};

const update = async (id, newBlog) => {
  const response = await axios.put(`/api/blogs/${id}`, newBlog)
  return response.data;
}
const create = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post("/api/blogs", blog, config);
  return response.data;
};
export default { getAll, login, setToken, create, update };
