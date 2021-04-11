const Dropdown = ({ handleChange }) => {
  return (
    <form className="select">
      <select name="slct" id="slct" onChange={handleChange}>
        <option>Djikstra's</option>
        <option>A*</option>
        <option>Prim's</option>
        <option>Kruskal's</option>
      </select>
    </form>
  );
};

export default Dropdown;
