
// Function to handle dataset loading
function loadDataset() {
    const dataset = document.getElementById('dataset-dropdown').value;
    // Implement dataset loading logic here
    console.log(`Loading dataset: ${dataset}`);
}

// Function to populate feature dropdowns
function populateFeatureDropdowns() {
    const features = [
        'Pixel Intensity',
        'Aspect Ratio',
        'Perimeter',
        'Solidity',
        'Convexity',
        "Euler's Number"
    ];

    const feature1Dropdown = document.getElementById('feature1-dropdown');
    const feature2Dropdown = document.getElementById('feature2-dropdown');

    features.forEach(feature => {
        const option1 = document.createElement('option');
        option1.value = feature;
        option1.textContent = feature;
        feature1Dropdown.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = feature;
        option2.textContent = feature;
        feature2Dropdown.appendChild(option2);
    });
}


window.onload = function () {
    initializePlot();
    populateFeatureDropdowns();
};

// Hides all other dropdown-content other than the one with dropdownId
function toggleDropdown(dropdownId) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].id !== dropdownId) {
            dropdowns[i].classList.remove("show");
        }
    }
    var currentDropdown = document.getElementById(dropdownId);
    currentDropdown.classList.toggle("show");
}

window.onclick = function (event) {
    // If click is outside any dropdown-content, any dropdown-content showing should be hidden
    if (!event.target.matches('.dropdown-button') && !event.target.matches('.dropdown-content')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) {
                dropdowns[i].classList.remove('show');
            }
        }
    }
}
