import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createAnecdote = async (anecdote) => {
  const response = await axios.post(baseUrl, {
    content: anecdote,
    votes: 0,
  });
  return response.data;
};

const addVotes = async (anecdote) => {
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, {
    ...anecdote,
    votes: anecdote.votes + 1
  });
  // must not only post votes filed, otherwise other fileds will be deleted.
  return response.data;
};
export default { getAll, createAnecdote, addVotes };
