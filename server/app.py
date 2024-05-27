from flask import Flask, request, jsonify
from flask_cors import CORS

from predictor import initialise, match

app = Flask(__name__)
CORS(app)

initialise()

@app.route('/predict', methods=['POST'])
def predict():
  data = request.json
  home = data.get('home')
  away = data.get('away')
  allow_draw = data.get('allow_draw', True)
  if not home or not away:
    return jsonify({"error": "Missing home or away team information"}), 400
  result = match(home, away, allow_draw)
  return jsonify(result)

if __name__ == '__main__':
  app.run(debug=True)