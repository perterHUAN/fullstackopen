import { useMutation, useQueryClient } from "@tanstack/react-query";
import anecdoteServices from "../services/anecdote";
import { useMessageDispatch } from "./NotificationContext";
import showMessage from "../utils/showMessage";
const AnecdoteForm = () => {
  const messageDispatch = useMessageDispatch();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: anecdoteServices.createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData("anecdotes");
      queryClient.setQueryData("anecdotes", anecdotes.concat(newAnecdote));
      showMessage(
        messageDispatch,
        `create a new anecdote '${newAnecdote.content}'`
      );
    },
    onError: () => {
      showMessage(
        messageDispatch,
        "too short anecdote, must have length 5 or more"
      );
    },
  });
  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    console.log("new anecdote");
    mutation.mutate(content);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
