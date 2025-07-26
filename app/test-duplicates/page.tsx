"use client";

import { useState, useEffect } from "react";

export default function TestDuplicates() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/debug-writing");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI Writing Tools Debug</h1>

      {data && (
        <div className="space-y-4">
          <div>
            <strong>Total AI Writing Tools:</strong> {data.totalWritingTools}
          </div>

          <div>
            <strong>Unique Names:</strong> {data.uniqueNames}
          </div>

          {data.duplicates && data.duplicates.length > 0 && (
            <div>
              <strong>Duplicates Found:</strong>
              <ul className="list-disc pl-5 mt-2">
                {data.duplicates.map((name: string, index: number) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <strong>All AI Writing Tools:</strong>
            <ul className="list-disc pl-5 mt-2">
              {data.allWritingTools?.map((tool: any) => (
                <li key={tool.id}>
                  {tool.name} (Category: {tool.category})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
