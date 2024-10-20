import React, { useEffect, useState } from 'react';

type ArticleSummarizerProps = {
  backToHome: () => void;
}

const ArticleSummarizer = (props: ArticleSummarizerProps) => {
  const [url, setUrl] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCurrentTabUrl = async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
          setUrl(tabs[0].url || '');
        }
      } catch (error) {
        console.error("Error getting current tab UtRL:", error);
      }
    };

    getCurrentTabUrl();
  }, []);

  const summarizeArticle = async () => {
    try {
      setLoading(true);
      const summaryText = await summarizeWithLLM(url);
      setSummary(summaryText);
    } catch (error) {
      console.error("Error summarizing article:", error);
      setSummary("Failed to summarize the article.");
    } finally {
      setLoading(false);
    }
  };


  const summarizeWithLLM = async (url: string) => {
    const response = await fetch('http://127.0.0.1:5000/summarize', { // Adjust URL based on your backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to summarize text');
    }

    const data = await response.json();
    return data.summary; // This is correct based on your backend's response structure
  };


  return (
    <div>
      <h2>Article Summarizer</h2>
      <div className="slider-container">
        <div className="slider">
          <div className="block" data-index="0">Block 1</div>
          <div className="block" data-index="1">Block 2</div>
          <div className="block" data-index="2">Block 3</div>
        </div>
        <div className="active-block"></div>
      </div>
      <input
        type="text"
        value={url}
        readOnly
        placeholder="Current article URL"
      />
      <button onClick={summarizeArticle} disabled={loading || !url}>
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>
      {summary && (
        <div>
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}
      <button onClick={props.backToHome}>Back to Home</button>
    </div>
  );
};

export default ArticleSummarizer;
