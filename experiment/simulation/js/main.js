let dataset = [];
let features = [];

// Key value pair (dataset-name that links to [digit1, digit2])
let selectedDataset = {};

let selectedFeature1 = '';
let selectedFeature2 = '';

// Pixel Intensity and Aspect Ratio
selectedDataset["L1"] = [0, 1]
// Convexity and Euler's Number
selectedDataset["L2"] = [3, 8]
// Solidity and Euler's Number
selectedDataset["L3"] = [5, 6]
// Solidity and Convexity
selectedDataset["L4"] = [1, 3]

// Function to parse CSV data
function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
        }
        result.push(obj);
    }
    return result;
}

// Function to fetch and process CSV data
async function fetchCSVData() {
    try {
        const response = await fetch('../images/features.csv'); // Path relative to index.html
        console.log("Fetching CSV from: ../images/features.csv");
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const csvData = await response.text();
        console.log("CSV Data fetched successfully");
        return parseCSV(csvData);
    } catch (error) {
        console.error('Error fetching CSV data:', error);
    }
}

// Populate dropdown menus
function populateDropdown(dropdownId, features) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = ''; // Clear any existing options
    features.forEach(feature => {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = feature;
        a.onclick = () => selectFeature(dropdownId, feature);
        dropdown.appendChild(a);
    });
}

function selectFeature(dropdownId, feature) {
    if (dropdownId === 'dropdown1') {
        selectedDataset = feature;
    } else if (dropdownId === 'dropdown2') {
        selectedFeature1 = feature;
    } else if (dropdownId === 'dropdown3') {
        selectedFeature2 = feature;
    }

    // Update button text
    if (dropdownId === 'dropdown1') {
        document.getElementById('dataset-button').textContent = feature;
    } else if (dropdownId === 'dropdown2') {
        document.getElementById('feature1-button').textContent = feature;
    } else if (dropdownId === 'dropdown3') {
        document.getElementById('feature2-button').textContent = feature;
    }

    if (selectedDataset && selectedFeature1 && selectedFeature2) {
        updatePlot();
    }
}

async function init() {
    console.log("Initialization started");
    dataset = await fetchCSVData();
    console.log("Fetched Dataset:", dataset); // Log the parsed dataset
    if (dataset && dataset.length > 0) {
        features = Object.keys(dataset[0]).slice(2); // Extract feature names excluding Image and Class

        selectedFeature1 = features[0];
        selectedFeature2 = features[1];
        datasetOptions = ["L1", "L2", "L3", "L4"]

        // Set default button texts
        document.getElementById('dataset-button').textContent = datasetOptions[0];
        document.getElementById('feature1-button').textContent = selectedFeature1;
        document.getElementById('feature2-button').textContent = selectedFeature2;

        populateDropdown('dropdown1', datasetOptions)
        populateDropdown('dropdown2', features);
        populateDropdown('dropdown3', features);

        console.log("Initialization completed, dataset:", dataset);

        updatePlot(); // Initial plot
    } else {
        console.error('No data available in dataset');
    }
}

function updatePlot() {
    if (!selectedFeature1 || !selectedFeature2) {
        console.error('Features not selected');
        return;
    }

    const xValues = dataset.map(d => parseFloat(d[selectedFeature1]));
    const yValues = dataset.map(d => parseFloat(d[selectedFeature2]));

    const data = {
        datasets: [{
            label: 'Scatter Dataset',
            data: xValues.map((x, i) => ({ x: x, y: yValues[i] })),
            backgroundColor: 'rgba(75, 192, 192, 1)'
        }]
    };

    const config = {
        type: 'scatter',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: selectedFeature1
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: selectedFeature2
                    }
                }
            }
        }
    };

    // Clear the previous chart if it exists
    const ctx = document.getElementById('plot').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, config);
}

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

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
