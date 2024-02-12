function ShowResult({ searchCountries }) {
  const length = searchCountries.length;
  if (length > 10) return <div>"Too much matches, specify another filter"</div>;
  if (length <= 10 && length > 1)
    return (
      <>
        {searchCountries.map((country, i) => (
          <div key={i}>{country.name.common}</div>
        ))}
      </>
    );
  if (length === 1) {
    const country = searchCountries[0];
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>area: {country.area}</p>
        <p>capital: {country.capital[0]}</p>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <img
          alt={searchCountries[0].flags.alt}
          src={searchCountries[0].flags.png}
          width="200px"
          height="200px"
        />
      </div>
    );
  }
}

export default ShowResult;
