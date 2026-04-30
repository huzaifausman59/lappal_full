import json
import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / 'dataset2.csv'
MODEL_PATH = BASE_DIR / 'model.joblib'
FEATURE_COLUMNS_PATH = BASE_DIR / 'feature_columns.json'

DROP_COLUMNS = ["TypeName", "Inches", "ScreenResolution", "OpSys", "Weight", "laptop_ID"]
REQUIRED_FIELDS = [
    'Company',
    'Product',
    'Cpu',
    'Ram',
    'Memory',
    'Gpu',
    'Age_years',
    'Condition_10',
    'Battery_Health_%'
]


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


def preprocess_dataframe(df, feature_columns=None):
    df = df.copy()

    df['Memory'] = df['Memory'].apply(convert_memory)
    df['Ram'] = df['Ram'].astype(str).str.replace('GB', '', regex=False).astype(float)
    df = pd.get_dummies(df, columns=['Product', 'Company', 'Cpu', 'Gpu'])
    df.columns = df.columns.astype(str).str.replace(r"[\[\]<>]", "_", regex=True)

    if feature_columns is not None:
        df = df.reindex(columns=feature_columns, fill_value=0)

    return df


def train_model():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

    df = pd.read_csv(DATA_PATH, encoding='ISO-8859-1')
    
    df = df.drop(columns=DROP_COLUMNS, errors='ignore')
    df = df.dropna()

    X = df.drop(columns=['Price_euros'])
    y = df['Price_euros']

    X = preprocess_dataframe(X)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = XGBRegressor(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=5,          # limit tree depth
    min_child_weight=10,  # require more samples per leaf
    reg_lambda=10,        # stronger L2 penalty
    reg_alpha=5,          # moderate L1 penalty
    subsample=0.8,        # sample rows
    colsample_bytree=0.8  # sample features
    )    
    model.fit(X_train, y_train)

    joblib.dump(model, MODEL_PATH)
    with open(FEATURE_COLUMNS_PATH, 'w', encoding='utf-8') as f:
        json.dump(X_train.columns.tolist(), f)

    return model, X_train.columns.tolist()


def load_saved_model():
    if not MODEL_PATH.exists() or not FEATURE_COLUMNS_PATH.exists():
        return None, None

    model = joblib.load(MODEL_PATH)
    with open(FEATURE_COLUMNS_PATH, 'r', encoding='utf-8') as f:
        feature_columns = json.load(f)

    return model, feature_columns


def predict_from_input(input_obj):
    if not isinstance(input_obj, dict):
        raise ValueError('Input must be a JSON object')

    missing_fields = [field for field in REQUIRED_FIELDS if field not in input_obj]
    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

    model, feature_columns = load_saved_model()
    if model is None:
        model, feature_columns = train_model()

    input_df = pd.DataFrame([input_obj])
    input_df = preprocess_dataframe(input_df, feature_columns=feature_columns)
    prediction = model.predict(input_df)[0]
    return float(prediction)


def main():
    if len(sys.argv) == 1:
        # Read from stdin
        try:
            input_data = sys.stdin.read().strip()
            if not input_data:
                print('ERROR: no input provided', file=sys.stderr)
                sys.exit(1)
            request_data = json.loads(input_data)
        except json.JSONDecodeError:
            print('ERROR: invalid JSON input', file=sys.stderr)
            sys.exit(1)
    elif sys.argv[1] == '--train':
        train_model()
        print('MODEL_TRAINED')
        return
    else:
        try:
            request_data = json.loads(sys.argv[1])
        except json.JSONDecodeError:
            print('ERROR: invalid JSON input', file=sys.stderr)
            sys.exit(1)

    try:
        result = predict_from_input(request_data)
        print(result)
    except Exception as error:
        print(f'ERROR: {error}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
