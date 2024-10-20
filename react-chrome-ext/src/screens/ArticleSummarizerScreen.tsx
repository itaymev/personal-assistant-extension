import React, { useEffect, useState } from 'react';

type ArticleSummarizerProps = {
  backToHome: () => void;
}

const ArticleSummarizer = (props: ArticleSummarizerProps) => {
  const [url, setUrl] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState(0);

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
        length: value,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to summarize text');
    }

    const data = await response.json();
    return data.summary; // This is correct based on your backend's response structure
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const getThresholdText = () => {
      switch (value) {
          case 0:
              return 'Low';
          case 1:
              return 'Medium';
          case 2:
              return 'High';
          default:
              return 'Low';
      }
  };  


  return (
    <div>
      <h2 className='text-center'>Article Summarizer</h2>
        <div className="flex flex-col items-center justify-center bg-gray-100 w-full space-between">
              <label htmlFor="threshold-slider" className="mb-2 text-lg font-semibold text-center">Select Threshold</label>
              <input
                  type="range"
                  id="threshold-slider"
                  min="0"
                  max="2"
                  step="1"
                  value={value}
                  onChange={handleSliderChange}
                  className="slider w-75 cursor-pointer"
              />
              <div className="flex justify-between items-center w-75 mt-4">
                  <span className="text-sm">Low</span>
                  <span className="text-sm">Medium</span>
                  <span className="text-sm">High</span>
              </div>
              <p className="mt-4 text-lg">Current Value: {getThresholdText()}</p>
      </div>
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
