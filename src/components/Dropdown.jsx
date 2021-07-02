const Dropdown = ({ handleChange, running }) => {
  return (
    <form
      className="select"
      style={{
        pointerEvents: running ? "none" : "",
        filter: running ? "brightness(0.5)" : "none",
      }}
    >
      <select name="slct" id="slct" onChange={handleChange}>
        <option>Dijkstra's</option>
        <option>Dijkstra's (with Pathfinding)</option>
        <option>A*</option>
        <option>Prim's (WIP)</option>
        <option>Kruskal's (WIP)</option>
      </select>
    </form>
  );
};

export default Dropdown;
