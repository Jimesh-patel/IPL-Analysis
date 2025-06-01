import joblib
from tensorflow.keras.models import load_model
import numpy as np
import pandas as pd


model = load_model('./ML/model/lstm_model.keras')
seq_scaler = joblib.load('./ML/model/seq_scaler.joblib')
meta_transformer = joblib.load('./ML/model/meta_transformer.joblib')

def predict_next_over_runs(last_overs_data, metadata):
    seq_features = np.zeros((1, 5, 2))
    for i, over_data in enumerate(last_overs_data[-5:]):
        if i < 5:
            seq_features[0, i] = [
                over_data['total_runs'],
                over_data['wickets'],
            ]
    seq_features_scaled = seq_scaler.transform(seq_features.reshape(-1, 2))
    seq_features_scaled = seq_features_scaled.reshape(1, 5, 2)
    meta_df = pd.DataFrame([metadata])
    meta_encoded = meta_transformer.transform(meta_df)
    prediction = model.predict([seq_features_scaled, meta_encoded], verbose=0)
    return max(0, float(prediction[0][0]))
