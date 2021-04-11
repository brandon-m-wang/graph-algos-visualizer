const Dropdown = () => {
  return (
    <form class="select">
      <select name="slct" id="slct">
        <option>Djikstra's</option>
        <option>A*</option>
        <option>Prim's</option>
        <option>Kruskal's</option>
      </select>
    </form>
  );
};

export default Dropdown;
