function Logout({ logout, username }) {
  return (
    <p>
      {username} logged in {}
      <button onClick={logout}>logout</button>
    </p>
  );
}

export default Logout;
