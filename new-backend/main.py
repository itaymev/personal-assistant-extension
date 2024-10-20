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
    length = request.json.get('length', 0)
    print(f"URL received: {url}")
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    # Extract article content
    try:
        article = goose.extract(url=url)

        print(f"Title: {article.title}")
        print(f"Meta Description: {article.meta_description}")
        print(f"Meta Keywords: {article.meta_keywords}")
        print(f"Publish Date: {article.publish_date}")
        print(f"Additional Date: {article.additional_data}")
        print(f"Doc: {article.doc}")
        print(f"Authors: {article.authors}")



        content = article.cleaned_text
        print(f"Extracted content: {content}")

        if article.meta_description and length == 0:
            return jsonify({'text': content, 'summary': article.meta_description})
    
        else:
            maxLength = 150 + 200 * length
            print(maxLength)
            summary = summarizer(content, max_length=150, min_length=30, do_sample=True)
            return jsonify({'text': content, 'summary': summary[0]['summary_text']})


    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
   

if __name__ == '__main__':
    app.run(port=5000)