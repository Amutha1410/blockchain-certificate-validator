import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import joblib

# Sample certificate dataset
data = {
    "marks": [85, 90, 75, 60, 95, 40, 30, 25, 50, 35],
    "name_match": [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    "certificate_valid": [1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
}

# Convert data into a DataFrame
df = pd.DataFrame(data)

# Input features
X = df[["marks", "name_match"]]

# Output/target
y = df["certificate_valid"]

# Split data into training and testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create ML model
model = DecisionTreeClassifier(random_state=42)

# Train the model
model.fit(X_train, y_train)

# Test the model
predictions = model.predict(X_test)

# Check accuracy
accuracy = accuracy_score(y_test, predictions)

print("Model trained successfully!")
print("Accuracy:", accuracy)

# Save the trained model
joblib.dump(model, "certificate_model.pkl")

print("Model saved as certificate_model.pkl")