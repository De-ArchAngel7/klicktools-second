"use client";

import { useState, useEffect } from "react";

export default function CheckLogosPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/check-logos");
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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Logo Check</h1>

      {data && (
        <div className="space-y-6">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Summary:</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Total Tools:</strong> {data.totalTools}
              </div>
              <div>
                <strong>Tools Without Logos:</strong> {data.toolsWithoutLogos}
              </div>
              <div>
                <strong>Featured Tools:</strong> {data.featuredTools}
              </div>
              <div>
                <strong>Featured Without Logos:</strong>{" "}
                {data.featuredWithoutLogos}
              </div>
            </div>
          </div>

          {data.featuredMissingLogos &&
            data.featuredMissingLogos.length > 0 && (
              <div className="bg-red-100 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-red-800">
                  Featured Tools Missing Logos:
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {data.featuredMissingLogos.map((tool: any, index: number) => (
                    <li key={index} className="text-red-700">
                      {tool.name} (Category: {tool.category})
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {data.missingLogos && data.missingLogos.length > 0 && (
            <div className="bg-yellow-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-yellow-800">
                All Tools Missing Logos:
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                {data.missingLogos.map((tool: any, index: number) => (
                  <li key={index} className="text-yellow-700">
                    {tool.name} (Category: {tool.category}){" "}
                    {tool.featured ? "(Featured)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.featuredMissingLogos &&
            data.featuredMissingLogos.length === 0 &&
            data.missingLogos &&
            data.missingLogos.length === 0 && (
              <div className="bg-green-100 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-green-800">
                  ✅ All Good!
                </h2>
                <p className="text-green-700">All tools have logos assigned.</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
