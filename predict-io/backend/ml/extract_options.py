import pandas as pd
import json

def extract_options():
    df = pd.read_csv("laptop_price.csv", encoding="latin-1")
    options = {
        "Company": sorted(df["Company"].unique().tolist()),
        "TypeName": sorted(df["TypeName"].unique().tolist()),
        "OpSys": sorted(df["OpSys"].unique().tolist()),
        "CPU Brand": sorted(df["Cpu"].str.split(" ").apply(lambda x: x[0]).unique().tolist()),
        "GPU Brand": sorted(df["Gpu"].str.split(" ").apply(lambda x: x[0]).unique().tolist()),
    }
    with open("options.json", "w") as f:
        json.dump(options, f)
    print("Options extracted.")

if __name__ == "__main__":
    extract_options()
