let dataset = [];
let features = [];

let currentDataset = "L1";  // Default dataset

// Key value pair (dataset-name that links to [digit1, digit2])
const datasetMappings = {
    "L1": [0, 1],   // Pixel Intensity and Aspect Ratio
    "L2": [3, 8],   // Convexity and Euler's Number
    "L3": [5, 6],   // Solidity and Euler's Number
    "L4": [1, 3]    // Solidity and Convexity
};

let selectedFeature1 = '';
let selectedFeature2 = '';

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

function selectFeature(dropdownId, item) {
    if (dropdownId === 'dropdown1') {
        currentDataset = item;
    } else if (dropdownId === 'dropdown2') {
        selectedFeature1 = item;
    } else if (dropdownId === 'dropdown3') {
        selectedFeature2 = item;
    }

    // Update button text
    if (dropdownId === 'dropdown1') {
        document.getElementById('dataset-button').textContent = item;
    } else if (dropdownId === 'dropdown2') {
        document.getElementById('feature1-button').textContent = item;
    } else if (dropdownId === 'dropdown3') {
        document.getElementById('feature2-button').textContent = item;
    }

    updatePlot();
}

async function init() {
    console.log("Initialization started");
    dataset = await fetchCSVData();
    console.log("Fetched Dataset:", dataset); // Log the parsed dataset
    if (dataset && dataset.length > 0) {
        features = Object.keys(dataset[0]).slice(2); // Extract feature names excluding Image and Class

        const datasetOptions = Object.keys(datasetMappings);
        selectedFeature1 = features[0];
        selectedFeature2 = features[1];

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

    const classFilter = datasetMappings[currentDataset];
    const filteredDataset = dataset.filter(d => classFilter.includes(parseInt(d.Class)));

    // Split the dataset into two based on the class
    const class0Data = filteredDataset.filter(d => parseInt(d.Class) === classFilter[0]);
    const class1Data = filteredDataset.filter(d => parseInt(d.Class) === classFilter[1]);

    const xValuesClass0 = class0Data.map(d => parseFloat(d[selectedFeature1]));
    const yValuesClass0 = class0Data.map(d => parseFloat(d[selectedFeature2]));

    const xValuesClass1 = class1Data.map(d => parseFloat(d[selectedFeature1]));
    const yValuesClass1 = class1Data.map(d => parseFloat(d[selectedFeature2]));

    const data = {
        datasets: [
            {
                label: 'Class ' + classFilter[0],
                data: xValuesClass0.map((x, i) => ({ x: x, y: yValuesClass0[i] })),
                backgroundColor: 'rgba(255, 0, 0, 1)' // Red for class 0
            },
            {
                label: 'Class ' + classFilter[1],
                data: xValuesClass1.map((x, i) => ({ x: x, y: yValuesClass1[i] })),
                backgroundColor: 'rgba(0, 0, 255, 1)' // Blue for class 1
            }
        ]
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
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true
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
