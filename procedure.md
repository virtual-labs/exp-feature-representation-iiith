# Configure Your Simulation
Choose Number of Neighbors (k)
- Use the slider labeled "Number of neighbors (k):"
- Valid range: 1 to 15
- The selected value is shown below the slider.

# Types of Points
- Well Separated: Two distinct clusters.
- Overlapping: Some overlap between classes.
- Concentric: Class 0 inside a ring of Class 1.

# Choose Feature Scaling
Choose one to simulate feature transformations:
- None: Raw features
- Standardization: Zero mean, unit variance
- Min-Max: Normalize between 0 and 1

# Generate Dataset
- Click "Generate Data"
- Points will be generated based on selected distribution and scaling.

  
# Classify a Single Point
- Click "Classify New Point"
- A random point is generated and classified
- You’ll see a triangle on the plot indicating the prediction
# Simulate Multiple Classifications
- Click "Simulate Multiple Tests"
- 100 random test points are generated and classified
- Displays:
    - Accuracy (%)
    - Number of correct predictions (e.g., 82/100)

