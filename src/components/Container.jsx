/* eslint-disable jsx-a11y/anchor-is-valid */
import Visualizer from "./Visualizer";
import Dropdown from "./Dropdown";
import React, { useEffect, useState } from "react";
import "./styles/Container.css";
import "./styles/Constants.css";

const Container = () => {
  const algoSelect = (event) => {
    event.preventDefault();
    setAlgo(event.target.value);
  };

  // useEffect(() => console.log("RENDER"));

  const reveal = () => {}; //TODO:

  const handleRun = () => {
    console.log(!running);
    setRunning(!running);
  };

  const shuffle = () => {
    setGraph(() => {
      var newState = {
        nodes: Array.from(new Array(15).keys()).map((e) => ({
          id: e,
        })),
        edges: Array.from(new Array(10).keys()).map((e) => {
          var len = getRandomInt(2, 16);
          return {
            from: getRandomInt(0, 15),
            to: getRandomInt(0, 15),
            label: len.toString(),
            length: len * 20,
          };
        }),
      };

      //ensure connectivity
      for (let i = 0; i < 14; i++) {
        let len = getRandomInt(2, 16);
        newState.edges.push({
          from: i,
          to: i + 1,
          label: len.toString(),
          length: len * 20,
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
    setGraphKey(makeid(10));
  };

  const [algo, setAlgo] = useState("Dijkstra's");

  const [graphKey, setGraphKey] = useState(makeid(10));

  const [running, setRunning] = useState(false);

  const [graph, setGraph] = useState(() => {
    var newState = {
      nodes: Array.from(new Array(15).keys()).map((e) => ({
        id: e,
      })),
      edges: Array.from(new Array(13).keys()).map((e) => {
        var len = getRandomInt(2, 16);
        return {
          from: getRandomInt(0, 15),
          to: getRandomInt(0, 15),
          label: len.toString(),
          length: len * 20,
        };
      }),
    };

    //ensure connectivity
    for (let i = 0; i < 14; i++) {
      let len = getRandomInt(2, 16);
      newState.edges.push({
        from: i,
        to: i + 1,
        label: len.toString(),
        length: len * 20,
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
        <a className="button1" onClick={shuffle}>
          Set start vertex
        </a>
        <a className="button2" onClick={shuffle}>
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
      />
    </div>
  );
};

export default Container;
