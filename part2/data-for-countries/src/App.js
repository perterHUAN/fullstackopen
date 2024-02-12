import React, { useEffect } from "react";
import axios from "axios";
import ShowResult from "./ShowResult";
function App() {
  const [search, setSearch] = React.useState("");
  const [countries, setCountries] = React.useState([]);
  function handleChangeSearch(event) {
    const value = event.target.value;
    setSearch(value);
  }
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
      //console.log(response.data);
    });
  }, []);

  const reg = new RegExp(search, "i");
  //console.log("reg: ", reg);
  const searchCountries = countries.filter((country) =>
    reg.test(country.name.common)
  );
  //console.log("the length of searchCountries:", searchCountries.length);
  return (
    <div>
      <div>
        <label htmlFor="search">find countries</label>
        <input
          id="search"
          type="text"
          name="search"
          value={search}
          onChange={handleChangeSearch}
        />
      </div>
      <ShowResult searchCountries={searchCountries} />
    </div>
  );
}

export default App;
