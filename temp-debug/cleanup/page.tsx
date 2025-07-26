"use client";

import { useState } from "react";

export default function CleanupPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCleanup = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cleanup-duplicates", {
        method: "POST",
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to cleanup" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Database Cleanup</h1>

      <button
        onClick={handleCleanup}
        disabled={loading}
        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 mb-6"
      >
        {loading ? "Cleaning up..." : "Clean Up Duplicate Tools"}
      </button>

      {result && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Cleanup Results:</h2>

          {result.error ? (
            <div className="text-red-600">{result.error}</div>
          ) : (
            <div className="space-y-2">
              <div>
                <strong>Removed:</strong> {result.removedCount} duplicate tools
              </div>
              <div>
                <strong>Total tools before:</strong> {result.totalToolsBefore}
              </div>
              <div>
                <strong>Total tools after:</strong> {result.totalToolsAfter}
              </div>
              <div>
                <strong>AI Writing tools after:</strong>{" "}
                {result.writingToolsAfter}
              </div>

              {result.duplicates && result.duplicates.length > 0 && (
                <div>
                  <strong>Duplicates found:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    {result.duplicates.map((name: string, index: number) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.writingTools && result.writingTools.length > 0 && (
                <div>
                  <strong>AI Writing tools:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    {result.writingTools.map((name: string, index: number) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
