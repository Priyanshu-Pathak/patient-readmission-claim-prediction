import json
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, classification_report
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, mean_absolute_percentage_error
import numpy as np

def evaluate_model(y_true, y_pred, y_prob=None):
    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "macro_f1": float(f1_score(y_true, y_pred, average='macro')),
    }
    
    if y_prob is not None:
        metrics["roc_auc"] = float(roc_auc_score(y_true, y_prob))
        
    return metrics

def evaluate_regression_model(y_true, y_pred):
    metrics = {
        "mae": float(mean_absolute_error(y_true, y_pred)),
        "rmse": float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "r2": float(r2_score(y_true, y_pred)),
        "mape": float(mean_absolute_percentage_error(y_true, y_pred)),
    }
    return metrics

def save_metrics(y_true, y_pred, y_prob=None, prefix="readmission", is_regression=False):
    if is_regression:
        metrics = evaluate_regression_model(y_true, y_pred)
        with open(f"ml/reports/{prefix}_metrics.json", "w") as f:
            json.dump(metrics, f, indent=4)
        return metrics
        
    metrics = evaluate_model(y_true, y_pred, y_prob)
    
    with open(f"ml/reports/{prefix}_metrics.json", "w") as f:
        json.dump(metrics, f, indent=4)
        
    report = classification_report(y_true, y_pred, output_dict=True)
    with open(f"ml/reports/{prefix}_classification_report.json", "w") as f:
        json.dump(report, f, indent=4)
        
    cm = confusion_matrix(y_true, y_pred).tolist()
    with open(f"ml/reports/{prefix}_confusion_matrix.json", "w") as f:
        json.dump({"confusion_matrix": cm}, f, indent=4)
        
    return metrics
