export default function showMessage(messageDispatch, message) {
  messageDispatch({
    type: "show",
    payload: message,
  });
  setTimeout(() => messageDispatch({ type: "hide" }), 5000);
}
