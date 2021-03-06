Feature extraction allows one to convert a complex object in real world to a more tractable sequence of numbers; or a feature vector. The goal of feature extraction in the context of pattern classification is to capture those properties of a class that makes them different from other classes under consideration.

**Types of Feature Vectors**

Depending on the nature of features that are extracted, the representation could be either Fixed Length or Variable Length. In a fixed length representation, every object of every class will be represented using a fixed set of numbers. For example, for classification of different fruits, each fruit can be represented using the vector: (diameter,redness,weight). However, in certain problems, it is more appropriate not to restrict the representation to be fixed length. For example, in the problem of speech recognition, the representation of a single word could vary in length depending on the speed at which the word is pronounced or the accent of pronounciation.

Fixed length representations are more popular due to the ease of comparing different samples. Note that fixed length feature vectors could be thought of as points in a d-dimensional vector space, commonly referred to as a feature space. We will concentrate on fixed length representations in this experiment.

**Nearest Neighbor Classifier**

The Euclidean distance between two points in the feature space can be thought of as a measure of dissimilarity between the samples. This fact is used for decision making in the popular Nearest Neighbor classifier. A set of labeled samples that are obtained during training is stored in the feature space as reference points. When a new sample whose class is unknown is obtained, we compare it with each of the reference points in the feature space. The closest reference point is the most similar, and hence its class label is assigned to the unknown sample. Even though the method is very simple, it is surprisingly effective if the feature representation is good. For this reason, the performance nearest neighbor classifier is often used to compare different feature representations. In this experiment, we will use the accuracy of a nearest neighbor classifier to compare the performances of different feature representations.

A variant of the nearest neighbor algorithm is the k-nearest neighbor algorithm, where you find the class labels of the k nearest reference samples for a new test sample. The label of the test sample is decided as the majority label among the reference samples. One could also weight the labels according to their similarity (closer samples getting higher weight).

**Other factors affecting the representation**

**Nature of Features:** Another factor that affects the distribution of samples in the feature space is the nature of the features extracted. Some of the features could be binary valued, others discrete, while some others could be continuous valued.

**Scale of Features:** If we have two features, one varying in the range [0,1]$, while the second varies in [0,100], then any difference in the second will dominate the distance computation between two samples. This effectively makes the first feature, redundant. It is important to make sure that the features are computed in similar scales (of numbers) for the representation to be effective.
