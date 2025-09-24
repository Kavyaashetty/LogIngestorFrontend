import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // optional, for styling

const API_BASE = "https://logingestorbackend.azurewebsites.net";

function App() {
  const [logs, setLogs] = useState([]);
  const [level, setLevel] = useState("");
  const [prediction, setPrediction] = useState("");
  const [search, setSearch] = useState("");

  // Fetch logs from backend
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

  useEffect(() => {
    fetchLogs();
  }, [level, prediction, search]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📊 Log Viewer</h1>

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
