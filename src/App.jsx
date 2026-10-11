import { useState } from "react";

import Dashboard from "./components/Dashboard";
import UploadArtifact from "./components/UploadArtifact";

import "./App.css";

function App() {

    const [page, setPage] = useState("dashboard");
    const [refresh, setRefresh] = useState(0);

    const handleUploadSuccess = () => {

        setRefresh(refresh + 1);
        setPage("dashboard");
    };

    return (
        <div>

            <nav className="navbar">

                <div className="logo">
                    AI Archaeologist
                </div>

                <div className="nav-buttons">

                    <button
                        onClick={() =>
                            setPage("dashboard")
                        }
                        className={
                            page === "dashboard"
                                ? "active-nav"
                                : ""
                        }
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() =>
                            setPage("upload")
                        }
                        className={
                            page === "upload"
                                ? "active-nav"
                                : ""
                        }
                    >
                        Upload Artifact
                    </button>

                </div>

            </nav>

            {page === "dashboard" && (
                <Dashboard key={refresh} />
            )}

            {page === "upload" && (
                <UploadArtifact
                    onUploadSuccess={
                        handleUploadSuccess
                    }
                />
            )}

        </div>
    );
}

export default App;