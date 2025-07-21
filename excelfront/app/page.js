"use client";
import React, { useState } from "react";
import axios from "axios";

export default function Page() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
    setSummary(null);
    setTable(null);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file.");
      return;
    }
    setLoading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/import-users",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSummary(res.data);
      setTable(res.data.errors);
    } catch (err) {
      setUploadError(
        err.response?.data?.message ||
        "Upload failed. Please check your file and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "48px auto",
        background: "#1A1D23",
        borderRadius: 14,
        boxShadow: "0 4px 32px #000a",
        padding: 40,
        color: "#f4f6fb",
        fontFamily: "system-ui, sans-serif",
        minHeight: "90vh",
      }}
    >
      <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 28, color: "#fff" }}>
        <span style={{ color: "#5cdcff" }}>Excel User Importer</span>
      </h2>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          style={{
            padding: "10px",
            borderRadius: 6,
            background: "#242834",
            color: "#d5e8fa",
            border: "1px solid #353b49",
            width: 280,
          }}
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            background: loading ? "#2b3c50" : "linear-gradient(90deg, #5cdcff 60%, #5370f7 100%)",
            color: "#101722",
            fontWeight: 600,
            border: "none",
            borderRadius: 6,
            padding: "12px 28px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 16,
            boxShadow: "0 2px 12px #0ff3",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.18s",
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {uploadError && (
        <div style={{ color: "#ff8383", marginTop: 8, fontWeight: 500 }}>{uploadError}</div>
      )}

      {summary && (
        <div
          style={{
            marginTop: 30,
            padding: "18px 20px",
            background: "#22253A",
            borderRadius: 10,
            borderLeft: "5px solid #5cdcff",
            color: "#f7f7fa",
            boxShadow: "0 2px 10px #2226",
          }}
        >
          <h4 style={{ color: "#5cdcff", marginBottom: 10 }}>Import Summary</h4>
          <p>Total Rows: <b>{summary.total}</b></p>
          <p>Imported: <b style={{ color: "#5cff92" }}>{summary.imported}</b></p>
          <p>Failed: <b style={{ color: "#ff8383" }}>{summary.failed}</b></p>
          {summary.failed_url && (
            <a
              href={summary.failed_url}
              download
              style={{
                color: "#fff",
                background: "#5cdcff",
                borderRadius: 6,
                padding: "7px 20px",
                textDecoration: "none",
                marginTop: 12,
                display: "inline-block",
                fontWeight: 600,
                fontSize: 15,
                transition: "background 0.2s",
              }}
            >
              Download Failed Rows Excel
            </a>
          )}
        </div>
      )}

      {table && table.length > 0 && (
        <div style={{ marginTop: 38 }}>
          <h4 style={{ color: "#ffaf66", marginBottom: 10 }}>Errors</h4>
          <div style={{ overflowX: "auto" }}>
            <table
              border={0}
              cellPadding={10}
              cellSpacing={0}
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#202232",
                color: "#fafbfc",
                borderRadius: 12,
                fontSize: 15,
                marginBottom: 40,
                boxShadow: "0 1px 10px #2228",
                minWidth: 600,
              }}
            >
              <thead>
                <tr style={{ background: "#282c3e", color: "#5cdcff" }}>
                  <th style={{ borderBottom: "2px solid #5cdcff" }}>Row</th>
                  <th style={{ borderBottom: "2px solid #5cdcff" }}>Data</th>
                  <th style={{ borderBottom: "2px solid #5cdcff" }}>Errors</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ color: "#faec9e", fontWeight: 600 }}>{row.row}</td>
                    <td>
                      <pre
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: "#90e0ef",
                          background: "#1A1D23",
                          borderRadius: 6,
                          padding: "7px 12px",
                        }}
                      >
                        {JSON.stringify(row.data, null, 2)}
                      </pre>
                    </td>
                    <td>
                      <ul
                        style={{
                          margin: 0,
                          padding: 0,
                          listStyle: "square inside",
                          color: "#ff8383",
                          fontWeight: 500,
                        }}
                      >
                        {row.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
