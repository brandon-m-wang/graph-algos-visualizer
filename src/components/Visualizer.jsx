import Graph from "react-graph-vis";
import { useCallback, useState, useEffect, componentDidUpdate } from "react";
import "./styles/Visualizer.css";
import "./styles/Constants.css";
import { render } from "@testing-library/react";

//shift alt F

const Visualizer = ({ key, graph, algo, running, handleRun, start, end }) => {
  const [network, setNetwork] = useState({});

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
    release: (event) => {
      var { nodes, edges } = event;
      console.log(nodes, edges);
    },
  };

  const renderGraph = (
    <Graph
      getNetwork={(network) => setNetwork(network)}
      graph={graph}
      options={options}
      events={events}
      key={key}
    />
  );

  useEffect(() => {
    if (running) {
      switch (algo) {
        case "Dijkstra's":
          dijkstras(graph, start, end);
          break;
        case "A*":
          A(graph, start, end);
          break;
        case "Prim's":
          prims(graph, start);
          break;
        case "Kruskal's":
          kruskals(graph);
          break;
        default:
          break;
      }
    }
  });

  function loadNeighbors(graph) {}

  function dijkstras(graph, startVertex, endVertex) {
    //modify Graph options
    network.selectNodes([1, 2, 3]);
    setImmediate(() => {
      handleRun();
    });
  }

  function A(graph, startVertex, endVertex) {}

  function prims(graph, startVertex) {}

  function kruskals(graph) {}

  return renderGraph;
};

export default Visualizer;
