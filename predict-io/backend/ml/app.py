from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

import os

# Load model, scaler, and features
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, "laptop_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))
features = joblib.load(os.path.join(BASE_DIR, "features.pkl"))

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        
        # Prepare a dictionary for the input row
        # Initialize all features to 0
        input_row = {feat: 0 for feat in features}
        
        # Numeric values
        input_row["Inches"] = float(data.get("Inches", 15.6))
        input_row["Ram"] = int(data.get("Ram", 8))
        input_row["Weight"] = float(data.get("Weight", 2.0))
        input_row["CPU Frequency"] = float(data.get("CPU Frequency", 2.5))
        input_row["Memory Amount"] = float(data.get("Memory Amount", 256000))
        input_row["Screen Width"] = int(data.get("Screen Width", 1920))
        input_row["Screen Height"] = int(data.get("Screen Height", 1080))
        
        # Categorical values (One-Hot Encoding)
        # Company
        company = data.get("Company")
        if company in input_row:
            input_row[company] = 1
            
        # TypeName
        type_name = data.get("TypeName")
        if type_name in input_row:
            input_row[type_name] = 1
            
        # OpSys
        opsys = data.get("OpSys")
        if opsys in input_row:
            input_row[opsys] = 1
            
        # CPU Brand
        cpu_brand = data.get("CPU Brand")
        if cpu_brand:
            cpu_brand = str(cpu_brand) + "_CPU"
            if cpu_brand in input_row:
                input_row[cpu_brand] = 1
            
        # GPU Brand
        gpu_brand = data.get("GPU Brand")
        if gpu_brand:
            gpu_brand = str(gpu_brand) + "_GPU"
            if gpu_brand in input_row:
                input_row[gpu_brand] = 1
            
        # Remove target variable if it's in features (shouldn't be, but safe)
        if "Price_euros" in input_row:
            del input_row["Price_euros"]
            
        # Create DataFrame in the correct order
        # The training script used selected_features, which included Price_euros.
        # We need to make sure the order matches the scaler's expectations.
        # scaler was fit on X_train, which is limited_df.drop("Price_euros", axis=1)
        
        feature_list = [f for f in features if f != "Price_euros"]
        input_df = pd.DataFrame([input_row])[feature_list]
        
        # Scale input
        input_scaled = scaler.transform(input_df)
        
        # Predict
        prediction = model.predict(input_scaled)[0]
        
        return jsonify({"prediction": round(float(prediction), 2)})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/options", methods=["GET"])
def get_options():
    import json
    with open(os.path.join(BASE_DIR, "options.json"), "r") as f:
        options = json.load(f)
    return jsonify(options)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
