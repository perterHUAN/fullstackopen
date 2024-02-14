function Message({ message }) {
  if (message === "") return null;
  return <p class="notification">{message}</p>;
}

export default Message;
