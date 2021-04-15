/* eslint-disable jsx-a11y/anchor-is-valid */
import Visualizer from "./Visualizer";
import Dropdown from "./Dropdown";
import Input from "./Input";
import React, { useState } from "react";
import "./styles/Container.css";
import "./styles/Constants.css";

const Container = () => {
  const [numNodes, setNumNodes] = useState(40);
  const randEdges = Math.round(numNodes * 0.6);
  const algoSelect = (event) => {
    event.preventDefault();
    if (startVertex !== undefined && startVertex !== null) {
      network.body.nodes[startVertex].options.color.border = "#2B7CE9";
      network.body.nodes[startVertex].options.color.background = "#98C2FC";
      network.body.nodes[startVertex].options.chosen = true;
    }
    if (endVertex !== undefined && endVertex !== null) {
      network.body.nodes[endVertex].options.color.border = "#2B7CE9";
      network.body.nodes[endVertex].options.color.background = "#98C2FC";
      network.body.nodes[endVertex].options.chosen = true;
    }
    setStartVertex(null);
    setEndVertex(null);
    for (let i = 0; i < numNodes; i++) {
      network.body.data.nodes.update({ id: i, label: "" });
    }
    network.unselectAll();
    setAlgo(event.target.value);
  };

  // useEffect(() => console.log("RENDER"));

  const reveal = () => {}; //TODO:

  const handleInput = (event) => {
    event.preventDefault();
    setNumNodes(parseInt(event.target.value));
    setNumChanged(true);
  };

  const [numChanged, setNumChanged] = useState(false);

  const [startVertex, setStartVertex] = useState();

  const [endVertex, setEndVertex] = useState();

  const [network, setNetwork] = useState({});

  const liftNetworkState = (network) => {
    setNetwork(network);
  };

  const undoVertexStartSelection = () => {
    let reselect = network.getSelectedNodes()[0];
    if (startVertex == null) {
      return;
    }
    network.setSelection(
      {
        nodes: [startVertex],
      },
      {
        unselectAll: true,
        highlightEdges: false,
      }
    );
    network.setOptions({
      manipulation: {
        editNode: function (nodeData, callback) {
          nodeData.color.background = "#98C2FC";
          nodeData.color.border = "#2B7CE9";
          nodeData.chosen = true;
          callback(nodeData);
        },
      },
    });
    network.editNode();
    network.setSelection(
      {
        nodes: [reselect],
      },
      {
        unselectAll: true,
        highlightEdges: false,
      }
    );
  };

  const undoVertexEndSelection = () => {
    let reselect = network.getSelectedNodes()[0];
    if (endVertex == null) {
      return;
    }
    network.setSelection(
      {
        nodes: [endVertex],
      },
      {
        unselectAll: true,
        highlightEdges: false,
      }
    );
    network.setOptions({
      manipulation: {
        editNode: function (nodeData, callback) {
          nodeData.color.background = "#98C2FC";
          nodeData.color.border = "#2B7CE9";
          nodeData.chosen = true;
          callback(nodeData);
        },
      },
    });
    network.editNode();
    network.setSelection(
      {
        nodes: [reselect],
      },
      {
        unselectAll: true,
        highlightEdges: false,
      }
    );
  };

  const setStart = () => {
    if (network.getSelectedNodes().length === 0) {
      alert("Highlight a node first.");
      return;
    }
    undoVertexStartSelection();
    network.setSelection(
      {
        nodes: [network.getSelectedNodes()[0]],
      },
      {
        unselectAll: true,
        highlightEdges: false,
      }
    );
    setStartVertex(network.getSelectedNodes()[0]);
    network.setOptions({
      manipulation: {
        editNode: function (nodeData, callback) {
          nodeData.color.background = "#66CD00";
          nodeData.color.border = "#4A7023";
          nodeData.chosen = false;
          callback(nodeData);
        },
      },
    });
    network.editNode();
    network.unselectAll();
  };

  const setEnd = () => {
    if (network.getSelectedNodes().length === 0) {
      alert("Highlight a node first.");
      return;
    }
    undoVertexEndSelection();
    network.setSelection(
      {
        nodes: [network.getSelectedNodes()[0]],
      },
      {
        unselectAll: true,
        highlightEdges: false,
      }
    );
    network.setOptions({
      manipulation: {
        editNode: function (nodeData, callback) {
          nodeData.color.background = "#ff4c4c";
          nodeData.color.border = "#7f0000";
          nodeData.chosen = false;
          callback(nodeData);
        },
      },
    });
    setEndVertex(network.getSelectedNodes()[0]);
    network.editNode();
    network.unselectAll();
  };

  const handleRun = () => {
    if (startVertex == null) {
      alert("Choose starting vertex.");
      return;
    }
    if (algo === "Dijkstra's (with Pathfinding)") {
      if (endVertex == null) {
        alert("Choose end vertex.");
        return;
      }
    }
    setRunning(!running);
  };

  const [edgeState, setEdgeState] = useState({});

  const shuffle = () => {
    if (numNodes > 50) {
      alert("Too many nodes (render physics performance issues). Try <= 50");
      return;
    }
    setNumChanged(false);
    setStartVertex(null);
    setEndVertex(null);
    const edges = {};
    setGraph(() => {
      var newState = {
        nodes: Array.from(new Array(numNodes).keys()).map((e) => ({
          id: e,
        })),
        edges: Array.from(new Array(randEdges).keys()).map((e) => {
          var len = getRandomInt(2, 16);
          var id = makeid(10);
          edges[id] = len.toString();
          return {
            from: getRandomInt(0, numNodes),
            to: getRandomInt(0, numNodes),
            label: len.toString(),
            length: len * 20,
            id: id,
          };
        }),
      };
      //ensure connectivity
      for (let i = 0; i < numNodes - 1; i++) {
        let len = getRandomInt(2, 16);
        var id = makeid(10);
        edges[id] = len.toString();
        newState.edges.push({
          from: i,
          to: i + 1,
          label: len.toString(),
          length: len * 20,
          id: id,
        });
      }

      //no overlapping
      newState.edges = newState.edges.filter((e, i) => {
        return (
          newState.edges.findIndex((x) => {
            return (
              (x.to === e.to && x.from === e.from) ||
              (x.from === e.to && e.from === x.to)
            );
          }) === i
        );
      });

      //no self-reference
      newState.edges = newState.edges.filter((edge) => edge.to !== edge.from);

      return newState;
    });
    setEdgeState(edges);
    setGraphKey(makeid(10));
  };

  const [algo, setAlgo] = useState("Dijkstra's");

  const [graphKey, setGraphKey] = useState(makeid(10));

  const [running, setRunning] = useState(false);

  const [graph, setGraph] = useState(() => {
    const edges = {};
    var newState = {
      nodes: Array.from(new Array(numNodes).keys()).map((e) => ({
        id: e,
      })),
      edges: Array.from(new Array(randEdges).keys()).map((e) => {
        var len = getRandomInt(2, 16);
        var id = makeid(10);
        edges[id] = len.toString();
        return {
          from: getRandomInt(0, numNodes),
          to: getRandomInt(0, numNodes),
          label: len.toString(),
          length: len * 20,
          id: id,
        };
      }),
    };

    //ensure connectivity
    for (let i = 0; i < numNodes - 1; i++) {
      let len = getRandomInt(2, 16);
      var id = makeid(10);
      edges[id] = len.toString();
      newState.edges.push({
        from: i,
        to: i + 1,
        label: len.toString(),
        length: len * 20,
        id: id,
      });
    }

    //no overlapping
    newState.edges = newState.edges.filter((e, i) => {
      return (
        newState.edges.findIndex((x) => {
          return (
            (x.to === e.to && x.from === e.from) ||
            (x.from === e.to && e.from === x.to)
          );
        }) === i
      );
    });

    //no self-reference
    newState.edges = newState.edges.filter((edge) => edge.to !== edge.from);
    setEdgeState(edges);
    return newState;
  });

  function makeid(length) {
    var result = [];
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    return result.join("");
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  const resetLabels = () => {
    if (!running && network.getSelectedNodes().length === 0) {
      for (let i = 0; i < numNodes; i++) {
        network.body.data.nodes.update({ id: i, label: "" });
      }
    }
  };

  return (
    <div>
      <div id="header">
        <a
          className="button"
          onClick={shuffle}
          style={{
            pointerEvents: running ? "none" : "",
            filter: running ? "brightness(0.5)" : "none",
          }}
        >
          Generate
        </a>
        <Input
          handleInput={handleInput} running={running}
        />
        <a
          className="button1"
          onClick={setStart}
          style={{
            pointerEvents: running || numChanged ? "none" : "",
            filter: running || numChanged ? "brightness(0.5)" : "none",
          }}
        >
          Set start vertex
        </a>
        <a
          className="button2"
          onClick={setEnd}
          style={{
            pointerEvents:
              running || numChanged || algo === "Dijkstra's" ? "none" : "",
            filter:
              running || numChanged || algo === "Dijkstra's"
                ? "brightness(0.5)"
                : "none",
          }}
        >
          Set end vertex
        </a>
        <Dropdown handleChange={algoSelect} running={running || numChanged} />
        <a
          className="button"
          onClick={handleRun}
          style={{
            pointerEvents: running || numChanged ? "none" : "",
            filter: running || numChanged ? "brightness(0.5)" : "none",
          }}
        >
          Run
        </a>
        {/* <a className="button" onClick={reveal}>
          Detailed runtime info
        </a> */}
        {/* {algo === "Kruskal's" ? (
          <h3>WQUPC Object (Disjoint Sets):</h3>
        ) : (
          <h3>Priority Queue (Fringe):</h3>
        )} */}
      </div>
      <div
        style={{
          pointerEvents: running || numChanged ? "none" : "",
        }}
        onClick={resetLabels}
      >
        <Visualizer
          key={graphKey}
          graph={graph}
          algo={algo}
          running={running}
          handleRun={handleRun}
          edges={edgeState}
          numNodes={numNodes}
          networkHandler={liftNetworkState}
          start={startVertex}
          end={endVertex}
        />
      </div>
    </div>
  );
};

export default Container;
