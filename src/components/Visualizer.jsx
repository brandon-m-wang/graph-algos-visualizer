import Graph from "react-graph-vis";
import FastPriorityQueue from "fastpriorityqueue";
import { useCallback, useState, useEffect, componentDidUpdate } from "react";
import "./styles/Visualizer.css";
import "./styles/Constants.css";
import { render } from "@testing-library/react";

//shift alt F

const Visualizer = ({
  key,
  graph,
  algo,
  running,
  handleRun,
  edges,
  start,
  end,
}) => {
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
      chosen: true,
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
    select: (event) => {
      var { nodes, edges } = event;
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
          dijkstras(1, 14);
          break;
        case "A*":
          A(start, end);
          break;
        case "Prim's":
          prims(start);
          break;
        case "Kruskal's":
          kruskals();
          break;
        default:
          break;
      }
    }
  });

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  async function dijkstras(startVertex, endVertex) {
    //modify Graph options
    const fringe = new FastPriorityQueue(function (a, b) {
      return a[1] < b[1];
    });
    const distTo = new Array(15).fill(Number.MAX_SAFE_INTEGER);
    distTo[startVertex] = 0;

    fringe.add([startVertex, 0]);

    for (let i = 0; i < 14; i++) {
      if (i !== startVertex) {
        fringe.add([i, Number.MAX_SAFE_INTEGER]);
      }
    }

    while (!fringe.isEmpty()) {
      await new Promise((r) => setTimeout(r, 1000));
      //&& fringe.peek()[0] !== endVertex
      fringe.forEach((value, index) => console.log(value, index));
      console.log(distTo);
      let currVertex = fringe.peek()[0];
      let currVertexDist = fringe.peek()[1];
      let neighboringVertices = network.getConnectedNodes(currVertex);
      let neighboringEdges = network.getConnectedEdges(currVertex);
      network.setSelection(
        {
          nodes: [currVertex],
        },
        {
          unselectAll: false,
          highlightEdges: false,
        }
      );

      async function processNeighbors(neighbor) {
        let commonEdge = await neighboringEdges.filter((edge) =>
          network.getConnectedEdges(neighbor).includes(edge)
        )[0]; //gives common edge in single-element array
        console.log(commonEdge);
        if (currVertexDist + parseInt(edges[commonEdge]) < distTo[neighbor]) {
          fringe.removeOne((x) => arraysEqual(x, [neighbor, distTo[neighbor]]));
          distTo[neighbor] = currVertexDist + parseInt(edges[commonEdge]);
          fringe.add([neighbor, distTo[neighbor]]);
          network.setSelection(
            {
              edges: [commonEdge],
            },
            {
              unselectAll: false,
              highlightEdges: false,
            }
          );
        }
      }

      for (let i = 0; i < neighboringVertices.length; i++) {
        let neighbor = neighboringVertices[i];
        await processNeighbors(neighbor);
      }

      fringe.poll();
    }

    setImmediate(() => {
      handleRun();
    });
  }

  function A(startVertex, endVertex) {}

  function prims(startVertex) {}

  function kruskals() {}

  return renderGraph;
};

export default Visualizer;
