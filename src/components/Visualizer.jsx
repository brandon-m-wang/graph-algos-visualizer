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
    physics: {
      barnesHut: {
        springLength: 95,
        springConstant: 0.04,
        centralGravity: 1.5,
        avoidOverlap: 1,
      },
    },
    interaction: {
      dragView: false,
      hover: true,
      zoomView: false,
    },
    nodes: {
      shape: "dot",
      size: 15,
      mass: 2.7,
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
      font: {
        size: 16,
      },
      smooth: {
        enabled: true,
        type: "continuous",
      },
    },
    height: "100%",
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };
  return <Graph graph={graph} options={options} events={events} key={key} />;
};

export default Visualizer;
