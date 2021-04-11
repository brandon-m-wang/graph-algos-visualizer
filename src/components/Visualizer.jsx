import Graph from "react-graph-vis";
import { useCallback } from "react";
import "./styles/Visualizer.css";
import "./styles/Constants.css";

//shift alt F

const Visualizer = ({ key, graph, onShuffle, onAlgoSwitch }) => {
  const handleShuffle = useCallback(
    (event) => {
      onShuffle(event.target.value);
    },
    [onShuffle]
  );

  const options = {
    nodes: {
      shape: "dot",
      size: 15,
      mass: 2,
    },
    layout: {
      hierarchical: false,
    },
    edges: {
      arrows: {
        to: {
          enabled: false,
        },
        middle: {
          enabled: false,
        },
        from: {
          enabled: false,
        },
      },
      chosen: false,
      smooth: true,
    },
    height: "700px",
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };
  return <Graph graph={graph} options={options} events={events} key={key} />;
};

export default Visualizer;
