<div id="feature-extraction" class="section">
    <p>Feature extraction allows one to convert a complex object in real world to a more tractable sequence of numbers; or a feature vector. The goal of feature extraction in the context of pattern classification is to capture those properties of a class that makes them different from other classes under consideration.</p>
</div>

<h2 id="types-of-feature-vectors" class="section-title">Types of Feature Vectors</h2>
<div class="section-content side-by-side">
    <div class="main-content large">
        <p>Depending on the nature of features that are extracted, the representation could be either <mark>Fixed Length</mark> or <mark>Variable Length</mark>. In a fixed length representation, every object of every class will be represented using a fixed set of numbers. For example, for classification of different fruits, each fruit can be represented using the vector: (diameter, redness, weight). However, in certain problems, it is more appropriate not to restrict the representation to be fixed length. For example, in the problem of speech recognition, the representation of a single word could vary in length depending on the speed at which the word is pronounced or the accent of pronunciation.</p>
        <p>Fixed length representations are more popular due to the ease of comparing different samples. Note that fixed length feature vectors could be thought of as points in a d-dimensional vector space, commonly referred to as a feature space. We will concentrate on fixed length representations in this experiment.</p>
    </div>
    <div class="visual-content small">
        <div id="apple">
            <img src="images/apple.png" alt="Apple" id="apple-image">
        </div>
        <div class="sliders">
            <div class="slider-control">
                <label for="redness-slider">Redness</label>
                <input type="range" id="redness-slider" class="slider" min="0" max="100" value="50">
            </div>
            <div class="slider-control">
                <label for="size-slider">Size</label>
                <input type="range" id="size-slider" class="slider" min="50" max="100" value="75">
            </div>
            <div class="slider-control">
                <label for="spot-slider">Spot Density</label>
                <input type="range" id="spot-slider" class="slider" min="0" max="100" value="50">
            </div>
            <div class="slider-control">
                <label for="glossiness-slider">Glossiness</label>
                <input type="range" id="glossiness-slider" class="slider" min="0" max="100" value="50">
            </div>
        </div>
    </div>

</div>
<h2 id="nearest-neighbor-classifier" class="section-title">Nearest Neighbor Classifier</h2>
<div class="section-content side-by-side">
    <div class="main-content half">
        <p>The <mark>Euclidean distance</mark> between two points in the feature space can be thought of as a measure of dissimilarity between the samples. This fact is used for decision making in the popular <mark>Nearest Neighbor classifier</mark>. A set of labeled samples that are obtained during training is stored in the feature space as reference points. When a new sample whose class is unknown is obtained, we compare it with each of the reference points in the feature space. The closest reference point is the most similar, and hence its class label is assigned to the unknown sample. Even though the method is very simple, it is surprisingly effective if the feature representation is good. For this reason, the performance of the nearest neighbor classifier is often used to compare different feature representations. In this experiment, we will use the accuracy of a nearest neighbor classifier to compare the performances of different feature representations.</p>
        <p>A variant of the nearest neighbor algorithm is the <mark>k-nearest neighbor algorithm</mark>, where you find the class labels of the k nearest reference samples for a new test sample. The label of the test sample is decided as the majority label among the reference samples. One could also weight the labels according to their similarity (closer samples getting higher weight).</p>
    </div>
    <div id="scatter-content"> 
        <div class="visual-content" id="scatterplot-container">
            <svg id="scatterplot"></svg>
        </div>
        <div class="visual-content" id="controls-container">
            <h2>K-Nearest Neighbors</h2>
                <div>
                    <label for="num-neighbors">Number of neighbors:</label>
                    <select id="num-neighbors">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <div>
                    <label>Class: </label>
                    <span id="majority-class"></span>
                </div>
            </div>
    </div>
    <script src="https://d3js.org/d3.v6.min.js"></script>
</div>

<h2 id="other-factors" class="section-title">Other factors affecting the representation</h2>
<div class="section-content">
    <p><strong>Nature of Features:</strong> Another factor that affects the distribution of samples in the feature space is the nature of the features extracted. Some of the features could be binary valued, others discrete, while some others could be continuous valued.</p>
    <p><strong>Scale of Features:</strong> If we have two features, one varying in the range [0,1]$, while the second varies in [0,100], then any difference in the second will dominate the distance computation between two samples. This effectively makes the first feature redundant. It is important to make sure that the features are computed in similar scales (of numbers) for the representation to be effective.</p>
</div>
