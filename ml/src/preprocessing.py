import json
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

def get_preprocessor(numeric_features, categorical_features):
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    return preprocessor

def get_feature_schema(df, target_col='readmitted', exclude_cols=None):
    if exclude_cols is None:
        exclude_cols = []
        
    features = [col for col in df.columns if col not in [target_col, 'claim'] + exclude_cols]
    
    numeric_features = df[features].select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_features = df[features].select_dtypes(include=['object', 'category']).columns.tolist()
    
    return features, numeric_features, categorical_features

def save_feature_schema(features, numeric_features, categorical_features, file_path):
    schema = {
        "features": features,
        "numeric_features": numeric_features,
        "categorical_features": categorical_features
    }
    with open(file_path, 'w') as f:
        json.dump(schema, f, indent=4)
