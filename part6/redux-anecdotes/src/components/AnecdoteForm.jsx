import { createAnecdote } from "../reducers/anecdoteReducer";
import {
  setNotification,
  clearNotification,
} from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import anecdoteService from "../services/anecdotes";
function AnecdoteForm() {
  const dispatch = useDispatch();
  const addAnecdote = async (event) => {
    event.preventDefault();
    const anecdote = event.target.anecdote.value;
    event.target.anecdote.value = "";
    // post to backend
    // receive response, and set local state, push the new anecdote to local state
    const newAnecdote = await anecdoteService.createAnecdote(anecdote);
    dispatch(createAnecdote(newAnecdote));
    dispatch(setNotification(`you creates a new anecdote '${anecdote}'`));
    setTimeout(() => dispatch(clearNotification()), 5000);
  };
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </>
  );
}

export default AnecdoteForm;
