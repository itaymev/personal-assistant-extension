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

@app.route('/summarize', methods=['POST'])
def extract_article():
    print("Received a request to summarize.")
    url = request.json.get('url')
    print(f"URL received: {url}")
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    # Extract article content
    try:
        article = goose.extract(url=url)
        content = article.cleaned_text
        print(f"Extracted content: {content}")
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Summarize the content
    summary = summarizer(content, max_length=150, min_length=30, do_sample=False)
    return jsonify({'text': content, 'summary': summary[0]['summary_text']})


if __name__ == '__main__':
    app.run(port=5000)