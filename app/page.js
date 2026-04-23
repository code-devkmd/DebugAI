"use client"

import React, { useState } from 'react';
import Header from "./components/Header"

// Custom Icons
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);

export default function Page() {
  const [errorLog, setErrorLog] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // The provided Groq API Key
  const analyzeError = async () => {
    if (!errorLog.trim()) {
      setApiError("Please paste an error log or code snippet.");
      return;
    }

    setLoading(true);
    setApiError('');
    setResult(null);


    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ errorLog, context })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch response from Groq API.");
      }

      const data = await response.json();

      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Invalid API response structure");
      }

      setResult(content);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown Renderer to highlight Code blocks and bold text cleanly
  const renderMarkdown = (text) => {
    if (!text) return null;

    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      // Code Blocks
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.replace(/```\w*\n?/, '').replace(/```$/, '');
        const language = part.match(/```(\w+)/)?.[1] || 'code';

        return (
          <div key={index} className="my-4 border border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-gray-400 text-xs px-4 py-1.5 flex justify-between items-center border-b border-gray-700 uppercase tracking-wider font-semibold">
              <span>{language}</span>
              <CodeIcon />
            </div>
            <pre className="bg-[#0d1117] text-gray-100 p-4 overflow-x-auto text-sm font-mono leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Text with bold formatting
      const textSegments = part.split(/(\*\*[\s\S]*?\*\*)/g);
      return (
        <div key={index} className="whitespace-pre-wrap text-gray-300 leading-relaxed text-[15px] mb-3 font-sans">
          {textSegments.map((segment, i) => {
            if (segment.startsWith('**') && segment.endsWith('**')) {
              return <strong key={i} className="text-white font-semibold">{segment.slice(2, -2)}</strong>;
            }
            // Handle inline code `code`
            const inlineCodeSegments = segment.split(/(`[^`]+`)/g);
            return inlineCodeSegments.map((inlineSegment, j) => {
              if (inlineSegment.startsWith('`') && inlineSegment.endsWith('`')) {
                return <code key={j} className="bg-gray-800 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-700">{inlineSegment.slice(1, -1)}</code>;
              }
              return inlineSegment;
            });
          })}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Input Section */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-5 shadow-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language / Framework Context <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., React, Python, Node.js, Express..."
                className="w-full bg-[#0a0a0a] border border-gray-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder-gray-600"
              />

              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Error Log or Buggy Code <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={errorLog}
                  onChange={(e) => setErrorLog(e.target.value)}
                  placeholder="Paste your stack trace, terminal error, or code here..."
                  className="w-full h-64 bg-[#0a0a0a] border border-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-mono placeholder-gray-600 resize-none"
                />
              </div>

              {apiError && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-start gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p>{apiError}</p>
                </div>
              )}

              <button
                onClick={analyzeError}
                disabled={loading}
                className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
              >
                {loading ? (
                  <>
                    <LoaderIcon />
                    Analyzing Root Cause...
                  </>
                ) : (
                  <>
                    <SendIcon />
                    Analyze Error
                  </>
                )}
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex gap-3 text-sm text-gray-400">
              <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p>Powered by Groq&apos;strafast inference. The AI is instructed to skip pleasantries and provide exactly what is causing the crash and how to fix it.</p>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7">
            <div className="bg-[#111111] border border-gray-800 rounded-2xl h-full shadow-lg overflow-hidden flex flex-col">
              <div className="bg-gray-800/50 border-b border-gray-800 px-5 py-3.5 flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-200 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Analysis & Solution
                </h2>
                {result && (
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">
                    llama-3.1-8b
                  </span>
                )}
              </div>

              <div className="p-6 overflow-y-auto max-h-[800px] flex-1">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 py-20">
                    <LoaderIcon />
                    <p className="text-sm animate-pulse">Decompiling stack trace and consulting the AI...</p>
                  </div>
                ) : result ? (
                  <div className="prose-invert max-w-none">
                    {renderMarkdown(result)}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-3 py-20 text-center px-4">
                    <svg className="w-12 h-12 text-gray-800 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <p className="text-lg font-medium text-gray-400">Awaiting input</p>
                    <p className="text-sm max-w-sm">Paste your errors on the left to get instant architectural analysis and code fixes.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}