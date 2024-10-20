from flask import Flask, request, jsonify
from goose3 import Goose
from transformers import pipeline
import torch
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

goose = Goose()
device = 0 if torch.cuda.is_available() else -1
summarizer = pipeline("summarization", device=device)

def split_text(text, max_words):
    """Splits the text into chunks with a maximum number of words."""
    words = text.split()
    chunks = [' '.join(words[i:i+max_words]) for i in range(0, len(words), max_words)]
    return chunks

@app.route('/summarize', methods=['POST'])
def extract_article():
    print("Received a request to summarize.")
    url = request.json.get('url')
    length = request.json.get('length', 0)
    print(f"URL received: {url}")
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    # Extract article content
    try:
        article = goose.extract(url=url)
        content = article.cleaned_text
        print(f"Extracted content: {content}")

        # Define total token limits based on the `length` variable
        token_limits = {0: 100, 1: 200, 2: 500}
        max_total_tokens = token_limits.get(length, 100)
        
        # Split the content into smaller chunks
        words_per_chunk = 500  # Adjust based on your model's limits
        content_chunks = split_text(content, words_per_chunk)
        print(f"Number of chunks: {len(content_chunks)}")

        summaries = []
        total_tokens = 0

        for chunk in content_chunks:
            # Summarize each chunk
            summary = summarizer(chunk, max_length=100, do_sample=True)
            summary_text = summary[0]['summary_text']
            summary_tokens = len(summary_text.split())

            # Stop concatenating if we exceed the total token limit
            if total_tokens + summary_tokens > max_total_tokens:
                remaining_tokens = max_total_tokens - total_tokens
                # Truncate the last summary to fit the remaining token limit
                truncated_summary = ' '.join(summary_text.split()[:remaining_tokens])
                summaries.append(truncated_summary)
                break
            else:
                summaries.append(summary_text)
                total_tokens += summary_tokens

        # Concatenate the summaries from all chunks
        final_summary = ' '.join(summaries)
        return jsonify({'text': content, 'summary': final_summary})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
