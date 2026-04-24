import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
import joblib

# Load and preprocess your dataset (your original code)
df = pd.read_csv('dataset.csv', encoding='ISO-8859-1')
drop_cols = ["TypeName", "Inches", "ScreenResolution", "OpSys","Weight","laptop_ID"]
df_clean = df.drop(columns=drop_cols, errors="ignore")

def convert_memory(mem):
    mem = str(mem)
    parts = mem.split('+')
    total = 0
    for part in parts:
        part = part.strip()
        if 'TB' in part:
            num = float(part.split('TB')[0])
            total += int(num * 1000)
        elif 'GB' in part:
            num = float(part.split('GB')[0])
            total += int(num)
    return total

df_clean['Memory'] = df_clean['Memory'].apply(convert_memory)
df_clean['Ram'] = df_clean['Ram'].str.replace('GB', '').astype(int)

df_clean = pd.get_dummies(df_clean, columns=['Product','Company', 'Cpu', 'Gpu'])
df_clean = df_clean.dropna()

df_clean.columns = df_clean.columns.astype(str)
df_clean.columns = df_clean.columns.str.replace(r"[\[\]<>]", "_", regex=True)

# Prepare features and target
X = df_clean.drop(columns=['Price_euros'])
y = df_clean['Price_euros']

# Print feature columns (copy this list to model.py)
print("Feature columns:", list(X.columns))

# Split and train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
model.fit(X_train, y_train)

# Evaluate (optional)
from sklearn.metrics import mean_absolute_error, r2_score
y_pred = model.predict(X_test)
print(f"MAE: {mean_absolute_error(y_test, y_pred)}")
print(f"R2 Score: {r2_score(y_test, y_pred)}")

# Save the trained model
joblib.dump(model, 'xgb_model.pkl')
print("Model saved as xgb_model.pkl")