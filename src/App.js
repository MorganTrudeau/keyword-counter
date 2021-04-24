import "./App.css";
import React, { useState, useMemo, useEffect, useRef } from "react";

const useTimeoutStorage = (value, key) => {
  const messageStorageTimeout = useRef(null);
  useEffect(() => {
    if (messageStorageTimeout.current) {
      clearTimeout(messageStorageTimeout.current);
    }
    setTimeout(() => {
      localStorage.setItem(key, value);
    }, 2000);
  }, [value]);
};

const messageKey = "MESSAGE";
const keywordKey = "KEYWORDS";

function App() {
  const [message, setMessage] = useState(localStorage.getItem(messageKey) || '');
  const [targetKeywords, setTargetKeywords] = useState(
    localStorage.getItem(keywordKey) || ''
  );

  const handleTargetChange = (event) => setTargetKeywords(event.target.value);

  const onChange = (event) => setMessage(event.target.value);

  useTimeoutStorage(message, messageKey);

  useTimeoutStorage(targetKeywords, keywordKey);

  const occurrences = (string, subString, allowOverlapping) => {
    string += "";
    subString += "";
    if (subString.length <= 0) return string.length + 1;

    var n = 0,
      pos = 0,
      step = allowOverlapping ? 1 : subString.length;

    while (true) {
      pos = string.indexOf(subString, pos);
      if (pos >= 0) {
        ++n;
        pos += step;
      } else break;
    }
    return n;
  };

  const keywords = useMemo(() => {
    const wordMap = targetKeywords.split(",").reduce((acc, word) => {
      const num = occurrences(message.toLowerCase(), word.toLowerCase());
      if (!word || num === 0) return acc;
      return {
        ...acc,
        [word]: occurrences(message.toLowerCase(), word.toLowerCase()),
      };
    }, {});

    return Object.entries(wordMap).sort(([_a, a], [_b, b]) => b - a);
  }, [message, targetKeywords]);

  return (
    <div style={{ padding: 40, display: "flex", flexDirection: "column" }}>
      <h1 style={{ marginBottom: 30 }}>Worlds Best Keyword Tracker</h1>

      <h3>Target Keywords</h3>
      <input
        value={targetKeywords}
        onChange={handleTargetChange}
        style={{
          marginBottom: 18,
          fontSize: 18,
          padding: 5,
          borderRadius: 5,
          border: "solid 2px #000",
        }}
      />

      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        {keywords.map(([keyword, count]) => {
          return (
            <h2 style={{ lineHeight: 0.5 }}>
              {keyword}: <span style={{ fontWeight: "bold" }}>{count}</span>
            </h2>
          );
        })}
      </div>

      <h5>Character Count: {message.length}</h5>

      <textarea
        value={message}
        onChange={onChange}
        style={{
          border: "solid 2px #000",
          minHeight: 300,
          fontSize: 18,
          padding: 5,
          borderRadius: 5,
        }}
      />
    </div>
  );
}

export default App;
