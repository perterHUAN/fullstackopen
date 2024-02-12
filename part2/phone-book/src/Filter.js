function Filter({ handleSearchChange, search }) {
  return (
    <>
      <label id="search">filter shown with</label>
      <input
        htmlFor="search"
        type="text"
        name="search"
        value={search}
        onChange={handleSearchChange}
      />
    </>
  );
}

export default Filter;
