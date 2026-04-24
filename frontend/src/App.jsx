import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Share2, AlertCircle, CheckCircle2, Server, Key, List, Box, RefreshCw, Sun, Moon } from 'lucide-react';
import './index.css';

// Syntax highlighting helper for JSON
const SyntaxHighlightedJson = ({ data }) => {
  if (!data) return null;
  const jsonString = JSON.stringify(data, null, 2);
  
  // Very simple regex replacement for a clean dark professional json view
  const formattedHtml = jsonString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
          return `<span class="${cls}">${match.slice(0, -1)}</span>:`;
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="${cls}">${match}</span>`;
    });

  return (
    <pre className="data-view" dangerouslySetInnerHTML={{ __html: formattedHtml }} />
  );
};

function App() {
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [theme, setTheme] = useState('dark');

  // Load theme from system or toggle manually
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    let parsedData = [];
    try {
      if (inputVal.trim() === '') {
        throw new Error('Input cannot be empty');
      }
      
      const trimmedInput = inputVal.trim();
      if (trimmedInput.startsWith('[')) {
        parsedData = JSON.parse(trimmedInput);
      } else if (trimmedInput.startsWith('{')) {
        const obj = JSON.parse(trimmedInput);
        if (obj.data && Array.isArray(obj.data)) {
          parsedData = obj.data;
        } else {
          throw new Error('JSON object must contain a "data" array.');
        }
      } else {
        parsedData = trimmedInput.split(',').map(s => s.trim()).filter(s => s);
      }
    } catch (err) {
      setError('Invalid format. Please provide a JSON array (e.g., ["A->B"]) or a comma-separated list of nodes.');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/bfhl';
      const response = await axios.post(apiUrl, { data: parsedData });
      setResult(response.data);
    } catch (err) {
       setError(err.response?.data?.message || err.message || 'Unable to connect to the backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <nav className="top-nav">
        <div className="brand">
          <Share2 size={24} color="var(--brand-primary)" />
          <span className="brand-text">Grapher.io</span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>

      <main className="main-content">
        <div className="view-header">
          <h1>Graph Analysis Pipeline</h1>
          <p>Parse input data to classify Directed Acyclic Graphs, root topologies, and cyclical dependencies.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle className="icon" size={20} />
            <div>
              <strong>Validation Error</strong>
              <p style={{ marginTop: '0.25rem' }}>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card card-form">
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="edges" className="form-label">Data Input</label>
              <div className="form-hint">Submit an array of edge definitions using the &quot;U-&gt;V&quot; format. Elements must be single uppercase characters.</div>
              <textarea 
                id="edges"
                className="form-control"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder='Enter your graph here...'
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><RefreshCw className="spin" size={16} /> Processing Data...</>
              ) : (
                <><Server size={16} /> Compute Analysis</>
              )}
            </button>
          </div>
        </form>

        {result && (
          <div className="results-layout">
            
            {/* Primary Analysis Output */}
            <div className="card">
              <div className="card-header">
                <Box size={18} color="var(--text-secondary)" />
                Topology Output
              </div>
              <div className="card-body">
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Returns successfully mapped disjoint trees and cycle component boundaries.</p>
                <SyntaxHighlightedJson data={result.hierarchies} />
              </div>
            </div>

            {/* Side Analytics & Telemetry */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div className="card">
                <div className="card-header">
                  <List size={18} color="var(--text-secondary)" />
                  Analysis Summary
                </div>
                <div className="card-body">
                  <div className="stat-list">
                    <div className="stat-item">
                      <span className="stat-label"><CheckCircle2 size={16} color="var(--success-text)"/> Disjoint Trees</span>
                      <span className="stat-value">{result.summary?.total_trees}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label"><RefreshCw size={16} color="var(--error-text)"/> Cycles Detected</span>
                      <span className="stat-value">{result.summary?.total_cycles}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label"><Key size={16} color="var(--brand-primary)"/> Largest Root</span>
                      <span className="stat-value">{result.summary?.largest_tree_root || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warnings / Excluded data */}
              <div className="card">
                <div className="card-header">
                  <AlertCircle size={18} color="var(--text-secondary)" />
                  Execution Logs
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      Duplicate Edges
                      <span className={result.duplicate_edges?.length > 0 ? "badge badge-error" : "badge badge-success"}>
                        {result.duplicate_edges?.length} found
                      </span>
                    </h4>
                    {result.duplicate_edges?.length > 0 ? (
                      <ul className="log-list">
                        {result.duplicate_edges.map((edge, i) => <li key={i}>{edge}</li>)}
                      </ul>
                    ) : (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No duplicate pairs detected in data.</p>
                    )}
                  </div>
                  
                  <hr style={{ borderTop: '0', borderBottom: '1px solid var(--border-light)' }}/>

                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      Invalid Entries
                       <span className={result.invalid_entries?.length > 0 ? "badge badge-error" : "badge badge-success"}>
                        {result.invalid_entries?.length} found
                      </span>
                    </h4>
                    {result.invalid_entries?.length > 0 ? (
                      <ul className="log-list">
                        {result.invalid_entries.map((entry, i) => <li key={i}>{entry}</li>)}
                      </ul>
                    ) : (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>All payload entries met syntax checks.</p>
                    )}
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
