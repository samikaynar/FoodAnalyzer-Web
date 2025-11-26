from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/analyze', methods=['POST'])
def analyze_product():
    try:
        data = request.json
        product_name = data.get('productName', '').strip()
        
        if not product_name:
            return jsonify({'error': 'Please enter a product name'}), 400
        
        if len(product_name) < 2:
            return jsonify({'error': 'Please enter at least 2 characters'}), 400


        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  
            messages=[{
                "role": "user",
                "content": f"Analyze the health of {product_name}. Give:\n1) Health score 1-10\n2) Main health factors\n3) Benefits and risks\n4) Healthier alternatives if needed\n5) Simple recommendation\nKeep it brief and clear."
            }],
            max_tokens=500, 
            temperature=0.7
        )
        
        analysis = response.choices[0].message.content
        return jsonify({'analysis': analysis})
        
    except Exception as e:
        print(f"Error: {str(e)}") 
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)