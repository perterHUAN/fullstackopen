function View({ country }) {
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
        alt={country.flags.alt}
        src={country.flags.png}
        width="200px"
        height="200px"
      />
    </div>
  );
}

export default View;
