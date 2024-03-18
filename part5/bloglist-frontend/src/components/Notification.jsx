function Notification({ message }) {
  const style = {
    padding: "1rem",
    border: "5px solid blue",
  };
  return (
    <p className="message" style={style}>
      {message}
    </p>
  );
}
export default Notification;
