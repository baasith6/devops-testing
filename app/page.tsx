'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface LinkData {
  id: string;
  originalUrl: string;
  shortCode: string;
  alias?: string;
  createdAt: string;
  clicks: number;
  clickHistory: Array<{
    timestamp: string;
    ip?: string;
    userAgent?: string;
  }>;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadLinks();
    // Get base URL from environment or current origin
    setBaseUrl(typeof window !== 'undefined' ? window.location.origin : '');
  }, []);

  const loadLinks = async () => {
    try {
      const response = await fetch('/api/shorten');
      const data = await response.json();
      if (data.links) {
        setLinks(data.links);
      }
    } catch (err) {
      console.error('Failed to load links:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setCopied(false);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          alias: alias.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create short link');
        setLoading(false);
        return;
      }

      setShortUrl(data.shortUrl);
      setShortCode(data.shortCode);
      // Use the baseUrl from response, or fallback to current origin
      if (data.baseUrl) {
        setBaseUrl(data.baseUrl);
      } else if (typeof window !== 'undefined') {
        setBaseUrl(window.location.origin);
      }
      setUrl('');
      setAlias('');
      setSuccess(true);
      loadLinks();
      
      // Scroll to result
      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async (shortCode: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/${shortCode}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadLinks();
        if (selectedLink?.shortCode === shortCode) {
          setSelectedLink(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete link:', err);
    }
  };

  const getShortDisplayUrl = (code: string) => {
    if (!baseUrl) return `/${code}`;
    // Remove protocol and www for cleaner display
    const domain = baseUrl.replace(/^https?:\/\//, '').replace(/^www\./, '');
    return `${domain}/${code}`;
  };

  const getQrCodeUrl = (shortUrl: string) => {
    return `/api/qr?url=${encodeURIComponent(shortUrl)}`;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <h1 className="text-6xl font-extrabold gradient-text mb-3">
              LinkSnap
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-white/90 text-xl font-light max-w-2xl mx-auto">
            Professional URL shortener with custom aliases, QR codes, and real-time analytics
          </p>
        </div>

        {/* Main Form */}
        <div className="glass rounded-3xl shadow-2xl p-8 mb-6 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2.5">
                <span className="flex items-center gap-2">
                  <span>🔗</span> Enter URL to shorten
                </span>
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="alias" className="block text-sm font-semibold text-gray-700 mb-2.5">
                <span className="flex items-center gap-2">
                  <span>🏷️</span> Custom Alias <span className="text-gray-400 font-normal">(optional)</span>
                </span>
              </label>
              <input
                type="text"
                id="alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="my-custom-link"
                pattern="[a-zA-Z0-9_-]+"
                minLength={3}
                maxLength={20}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>💡</span> Letters, numbers, hyphens, and underscores only (3-20 characters)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center gap-2 animate-pulse">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Creating your link...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>✨</span>
                  Shorten URL
                </span>
              )}
            </button>
          </form>

          {/* Result */}
          {shortUrl && (
            <div id="result" className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 animate-fade-in">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">✅</span>
                <h3 className="text-xl font-bold text-gray-800">
                  Your shortened link is ready!
                </h3>
              </div>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={getShortDisplayUrl(shortCode)}
                      readOnly
                      className="w-full px-5 py-3 border-2 border-indigo-300 rounded-xl bg-white font-mono text-sm text-gray-800 pr-20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg font-semibold">
                        {shortCode}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(shortUrl)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>

                {/* Full URL (collapsible) */}
                <details className="bg-white/60 rounded-xl p-3">
                  <summary className="text-sm text-gray-600 cursor-pointer font-medium">
                    Show full URL
                  </summary>
                  <div className="mt-2 p-3 bg-white rounded-lg">
                    <p className="text-xs font-mono text-gray-600 break-all">{shortUrl}</p>
                  </div>
                </details>

                {/* QR Code */}
                <div className="flex flex-col items-center pt-5 border-t-2 border-indigo-200">
                  <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span>📱</span> QR Code
                  </p>
                  <div className="bg-white p-5 rounded-2xl shadow-lg border-2 border-indigo-100">
                    <QRCodeSVG
                      value={shortUrl}
                      size={220}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <a
                    href={getQrCodeUrl(shortUrl)}
                    download={`qrcode-${shortCode}.png`}
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-semibold underline flex items-center gap-1 transition"
                  >
                    <span>⬇️</span> Download QR Code
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Toggle */}
        {links.length > 0 && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="glass px-6 py-3 rounded-xl font-semibold text-indigo-700 hover:bg-white/80 transition-all transform hover:scale-105 shadow-lg"
            >
              {showDashboard ? '👆 Hide' : '👇 Show'} Dashboard ({links.length} {links.length === 1 ? 'link' : 'links'})
            </button>
          </div>
        )}

        {/* Dashboard */}
        {showDashboard && (
          <div className="glass rounded-3xl shadow-2xl p-8 border border-white/20 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <span>📊</span> Your Links
              </h2>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {links.length} total
              </span>
            </div>
            
            {links.length === 0 ? (
              <p className="text-gray-500 text-center py-12 text-lg">No links created yet</p>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:bg-gray-50 hover:border-indigo-300 transition-all cursor-pointer"
                    onClick={() => setSelectedLink(link)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <a
                            href={`/${link.shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-indigo-600 hover:text-indigo-700 font-bold text-lg"
                          >
                            /{link.shortCode}
                          </a>
                          {link.alias && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-semibold">
                              {link.alias}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-3" title={link.originalUrl}>
                          {link.originalUrl}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <span>👆</span> <strong className="text-indigo-600">{link.clicks}</strong> clicks
                          </span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <span>📅</span> {new Date(link.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLink(link);
                          }}
                          className="px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-semibold"
                        >
                          Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(link.shortCode);
                          }}
                          className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Link Details Modal */}
        {selectedLink && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setSelectedLink(null)}
          >
            <div 
              className="glass rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-3xl font-bold gradient-text">Link Details</h3>
                <button
                  onClick={() => setSelectedLink(null)}
                  className="text-gray-500 hover:text-gray-700 text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                >
                  ×
                </button>
              </div>

              <div className="space-y-5 mb-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Short URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={getShortDisplayUrl(selectedLink.shortCode)}
                      readOnly
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-mono text-sm bg-white"
                    />
                    <button
                      onClick={() => copyToClipboard(`${baseUrl}/${selectedLink.shortCode}`)}
                      className={`px-5 py-3 rounded-xl font-semibold transition ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {copied ? '✓' : '📋'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Original URL</label>
                  <p className="text-sm text-gray-600 break-all bg-gray-50 p-3 rounded-lg">{selectedLink.originalUrl}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Total Clicks</label>
                    <p className="text-3xl font-bold text-indigo-600">{selectedLink.clicks}</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Created</label>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedLink.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">QR Code</label>
                  <div className="bg-white p-5 rounded-2xl border-2 border-indigo-100 inline-block shadow-lg">
                    <QRCodeSVG
                      value={`${baseUrl}/${selectedLink.shortCode}`}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📈</span> Click History ({selectedLink.clickHistory.length})
                </h4>
                {selectedLink.clickHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-xl text-center">No clicks yet</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedLink.clickHistory
                      .slice()
                      .reverse()
                      .map((click, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-xl text-sm border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-gray-700 font-medium">
                                {new Date(click.timestamp).toLocaleString()}
                              </p>
                              {click.ip && click.ip !== 'unknown' && (
                                <p className="text-gray-500 text-xs mt-1">IP: {click.ip}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
