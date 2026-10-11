import { useState } from "react";
import api from "../api";

function UploadArtifact({ onUploadSuccess }) {

    const [file, setFile] = useState(null);
    const [artifactType, setArtifactType] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleUpload = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!file) {
            setError("Please select an artifact image.");
            return;
        }

        if (!artifactType.trim()) {
            setError("Please enter the artifact type.");
            return;
        }

        if (!description.trim()) {
            setError("Please enter a description.");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);
        formData.append("artifactType", artifactType);
        formData.append("description", description);

        try {

            setLoading(true);

            console.log("Uploading file:", file.name);
            console.log("Artifact type:", artifactType);
            console.log("Description:", description);

            const response = await api.post(
                "/artifacts/upload",
                formData
            );

            console.log(
                "Upload successful:",
                response.data
            );

            setMessage(
                "Artifact uploaded successfully!"
            );

            setFile(null);
            setArtifactType("");
            setDescription("");

            const fileInput =
                document.getElementById("artifact-file");

            if (fileInput) {
                fileInput.value = "";
            }

            if (onUploadSuccess) {
                onUploadSuccess();
            }

        } catch (err) {

            console.error(
                "FULL UPLOAD ERROR:",
                err
            );

            if (err.response) {

                console.error(
                    "Backend status:",
                    err.response.status
                );

                console.error(
                    "Backend response:",
                    err.response.data
                );

                setError(
                    "Backend error: " +
                    err.response.status +
                    " - " +
                    (
                        typeof err.response.data === "string"
                            ? err.response.data
                            : "Upload failed"
                    )
                );

            } else if (err.request) {

                console.error(
                    "No response from backend:",
                    err.request
                );

                setError(
                    "Spring Boot did not respond. Make sure the backend is running on port 8081."
                );

            } else {

                setError(
                    "Upload request failed: " +
                    err.message
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="upload-container">

            <h2>
                Upload New Artifact
            </h2>

            <p className="upload-subtitle">
                Upload an archaeological artifact
                for AI analysis.
            </p>

            <form
                className="upload-form"
                onSubmit={handleUpload}
            >

                <label>
                    Artifact Image
                </label>

                <input
                    id="artifact-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {

                        setFile(
                            e.target.files[0] || null
                        );

                        setError("");
                        setMessage("");
                    }}
                />

                {file && (
                    <p className="selected-file">
                        Selected: {file.name}
                    </p>
                )}

                <label>
                    Artifact Type
                </label>

                <input
                    type="text"
                    placeholder="Example: Pottery"
                    value={artifactType}
                    onChange={(e) =>
                        setArtifactType(e.target.value)
                    }
                />

                <label>
                    Description
                </label>

                <textarea
                    placeholder="Enter artifact description"
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    rows="4"
                />

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="upload-error">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Uploading..."
                        : "Upload Artifact"}
                </button>

            </form>

        </div>
    );
}

export default UploadArtifact;