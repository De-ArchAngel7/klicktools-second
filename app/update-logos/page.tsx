"use client";

import { useState } from "react";

export default function UpdateLogosPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateLogos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/update-logos", {
        method: "POST",
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to update logos" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Update Logo URLs</h1>

      <button
        onClick={handleUpdateLogos}
        disabled={loading}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 mb-6"
      >
        {loading ? "Updating..." : "Update Logo URLs"}
      </button>

      {result && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Update Results:</h2>

          {result.error ? (
            <div className="text-red-600">{result.error}</div>
          ) : (
            <div className="space-y-4">
              <div>
                <strong>Updated:</strong> {result.updatedCount} tools
              </div>
              <div>
                <strong>Featured tools:</strong> {result.featuredTools}
              </div>
              <div>
                <strong>Featured without logos:</strong>{" "}
                {result.featuredWithoutLogos}
              </div>

              {result.results && result.results.length > 0 && (
                <div>
                  <strong>Update details:</strong>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {result.results.map((msg: string, index: number) => (
                      <li
                        key={index}
                        className={
                          msg.includes("✅") ? "text-green-600" : "text-red-600"
                        }
                      >
                        {msg}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.featuredMissingLogos &&
                result.featuredMissingLogos.length > 0 && (
                  <div className="bg-red-100 p-4 rounded-lg">
                    <strong>Featured tools still missing logos:</strong>
                    <ul className="list-disc pl-5 mt-2">
                      {result.featuredMissingLogos.map(
                        (name: string, index: number) => (
                          <li key={index} className="text-red-700">
                            {name}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {result.featuredWithoutLogos === 0 && (
                <div className="bg-green-100 p-4 rounded-lg text-green-700">
                  ✅ All featured tools now have logos!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
