import "./styles/Constants.css";

const Input = ({ handleInput, running }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "0 1.1rem 0",
        pointerEvents: running ? "none" : "",
        filter: running ? "brightness(0.5)" : "none",
      }}
    >
      <label htmlFor="nodeCount">Nodes:</label>
      <input
        maxLength="2"
        id="nodeCount"
        onChange={handleInput}
        defaultValue="40"
      />
    </div>
  );
};

export default Input;
