import React, { useState, useRef } from 'react';

export default function WhatIfMachine() {
  const [whatIf, setWhatIf] = useState('');
  const [currentLife, setCurrentLife] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState<any>(null);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const generateStory = async () => {
    setError('');
    setStory(null);
    setVisible(false);

    if (!whatIf.trim()) {
      setError("Could you add a short 'What if…' prompt?");
      return;
    }

    setFlipped(true);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatIf: whatIf.trim(), currentLife: currentLife.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Hmm — I couldn't open that page just now. Try again in a moment.");
        setTimeout(() => setFlipped(false), 600);
        return;
      }

      if (!data?.story) {
        setError("Hmm — the story didn't come through clearly. Try a slightly different prompt.");
        setTimeout(() => setFlipped(false), 600);
        return;
      }

      setStory(data.story);
      setTimeout(() => setVisible(true), 120);
      setTimeout(() => {
        if (storyRef.current) storyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      console.error(err);
      setError("I'm having trouble right now. Please try again shortly.");
      setTimeout(() => setFlipped(false), 600);
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setWhatIf('');
    setCurrentLife('');
    setStory(null);
    setError('');
    setVisible(false);
    setFlipped(false);
  };

  // Generate spiral holes for the full height
  const holes = Array.from({ length: 18 });

  return (
    <div className="whatif-page">
      <main className="whatif-container">
        <h1 className="whatif-title">What If… <span className="title-emoji" aria-hidden="true">✨</span></h1>
        <p className="whatif-subtitle">Another version of your life, waiting to be read - plausible futures, softly lit.</p>

        {/* Book wrapper with spiral binding */}
        <div className="book-wrapper">
          {/* Spiral binding - full height with actual coils */}
          <div className="spiral-binding" aria-hidden="true">
          {holes.map((_, i) => (
              <div key={i} className="ring-hole" />
            ))}
          </div>

          {/* Page card with flip animation */}
          <div ref={containerRef} className={`page-card ${flipped ? 'flipped' : ''}`}>
            {/* Front face */}
            <div className="page-face page-front">
              <div className="input-group">
                <label className="input-label">What if… *</label>
                <input
                  type="text"
                  value={whatIf}
                  onChange={(e) => setWhatIf(e.target.value)}
                  placeholder="What if I'd studied art instead?"
                  className="whatif-input"
                />
              </div>

              <div className="input-group">
                <label className="soft-label">If you want, tell me a little about your current life</label>
                <textarea
                  value={currentLife}
                  onChange={(e) => setCurrentLife(e.target.value)}
                  placeholder="I'm currently working in tech, living in the city, always wondered about other paths..."
                  rows={4}
                  className="whatif-textarea"
                />
              </div>

              {error && <div className="soft-error">{error}</div>}

              <div className="button-group">
                <button className="whatif-btn primary" onClick={generateStory} disabled={isGenerating}>
                  {isGenerating ? 'Opening page…' : 'Open this page'}
                </button>
                <button className="whatif-btn secondary" onClick={reset} disabled={isGenerating}>
                  Clear
                </button>
              </div>
            </div>

            {/* Back face */}
            <div className="page-face page-back">
              {isGenerating && (
                <div className="loading-state">
                  <div className="spinner" />
                  <span>Turning the page…</span>
                </div>
              )}

              {!isGenerating && story && (
                <div ref={storyRef} className={`story-content ${visible ? 'fade-in' : ''}`}>
                  <article>
                    <h2 className="story-title">{story.title}</h2>
                    <p>{story.morning}</p>
                    <p>{story.midday}</p>
                    <p>{story.afternoon}</p>
                    <p>{story.evening}</p>

                    <h3 className="key-moments">Key moments</h3>
                    <ul>
                      {Array.isArray(story.keyMoments) && story.keyMoments.map((m: string, i: number) => <li key={i}>{m}</li>)}
                    </ul>

                    <p className="reflection">{story.reflection}</p>

                    <div className="button-group">
                      <button className="whatif-btn primary" onClick={() => { setFlipped(false); setVisible(false); }}>
                        Back to prompts
                      </button>
                      <button className="whatif-btn secondary" onClick={reset}>
                        Try another
                      </button>
                    </div>
                  </article>
                </div>
              )}

              {!isGenerating && !story && (
                <div className="empty-state">No story yet — try opening a page.</div>
              )}
            </div>
          </div>
        </div>

        <footer className="whatif-footer">Turn the page — read a day you almost lived.</footer>
      </main>
    </div>
  );
}
