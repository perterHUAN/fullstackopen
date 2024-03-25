import anecdoteService from "../services/anecdotes";
import { createSlice } from "@reduxjs/toolkit";
const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
  name: "anecdote",
  initialState: [],
  reducers: {
    _createAnecdote(state, action) {
      console.log("createAnecdote: ", action);
      state.push(action.payload);
    },
    _vote(state, action) {
      console.log("vote: ", action);
      console.log(action);
      const anecdote = state.find((e) => e.id === action.payload);
      anecdote.votes++;
    },
    _setAnecdotes(state, action) {
      console.log("setAnecdotes: ", action);
      return action.payload;
    },
  },
});

const { _createAnecdote, _vote, _setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;

export const initialAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(_setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.post(content);
    dispatch(_createAnecdote(anecdote));
  };
};

export const vote = (anecdote) => {
  return async (dispatch) => {
    // update
    await anecdoteService.addVotes(anecdote);
    // only return {id, votes}
    // console.log("put response data: ", data);
    dispatch(_vote(anecdote.id));
  };
};
