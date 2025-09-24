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
  const [showAddLog, setShowAddLog] = useState(false);
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
      setNewLog((prev) => ({ ...prev, message: "" }));
    } catch (err) {
      console.error("Error adding log:", err);
      alert("Failed to add log.");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [level, prediction, search]);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          padding: "30px 40px",
          boxSizing: "border-box",
          marginTop: "30px",
        }}
      >
        <h1
          style={{
            marginBottom: "24px",
            fontWeight: "700",
            fontSize: "2.2rem",
            color: "#1f2937",
          }}
        >
          📊 Log Viewer
        </h1>

        {/* Add Log Expando */}
        <div
          style={{
            marginBottom: "24px",
            padding: "16px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
              marginBottom: "14px",
              userSelect: "none",
              color: "#334155",
              fontWeight: "600",
              fontSize: "1.1rem",
            }}
            onClick={() => setShowAddLog(!showAddLog)}
          >
            <span>Add Log {showAddLog ? "▲" : "▼"}</span>
            <span
              style={{
                fontSize: "22px",
                fontWeight: "700",
                lineHeight: "0",
              }}
            >
              {showAddLog ? "−" : "+"}
            </span>
          </div>

          {/* Always visible basic fields */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <select
              value={newLog.level}
              onChange={(e) =>
                setNewLog((prev) => ({ ...prev, level: e.target.value }))
              }
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                fontWeight: "600",
                color: "#334155",
                minWidth: "120px",
                cursor: "pointer",
                transition: "border-color 0.2s ease",
              }}
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
              style={{
                flexGrow: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "1rem",
                color: "#334155",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
            />

            <button
              onClick={addLog}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 25px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              Add Log
            </button>
          </div>

          {/* Expandable advanced fields */}
          {showAddLog && (
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              {[
                { placeholder: "Trace ID", value: newLog.traceId, key: "traceId" },
                { placeholder: "Span ID", value: newLog.spanId, key: "spanId" },
                { placeholder: "Commit", value: newLog.commit, key: "commit" },
              ].map(({ placeholder, value, key }) => (
                <input
                  key={key}
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) =>
                    setNewLog((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  style={{
                    flex: "1 1 160px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "1rem",
                    color: "#334155",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                />
              ))}

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
                style={{
                  flex: "1 1 160px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "1rem",
                  color: "#334155",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>
          )}
        </div>

        {/* Filters */}
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              color: "#334155",
              fontWeight: "600",
              minWidth: "140px",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
            }}
          >
            <option value="">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>

          <select
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              color: "#334155",
              fontWeight: "600",
              minWidth: "140px",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
            }}
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
            style={{
              flexGrow: 1,
              minWidth: "200px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              color: "#334155",
              outline: "none",
              transition: "border-color 0.2s ease",
            }}
          />

          <button
            onClick={fetchLogs}
            style={{
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 28px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#16a34a")}
          >
            Refresh
          </button>
        </div>

        {/* Log Table */}
        <table
          border="1"
          cellPadding="8"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.95rem",
            color: "#334155",
          }}
        >
          <thead style={{ backgroundColor: "#f1f5f9" }}>
            <tr>
              <th style={{ textAlign: "left", padding: "12px 10px" }}>
                Timestamp
              </th>
              <th style={{ textAlign: "left", padding: "12px 10px" }}>Level</th>
              <th style={{ textAlign: "left", padding: "12px 10px" }}>Message</th>
              <th style={{ textAlign: "left", padding: "12px 10px" }}>
                Prediction
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                }}
              >
                <td style={{ padding: "10px" }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td style={{ padding: "10px" }}>{log.level}</td>
                <td style={{ padding: "10px" }}>{log.message}</td>
                <td style={{ padding: "10px" }}>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "12px",
                      color: "white",
                      backgroundColor:
                        log.prediction === "anomaly" ? "#dc2626" : "#22c55e",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      textTransform: "capitalize",
                      display: "inline-block",
                      minWidth: "70px",
                      textAlign: "center",
                    }}
                  >
                    {log.prediction || "N/A"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && (
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              color: "#64748b",
              fontStyle: "italic",
            }}
          >
            No logs found.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
