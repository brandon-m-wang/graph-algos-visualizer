/* eslint-disable jsx-a11y/anchor-is-valid */
import Visualizer from "./Visualizer";
import Dropdown from "./Dropdown";
import React, { useEffect, useState } from "react";
import "./styles/Container.css";
import "./styles/Constants.css";

const numNodes = 50;
const randEdges = 30;

const Container = () => {
  const algoSelect = (event) => {
    event.preventDefault();
    setAlgo(event.target.value);
  };

  // useEffect(() => console.log("RENDER"));

  const reveal = () => {}; //TODO:

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
          nodeData.color.background = "#D2E5FF";
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
          nodeData.color.background = "#D2E5FF";
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
    undoVertexStartSelection();
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
  };

  const setEnd = () => {
    undoVertexEndSelection();
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
  };

  const handleRun = () => {
    if (startVertex == null) {
      //handle
      alert("Choose starting vertex.");
      return;
    }
    if (endVertex == null) {
      //handle all cases that might not require end vertex
      alert("Choose end vertex.");
      return;
    }
    setRunning(!running);
  };

  const [edgeState, setEdgeState] = useState({});

  const shuffle = () => {
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

  return (
    <div>
      <div id="header">
        <h3 style={{ position: "absolute", left: 0 }}>
          Graph Traversal Algorithms
        </h3>
        <a className="button" onClick={shuffle}>
          Shuffle
        </a>
        <a className="button1" onClick={setStart}>
          Set start vertex
        </a>
        <a className="button2" onClick={setEnd}>
          Set end vertex
        </a>
        <Dropdown handleChange={algoSelect} />
        <a className="button" onClick={handleRun}>
          Run
        </a>
        <a className="button" onClick={reveal}>
          Detailed runtime info
        </a>
        {/* {algo === "Kruskal's" ? (
          <h3>WQUPC Object (Disjoint Sets):</h3>
        ) : (
          <h3>Priority Queue (Fringe):</h3>
        )} */}
      </div>
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
  );
};

export default Container;
