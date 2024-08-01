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

const featureDescriptions = {
    'Pixel Intensity': '<ul><li>Total number of pixels that are part of the digit.</li><li>Greater pixel intensity means a more filled-in or bolder shape.</li></ul>',
    'Aspect Ratio': '<ul><li>Ratio of the width to the height of the digit.</li><li>Greater aspect ratio means a wider shape.</li></ul>',
    'Perimeter': '<ul><li>Total length around the edge of the digit.</li><li>Greater perimeter means a more complex or curved shape.</li></ul>',
    'Solidity': '<ul><li>Ratio of the area of the digit to the area of its convex hull.</li><li>Greater solidity means a more compact and solid shape.</li></ul>',
    'Convexity': '<ul><li>How "outward" or rounded the digit shape is.</li><li>Greater convexity means a more rounded and less indented shape.</li></ul>',
    'Euler\'s Number': '<ul><li>Topological property representing the number of objects in the digit image minus the number of holes.</li><li>Greater Euler\'s number means fewer holes in the shape.</li></ul>'
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
        // console.log("Fetching CSV from: ../images/features.csv");
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const csvData = await response.text();
        // console.log("CSV Data fetched successfully");
        return parseCSV(csvData);
    } catch (error) {
        // console.error('Error fetching CSV data:', error);
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

function populateTableHeaders(headers) {
    const headerRow = document.getElementById('table-headers');
    headerRow.innerHTML = ''; // Clear existing headers

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        // Set the title attribute for the tooltip
        if (featureDescriptions[header]) {
            th.setAttribute('data-description', featureDescriptions[header]);
            th.addEventListener('mouseover', showTooltip);
            th.addEventListener('mouseout', hideTooltip);
            th.addEventListener('mousemove', moveTooltip);
        }
        headerRow.appendChild(th);
    });
}

function showTooltip(event) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = event.target.getAttribute('data-description'); // Use innerHTML to interpret HTML tags
    tooltip.style.display = 'block';
    moveTooltip(event);
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}

function moveTooltip(event) {
    const tooltip = document.getElementById('tooltip');
    const xOffset = 10; // Offset from the mouse pointer
    const yOffset = 20; // Offset from the mouse pointer

    // Calculate position
    let left = event.pageX + xOffset;
    let top = event.pageY + yOffset;

    // Adjust if tooltip goes beyond right edge of viewport
    if ((left + tooltip.offsetWidth) > window.innerWidth) {
        left = event.pageX - xOffset - tooltip.offsetWidth;
    }
    // Adjust if tooltip goes beyond bottom edge of viewport
    if ((top + tooltip.offsetHeight) > window.innerHeight) {
        top = event.pageY - yOffset - tooltip.offsetHeight;
    }
    // Adjust if tooltip goes beyond left edge of viewport
    if (left < 0) {
        left = xOffset;
    }
    // Adjust if tooltip goes beyond top edge of viewport
    if (top < 0) {
        top = yOffset;
    }
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

function populateTableRows(data) {
    const tableBody = document.getElementById('data-table').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach(row => {
        const tr = document.createElement('tr');
        for (const key in row) {
            const td = document.createElement('td');
            let value = row[key];
            if (key === 'Image') {
                const img = document.createElement('img');
                const className = row['Class'];
                img.src = `../images/selected_images/${className}/${value}`;
                img.alt = value;
                td.appendChild(img);
                img.className = 'img';
                img.addEventListener('click', function () {
                    if (this.classList.contains('large')) {
                        // If the clicked image is already large, remove the 'large' class
                        this.classList.remove('large');
                    } else {
                        // Ensure only one img is 'large' class at a time
                        const allImages = document.querySelectorAll('.img.large');
                        allImages.forEach(image => {
                            image.classList.remove('large');
                        });
                        this.classList.add('large');
                    }
                });
            } else {
                if (!isNaN(value) && parseFloat(value) == value) {
                    // Round to three decimal places if necessary, but avoid trailing zeros
                    value = roundDecimal(value)
                }
                td.textContent = value;
            }
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
    });
}


function updateTable() {
    const classFilter = datasetMappings[currentDataset];
    const filteredDataset = dataset.filter(d => classFilter.includes(parseInt(d.Class)));
    const headers = Object.keys(filteredDataset[0]);

    populateTableHeaders(headers);
    populateTableRows(filteredDataset);
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
    updateTable();
}

async function init() {
    console.log("Initialization started");
    dataset = await fetchCSVData();
    console.log("Fetched Dataset:", dataset); // Log the parsed dataset
    if (dataset && dataset.length > 0) {
        const headers = Object.keys(dataset[0]); // Get all headers including Image, ImageID, Class, and features
        features = headers.slice(3); // Extract feature names excluding Image, ImageID, and Class

        const datasetOptions = Object.keys(datasetMappings);
        selectedFeature1 = features[0];
        selectedFeature2 = features[1];

        // Set default button texts
        document.getElementById('dataset-button').innerHTML = datasetOptions[0] + '<span class="arrow">&#9662;</span>';
        document.getElementById('feature1-button').innerHTML = selectedFeature1 + '<span class="arrow">&#9662;</span>';
        document.getElementById('feature2-button').innerHTML = selectedFeature2 + '<span class="arrow">&#9662;</span>';

        populateDropdown('dropdown1', datasetOptions);
        populateDropdown('dropdown2', features);
        populateDropdown('dropdown3', features);

        // console.log("Initialization completed, dataset:", dataset);

        updatePlot(); // Initial plot
        updateTable(); // Initial Table
    } else {
        console.error('No data available in dataset');
    }
}

function updatePlot() {
    if (!selectedFeature1 || !selectedFeature2) {
        console.error('Features not selected');
        return;
    }

    // Calculate the ranges for x and y based on the entire dataset
    const allXValues = dataset.map(d => parseFloat(d[selectedFeature1]));
    const allYValues = dataset.map(d => parseFloat(d[selectedFeature2]));

    // Filter out NaN values before calculating min and max
    const validXValues = allXValues.filter(v => !isNaN(v));
    const validYValues = allYValues.filter(v => !isNaN(v));

    const xMin = Math.min(...validXValues);
    const xMax = Math.max(...validXValues);
    const yMin = Math.min(...validYValues);
    const yMax = Math.max(...validYValues);

    // Add padding to ensure dots are not cut off at the edges
    const padding = 0.05; // 5% padding
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    // Determine the min and max values with padding, adjusted to the nearest increment
    const increment = 0.05;

    const xMinAdjusted = Math.floor((xMin - xRange * padding) / increment) * increment;
    const xMaxAdjusted = Math.ceil((xMax + xRange * padding) / increment) * increment;
    const yMinAdjusted = Math.floor((yMin - yRange * padding) / increment) * increment;
    const yMaxAdjusted = Math.ceil((yMax + yRange * padding) / increment) * increment;

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
                data: xValuesClass0.map((x, i) => ({
                    x: x,
                    y: yValuesClass0[i],
                    img: `../images/selected_images/${classFilter[0]}/${class0Data[i].Image}`
                })),
                backgroundColor: 'rgba(255, 0, 0, 1)', // Red for class 0
                pointHoverRadius: 6
            },
            {
                label: 'Class ' + classFilter[1],
                data: xValuesClass1.map((x, i) => ({
                    x: x,
                    y: yValuesClass1[i],
                    img: `../images/selected_images/${classFilter[1]}/${class1Data[i].Image}`
                })),
                backgroundColor: 'rgba(0, 0, 255, 1)', // Blue for class 1
                pointHoverRadius: 6
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
                    },
                    min: xMinAdjusted,
                    max: xMaxAdjusted
                },
                y: {
                    title: {
                        display: true,
                        text: selectedFeature2
                    },
                    min: yMinAdjusted,
                    max: yMaxAdjusted
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        usePointStyle: true
                    }
                },
                tooltip: {
                    usePointStyle: true,
                    enabled: true,
                    mode: 'nearest', // Show the nearest point
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label + ': (' + roundDecimal(context.raw.x) + ', ' + roundDecimal(context.raw.y) + ')';
                            return label;
                        },
                        labelPointStyle: (context) => {
                            const imgSrc = context.raw.img;
                            const image = new Image();
                            image.src = imgSrc;
                            return {
                                pointStyle: image
                            };
                        }
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

function roundDecimal(value) {
    value = parseFloat(value).toFixed(3).replace(/\.?0+$/, '');
    return value
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
