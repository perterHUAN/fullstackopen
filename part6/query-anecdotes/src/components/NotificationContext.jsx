import { useContext, useReducer } from "react";
import { createContext } from "react";
const notificationReducer = (state, action) => {
  switch (action.type) {
    case "show":
      return action.payload;
    case "hide":
      return "";
    default:
      return "";
  }
};

const NotificationContext = createContext();

export function NotificationProvider(prop) {
  const [message, messageDispatch] = useReducer(notificationReducer, "");

  return (
    <NotificationContext.Provider value={[message, messageDispatch]}>
      {prop.children}
    </NotificationContext.Provider>
  );
}

export const useMessage = () => {
  const [message, _] = useContext(NotificationContext);
  return message;
};

export const useMessageDispatch = () => {
  const [_, messageDispatch] = useContext(NotificationContext);
  return messageDispatch;
};
export default NotificationProvider;
