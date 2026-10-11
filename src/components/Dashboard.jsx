import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
    const [artifact, setArtifact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadLatestArtifact();
    }, []);

    const loadLatestArtifact = async () => {
        try {
            const response = await api.get("/artifacts");

            console.log("Artifacts received:", response.data);

            const data = response.data;

            // Keep only the most recently uploaded artifact.
            if (Array.isArray(data) && data.length > 0) {
                const latest = data.reduce((newest, current) => {
                    const newestTime = new Date(
                        newest.uploadedAt || 0
                    ).getTime();

                    const currentTime = new Date(
                        current.uploadedAt || 0
                    ).getTime();

                    return currentTime > newestTime
                        ? current
                        : newest;
                });

                setArtifact(latest);
            } else {
                setArtifact(null);
            }
        } catch (err) {
            console.error("Backend connection error:", err);
            setError(
                "Unable to connect to Spring Boot backend. Make sure it is running on port 8081."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <h1>AI Archaeologist</h1>

            <p className="subtitle">
                Ancient Artifact Analysis Platform
            </p>

            <div className="dashboard-header">
                <h2>Latest Uploaded Artifact</h2>

                <span className="artifact-count">
                    {artifact ? "1 Artifact" : "0 Artifacts"}
                </span>
            </div>

            {loading && (
                <p className="message">
                    Loading latest artifact...
                </p>
            )}

            {error && (
                <p className="error">{error}</p>
            )}

            {!loading && !error && !artifact && (
                <p className="message">
                    No artifacts found. Upload an artifact to get started.
                </p>
            )}

            {!loading && !error && artifact && (
                <div className="artifact-grid">
                    <div className="artifact-card" key={artifact.id}>
                        <div className="artifact-title">
                            <h3>{artifact.artifactType}</h3>

                            <span className="artifact-id">
                                #{artifact.id}
                            </span>
                        </div>

                        <p>
                            <strong>Description:</strong>{" "}
                            {artifact.description || "No description"}
                        </p>

                        <p>
                            <strong>File:</strong>{" "}
                            {artifact.fileName || "No file"}
                        </p>

                        <p>
                            <strong>Confidence:</strong>{" "}
                            {artifact.confidence ?? "Not analyzed"}
                        </p>

                        <p>
                            <strong>OCR Text:</strong>{" "}
                            {artifact.ocrText || "Not processed"}
                        </p>

                        <p>
                            <strong>Detected Clues:</strong>{" "}
                            {artifact.detectedClues || "Not available"}
                        </p>

                        <p>
                            <strong>Historical Context:</strong>{" "}
                            {artifact.historicalContext || "Not available"}
                        </p>

                        <p>
                            <strong>Interpretation:</strong>{" "}
                            {artifact.interpretation || "Not available"}
                        </p>

                        <p>
                            <strong>Uploaded:</strong>{" "}
                            {artifact.uploadedAt
                                ? new Date(
                                    artifact.uploadedAt
                                ).toLocaleString()
                                : "Unknown"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;