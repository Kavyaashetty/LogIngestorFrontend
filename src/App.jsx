import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://logingestorbackend.azurewebsites.net";

function App() {
  const [logs, setLogs] = useState([]);
  const [level, setLevel] = useState("");
  const [prediction, setPrediction] = useState("");
  const [search, setSearch] = useState("");

  // Add Log states
  const [showAddLog, setShowAddLog] = useState(false); // toggles expando
  const [newLog, setNewLog] = useState({
    level: "INFO",
    message: "",
    resourceId: "app-service-1",
    timestamp: new Date().toISOString(),
    traceId: "",
    spanId: "",
    commit: "",
    metadata: { env: "production", server: "web-01" },
  });

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/logs`, {
        params: {
          level: level || undefined,
          prediction: prediction || undefined,
          q: search || undefined,
          page: 1,
          page_size: 20,
        },
      });
      setLogs(res.data.items || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  const addLog = async () => {
    try {
      await axios.post(`${API_BASE}/ingest`, newLog);
      alert("Log added successfully!");
      fetchLogs();
      setNewLog((prev) => ({ ...prev, message: "" })); // reset only message
    } catch (err) {
      console.error("Error adding log:", err);
      alert("Failed to add log.");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [level, prediction, search]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📊 Log Viewer</h1>

      {/* Add Log Expando */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
            marginBottom: "10px",
          }}
          onClick={() => setShowAddLog(!showAddLog)}
        >
          <h2>Add Log {showAddLog ? "▲" : "▼"}</h2>
          <span style={{ fontSize: "20px" }}>{showAddLog ? "-" : "+"}</span>
        </div>

        {/* Always visible basic fields */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={newLog.level}
            onChange={(e) =>
              setNewLog((prev) => ({ ...prev, level: e.target.value }))
            }
          >
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>

          <input
            type="text"
            placeholder="Message"
            value={newLog.message}
            onChange={(e) =>
              setNewLog((prev) => ({ ...prev, message: e.target.value }))
            }
          />

          <button onClick={addLog}>Add Log</button>
        </div>

        {/* Expandable advanced fields */}
        {showAddLog && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Trace ID"
              value={newLog.traceId}
              onChange={(e) =>
                setNewLog((prev) => ({ ...prev, traceId: e.target.value }))
              }
            />

            <input
              type="text"
              placeholder="Span ID"
              value={newLog.spanId}
              onChange={(e) =>
                setNewLog((prev) => ({ ...prev, spanId: e.target.value }))
              }
            />

            <input
              type="text"
              placeholder="Commit"
              value={newLog.commit}
              onChange={(e) =>
                setNewLog((prev) => ({ ...prev, commit: e.target.value }))
              }
            />

            <input
              type="text"
              placeholder="Server"
              value={newLog.metadata.server}
              onChange={(e) =>
                setNewLog((prev) => ({
                  ...prev,
                  metadata: { ...prev.metadata, server: e.target.value },
                }))
              }
            />
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All Levels</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
        </select>

        <select
          value={prediction}
          onChange={(e) => setPrediction(e.target.value)}
        >
          <option value="">All Predictions</option>
          <option value="normal">Normal</option>
          <option value="anomaly">Anomaly</option>
        </select>

        <input
          type="text"
          placeholder="Search message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={fetchLogs}>Refresh</button>
      </div>

      {/* Log Table */}
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Level</th>
            <th>Message</th>
            <th>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.level}</td>
              <td>{log.message}</td>
              <td>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    color: "white",
                    backgroundColor:
                      log.prediction === "anomaly" ? "red" : "green",
                  }}
                >
                  {log.prediction}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {logs.length === 0 && <p>No logs found.</p>}
    </div>
  );
}

export default App;
