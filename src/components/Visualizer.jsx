import Graph from "react-graph-vis";
import FastPriorityQueue from "fastpriorityqueue";
import Info from "./Info";
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
  numNodes,
  networkHandler,
  start,
  end,
}) => {
  const [network, setNetwork] = useState({});

  const options = {
    physics: {
      enabled: true,
      barnesHut: {
        springLength: 95,
        springConstant: 0.01,
        centralGravity: 1.5,
        avoidOverlap: 1,
      },
    },
    interaction: {
      dragView: true,
      hover: true,
      zoomView: true,
    },
    nodes: {
      shape: "circle",
      size: 15,
      mass: 2.7,
      color: {
        highlight: {
          border: "#FFA500",
          background: "#FFD700",
        },
      },
    },
    manipulation: {
      enabled: false,
      editNode: function (nodeData, callback) {
        nodeData.color.highlight.background = "#66CD00";
        nodeData.color.highlight.border = "#4A7023";
        callback(nodeData);
      },
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
      width: 0.5,
      selectionWidth: 3,
      color: {
        highlight: "#DE6FA1",
      },
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

  const defaultSettings = {
    id: 0,
    shape: "circle",
    size: 15,
    mass: 2.7,
    label: "",
    color: {
      highlight: {
        border: "#FFA500",
        background: "#FFD700",
      },
    },
  };

  function updateNodeLabel(id, dist) {
    let settings = JSON.parse(JSON.stringify(defaultSettings));
    settings.id = id.toString();
    settings.label = dist.toString();
    return settings;
  }

  function updateStartNodeLabel(id, dist) {
    let settings = JSON.parse(JSON.stringify(defaultSettings));
    settings.color.background = "#66CD00";
    settings.color.border = "#4A7023";
    settings.chosen = false;
    settings.id = id.toString();
    settings.label = dist.toString();
    return settings;
  }

  function updateEndNodeLabel(id, dist) {
    let settings = JSON.parse(JSON.stringify(defaultSettings));
    settings.color.background = "#ff4c4c";
    settings.color.border = "#7f0000";
    settings.chosen = false;
    settings.id = id.toString();
    settings.label = dist.toString();
    return settings;
  }

  useEffect(() => {
    networkHandler(network);
    if (running) {
      switch (algo) {
        case "Dijkstra's":
          dijkstras(start, null, false);
          break;
        case "Dijkstra's (with Pathfinding)":
          dijkstras(start, end, true);
          break;
        case "A*":
          A(start, end);
          break;
        case "Prim's (WIP)":
          prims(start);
          break;
        case "Kruskal's (WIP)":
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

  async function dijkstras(startVertex, endVertex, withPathfinding) {
    network.unselectAll();
    //some tree structure to track final path
    var TreeModel = require("tree-model"),
      tree = new TreeModel(),
      root = tree.parse({ id: startVertex, children: [{}] });

    for (var i = 0; i < numNodes; i++) {
      network.body.data.nodes.update({ id: i, label: "" });
    }
    network.setSelection(
      {
        nodes: [startVertex],
      },
      {
        unselectAll: false,
        highlightEdges: false,
      }
    );

    network.body.data.nodes.update({ id: startVertex, label: "0" });

    const fringe = new FastPriorityQueue(function (a, b) {
      return a[1] < b[1];
    });

    const distTo = new Array(numNodes).fill(Number.MAX_SAFE_INTEGER);
    distTo[startVertex] = 0;

    fringe.add([startVertex, 0]);

    for (let i = 0; i < numNodes - 1; i++) {
      if (i !== startVertex) {
        fringe.add([i, Number.MAX_SAFE_INTEGER]);
      }
    }

    while (!fringe.isEmpty()) {
      await new Promise((r) => setTimeout(r, 65));
      //&& fringe.peek()[0] !== endVertex
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
      let treePos = root.first(function (node) {
        return node.model.id === currVertex;
      });
      async function processNeighbors(neighbor) {
        let commonEdge = await neighboringEdges.filter((edge) =>
          network.getConnectedEdges(neighbor).includes(edge)
        )[0]; //gives common edge in single-element array
        if (currVertexDist + parseInt(edges[commonEdge]) < distTo[neighbor]) {
          fringe.removeOne((x) => arraysEqual(x, [neighbor, distTo[neighbor]]));
          distTo[neighbor] = currVertexDist + parseInt(edges[commonEdge]);
          fringe.add([neighbor, distTo[neighbor]]);
          network.body.data.nodes.update({
            id: neighbor,
            label: distTo[neighbor].toString(),
          });
          let oldPos = root.first(function (node) {
            return node.model.id === neighbor;
          });
          if (oldPos !== undefined) {
            oldPos.drop();
          }
          treePos.addChild(tree.parse({ id: neighbor, children: [{}] }));
          network.setSelection(
            {
              nodes: [neighbor],
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
        processNeighbors(neighbor);
      }

      fringe.poll();
    }
    if (withPathfinding) {
      const endPos = root.first(function (node) {
        return node.model.id === endVertex;
      });
      const shortestPath = endPos.getPath();
      network.unselectAll();
      for (let i = 0; i < shortestPath.length - 1; i++) {
        let neighboringEdges = network.getConnectedEdges(
          shortestPath[i].model.id
        );
        let commonEdge = await neighboringEdges.filter((edge) =>
          network.getConnectedEdges(shortestPath[i + 1].model.id).includes(edge)
        )[0];
        network.setSelection(
          {
            nodes: [shortestPath[i].model.id],
            edges: [commonEdge],
          },
          {
            unselectAll: false,
            highlightEdges: false,
          }
        );
        await new Promise((r) => setTimeout(r, 265));
      }
    }
    setImmediate(() => {
      handleRun();
    });
  }

  async function A(startVertex, endVertex) {
    network.unselectAll();
    //some tree structure to track final path
    const heuristic = (neighboringEdges) => {
      return Math.min(...neighboringEdges.map((edge) => parseInt(edges[edge])));
    };

    var TreeModel = require("tree-model"),
      tree = new TreeModel(),
      root = tree.parse({ id: startVertex, children: [{}] });

    for (var i = 0; i < numNodes; i++) {
      network.body.data.nodes.update({ id: i, label: "" });
    }
    network.setSelection(
      {
        nodes: [startVertex],
      },
      {
        unselectAll: false,
        highlightEdges: false,
      }
    );

    network.body.data.nodes.update({ id: startVertex, label: "0" });

    const fringe = new FastPriorityQueue(function (a, b) {
      return a[1] < b[1];
    });

    const distTo = new Array(numNodes).fill(Number.MAX_SAFE_INTEGER);
    distTo[startVertex] = 0;

    fringe.add([startVertex, 0]);

    for (let i = 0; i < numNodes - 1; i++) {
      if (i !== startVertex) {
        fringe.add([i, Number.MAX_SAFE_INTEGER]);
      }
    }

    while (!fringe.isEmpty()) {
      await new Promise((r) => setTimeout(r, 65));
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
      let treePos = root.first(function (node) {
        return node.model.id === currVertex;
      });
      if (currVertex === endVertex) {
        break;
      }
      async function processNeighbors(neighbor) {
        let commonEdge = await neighboringEdges.filter((edge) =>
          network.getConnectedEdges(neighbor).includes(edge)
        )[0]; //gives common edge in single-element array
        if (currVertexDist + parseInt(edges[commonEdge]) < distTo[neighbor]) {
          fringe.removeOne((x) => arraysEqual(x, [neighbor, distTo[neighbor]]));
          distTo[neighbor] = currVertexDist + parseInt(edges[commonEdge]);
          fringe.add([
            neighbor,
            distTo[neighbor] + heuristic(neighboringEdges),
          ]);
          network.body.data.nodes.update({
            id: neighbor,
            label: distTo[neighbor].toString(),
          });
          let oldPos = root.first(function (node) {
            return node.model.id === neighbor;
          });
          if (oldPos !== undefined) {
            oldPos.drop();
          }
          treePos.addChild(tree.parse({ id: neighbor, children: [{}] }));
          network.setSelection(
            {
              nodes: [neighbor],
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
        processNeighbors(neighbor);
      }
      fringe.poll();
    }
    const endPos = root.first(function (node) {
      return node.model.id === endVertex;
    });
    const shortestPath = endPos.getPath();
    network.unselectAll();
    for (let i = 0; i < shortestPath.length - 1; i++) {
      let neighboringEdges = network.getConnectedEdges(
        shortestPath[i].model.id
      );
      let commonEdge = await neighboringEdges.filter((edge) =>
        network.getConnectedEdges(shortestPath[i + 1].model.id).includes(edge)
      )[0];
      network.setSelection(
        {
          nodes: [shortestPath[i].model.id],
          edges: [commonEdge],
        },
        {
          unselectAll: false,
          highlightEdges: false,
        }
      );
      await new Promise((r) => setTimeout(r, 265));
    }
    setImmediate(() => {
      handleRun();
    });
  }

  function prims(startVertex) {
    network.unselectAll();
    setImmediate(() => {
      handleRun();
    });
  }

  function kruskals() {
    network.unselectAll();
    setImmediate(() => {
      handleRun();
    });
  }

  return renderGraph;
};

export default Visualizer;
