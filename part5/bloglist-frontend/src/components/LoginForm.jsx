import { useState } from "react";

function LoginForm({ setMessage, login }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (event) => {
    event.preventDefault();
    // login in
    try {
      await login({username, password});
      setUserName("");
      setPassword("");
    } catch (exception) {
      // error handle
      setMessage("wrong username or password");
      setTimeout(() => setMessage(""), 5000);
    }
  };
  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">username:</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUserName(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button>login</button>
      </form>
    </>
  );
}
export default LoginForm;
