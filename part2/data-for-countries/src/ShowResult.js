import View from "./View";
import ShowView from "./ShowView";

function ShowResult({ searchCountries }) {
  const length = searchCountries.length;
  if (length > 10) return <div>"Too much matches, specify another filter"</div>;
  if (length <= 10 && length > 1)
    return (
      <>
        {searchCountries.map((country, i) => (
          <ShowView key={i} country={country} />
        ))}
      </>
    );
  if (length === 1) {
    const country = searchCountries[0];
    return <View country={country} />;
  }
}

export default ShowResult;
