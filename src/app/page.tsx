"use client";

import { useState } from "react";

export default function Home() {
  const [pdfText, setPdfText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // PDF file validation
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file!..");
      return;
    }

    setLoading(true);
    setError("");
    setPdfText("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("An error occurred while processing the PDF");
      }

      const data = await response.json();
      setPdfText(data.text);
      setNumPages(data.numPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Next.js + Vercel demo for pdf-parse
        </h1>

        <div className="mb-8">
          <label
            htmlFor="pdf-upload"
            className="block mb-2 text-sm font-medium"
          >
            Select PDF File:
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            disabled={loading}
            className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:border-gray-600 p-2"
          />
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p className="mt-4">Processing PDF...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {pdfText && (
          <div className="mt-8">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">PDF Content:</h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {numPages} pages
              </span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {pdfText}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
