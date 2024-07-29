
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

async function fetchCSVData() {
    try {
        const response = await fetch('../../images/features.csv'); // Ensure this path is correct
        console.log("Fetching CSV from: ../images/features.csv");
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const csvData = await response.text();
        console.log("CSV Data fetched successfully");
        console.log(csvData); // Log the raw CSV data
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

let dataset = [];
let features = [];
let selectedFeature1 = '';
let selectedFeature2 = '';

function selectFeature(dropdownId, feature) {
    const button = dropdownId === 'dropdown2' ? document.querySelector('.controls-tab.light-grey-1 .dropdown-button') : document.querySelector('.controls-tab.light-grey-2 .dropdown-button');
    button.textContent = feature;

    if (dropdownId === 'dropdown2') {
        selectedFeature1 = feature;
    } else {
        selectedFeature2 = feature;
    }

    if (selectedFeature1 && selectedFeature2) {
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

        populateDropdown('dropdown2', features);
        populateDropdown('dropdown3', features);

        // Display the parsed CSV data in the 'plot' div for debugging
        document.getElementById('plot').innerText = JSON.stringify(dataset, null, 2);

        console.log("Initialization completed, dataset:", dataset);

        updatePlot(); // Initial plot
    } else {
        console.error('No data available in dataset');
    }
}


function updatePlot() {
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

init();