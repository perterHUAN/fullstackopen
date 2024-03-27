import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import anecdoteServices from "./services/anecdote";
import { useMessageDispatch } from "./components/NotificationContext";
import showMessage from "./utils/showMessage";
const App = () => {
  const messageDispatch = useMessageDispatch();
  const result = useQuery({
    queryKey: "anecdotes",
    queryFn: anecdoteServices.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: anecdoteServices.vote,
    onSuccess: (newAnecdote) => {
      console.log("newAnecdote: ", newAnecdote);
      const anecdotes = queryClient.getQueryData("anecdotes");
      console.log("anecdotes: ", anecdotes);
      queryClient.setQueryData(
        "anecdotes",
        anecdotes.map((anecdote) =>
          anecdote.id === newAnecdote.id ? newAnecdote : anecdote
        )
      );
      showMessage(messageDispatch, `anecdote '${newAnecdote.content}' voted`);
    },
  });
  if (result.isLoading) {
    return <div>loading data....</div>;
  }

  if (result.isError) {
    return <div>Error....</div>;
  }
  const handleVote = (anecdote) => {
    mutation.mutate(anecdote);
    console.log("vote");
  };

  const anecdotes = result.data;
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
