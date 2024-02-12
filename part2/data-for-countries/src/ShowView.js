import React from "react";
import View from "./View";
function ShowView({ country }) {
  const [isShow, setShow] = React.useState(false);
  function toggleShow() {
    setShow(!isShow);
  }
  return (
    <div>
      {country.name.common}
      <button onClick={toggleShow}>{isShow ? "hidde" : "show"}</button>
      {isShow && <View country={country} />}
    </div>
  );
}

export default ShowView;
