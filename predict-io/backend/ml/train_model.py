import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

def train():
    df = pd.read_csv("laptop_price.csv", encoding="latin-1")
    df = df.drop("Product", axis=1)
    
    # One-hot encoding Company
    df = df.join(pd.get_dummies(df.Company))
    df = df.drop("Company", axis=1)
    
    # One-hot encoding TypeName
    df = df.join(pd.get_dummies(df.TypeName))
    df = df.drop("TypeName", axis=1)
    
    # Screen Resolution
    df["ScreenResolution"] = df.ScreenResolution.str.split(" ").apply(lambda x: x[-1])
    df["Screen Width"] = df.ScreenResolution.str.split("x").apply(lambda x: x[0]).astype(int)
    df["Screen Height"] = df.ScreenResolution.str.split("x").apply(lambda x: x[1]).astype(int)
    df = df.drop("ScreenResolution", axis=1)
    
    # CPU
    df["CPU Brand"] = df.Cpu.str.split(" ").apply(lambda x: x[0])
    df["CPU Frequency"] = df.Cpu.str.split(" ").apply(lambda x: x[-1]).str[:-3].astype(float)
    df = df.drop("Cpu", axis=1)
    
    # RAM
    df["Ram"] = df["Ram"].str[:-2].astype(int)
    
    # Memory
    def turn_memory_into_MB(value):
        if "GB" in value:
            return float(value[:value.find("GB")]) * 1000
        elif "TB" in value:
            return float(value[:value.find("TB")]) * 1000000
        return 0

    df["Memory Amount"] = df.Memory.str.split(" ").apply(lambda x: x[0]).apply(turn_memory_into_MB)
    df = df.drop("Memory", axis=1)
    
    # Weight
    df["Weight"] = df["Weight"].str[:-2].astype(float)
    
    # GPU
    df["GPU Brand"] = df.Gpu.str.split(" ").apply(lambda x: x[0])
    df = df.drop("Gpu", axis=1)
    
    # OpSys
    df = df.join(pd.get_dummies(df.OpSys))
    df = df.drop("OpSys", axis=1)
    
    # CPU Brand encoding
    cpu_categories = pd.get_dummies(df["CPU Brand"])
    cpu_categories.columns = [col + "_CPU" for col in cpu_categories.columns]
    df = df.join(cpu_categories)
    df = df.drop("CPU Brand", axis=1)
    
    # GPU Brand encoding
    gpu_categories = pd.get_dummies(df["GPU Brand"])
    gpu_categories.columns = [col + "_GPU" for col in gpu_categories.columns]
    df = df.join(gpu_categories)
    df = df.drop("GPU Brand", axis=1)
    
    # Correlation and feature selection
    # Need to handle potential non-numeric columns if any left (though shouldn't be)
    numeric_df = df.select_dtypes(include=[np.number, bool])
    target_correlations = numeric_df.corr()['Price_euros'].apply(abs).sort_values()
    selected_features = target_correlations[-21:].index.tolist()
    
    print(f"Selected features: {selected_features}")
    
    limited_df = df[selected_features]
    X, y = limited_df.drop("Price_euros", axis=1), limited_df["Price_euros"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Save model and scaler
    joblib.dump(model, "laptop_model.pkl")
    joblib.dump(scaler, "scaler.pkl")
    joblib.dump(selected_features, "features.pkl")
    
    print("Model trained and saved.")

if __name__ == "__main__":
    train()
