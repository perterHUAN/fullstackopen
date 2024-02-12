function PersonForm({
  handleAdd,
  newName,
  handleChangeName,
  phoneNumber,
  handleChangePhoneNumber,
}) {
  return (
    <form onSubmit={handleAdd}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={newName}
          onChange={handleChangeName}
          required
        />
      </div>
      <div>
        <label htmlFor="phone-number">Phone Number</label>
        <input
          id="phone-number"
          name="phone-number"
          type="text"
          value={phoneNumber}
          onChange={handleChangePhoneNumber}
          required
        />
      </div>
      <div>
        <button>add</button>
      </div>
    </form>
  );
}

export default PersonForm;
