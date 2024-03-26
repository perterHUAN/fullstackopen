import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useQuery } from "@tanstack/react-query";
import anecdoteServices from "./services/anecdote";
const App = () => {
  const result = useQuery({
    queryKey: "anecdotes",
    queryFn: anecdoteServices.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (result.isLoading) {
    return <div>loading data....</div>;
  }

  if (result.isError) {
    return <div>Error....</div>;
  }
  const handleVote = (anecdote) => {
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
