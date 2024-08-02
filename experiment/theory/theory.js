document.addEventListener('DOMContentLoaded', function () {
    const appleImage = document.getElementById('apple-image');
    const rednessSlider = document.getElementById('redness-slider');
    const sizeSlider = document.getElementById('size-slider');
    const spotSlider = document.getElementById('spot-slider');
    const glossinessSlider = document.getElementById('glossiness-slider');

    // Store the current states of each feature
    let currentRedness = rednessSlider.value;
    let currentSize = sizeSlider.value;
    let currentSpotDensity = spotSlider.value;
    let currentGlossiness = glossinessSlider.value;

    rednessSlider.addEventListener('input', function () {
        currentRedness = rednessSlider.value;
        applyFilters();
    });

    sizeSlider.addEventListener('input', function () {
        currentSize = sizeSlider.value;
        applyFilters();
    });

    spotSlider.addEventListener('input', function () {
        currentSpotDensity = spotSlider.value;
        applyFilters();
    });

    glossinessSlider.addEventListener('input', function () {
        currentGlossiness = glossinessSlider.value;
        applyFilters();
    });

    function applyFilters() {
        updateRedness();
        updateSize();
        updateSpots();
        updateGlossiness();
    }

    function updateRedness() {
        const redness = currentRedness;

        // Define hue rotation for different colors
        const hueRedToMiddle = 60; // Hue rotation from red to middle color
        const hueMiddleToGreen = 30; // Additional hue rotation from middle color to green

        let hue, saturation, brightness;
        if (redness < 50) {
            // Transition from original red to middle yellowish-red
            hue = (redness / 50) * hueRedToMiddle;
            saturation = 100 + (redness / 50) * 30; // Increase saturation towards middle
            brightness = 100 - (redness / 50) * 10; // Decrease brightness towards middle
        } else {
            // Transition from middle yellowish-red to green
            hue = hueRedToMiddle + ((redness - 50) / 50) * hueMiddleToGreen;
            saturation = 130 - ((redness - 50) / 50) * 30; // Decrease saturation towards green
            brightness = 90 + ((redness - 50) / 50) * 20; // Increase brightness towards green
        }

        appleImage.style.filter = `hue-rotate(${hue}deg) saturate(${saturation}%) brightness(${brightness}%)`;
    }

    function updateSize() {
        const size = currentSize;
        appleImage.style.width = `${size}%`;
        appleImage.style.height = 'auto'; /* Maintain aspect ratio */
    }

    function updateSpots() {
        const spotDensity = currentSpotDensity;
        appleImage.style.filter += ` contrast(${100 + spotDensity / 2}%)`;
    }

    function updateGlossiness() {
        const glossiness = currentGlossiness;
        appleImage.style.filter += ` brightness(${100 + glossiness / 2}%)`;
    }

    // Initialize the apple image properties based on slider values
    applyFilters();
});

document.addEventListener('DOMContentLoaded', function () {
    const width = 600;
    const height = 400;
    const svg = d3.select('#scatterplot');
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const data = d3.range(50).map(() => ({
        x: Math.random() * plotWidth,
        y: Math.random() * plotHeight
    }));

    const xScale = d3.scaleLinear().domain([0, plotWidth]).range([0, plotWidth]);
    const yScale = d3.scaleLinear().domain([0, plotHeight]).range([plotHeight, 0]);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 5)
        .attr('fill', '#007bff');

    const lineGroup = g.append('g')
        .attr('class', 'lines');

    function updateLines(x, y) {
        const distances = data.map(d => ({
            ...d,
            distance: Math.sqrt((d.x - x) ** 2 + (d.y - y) ** 2)
        }));

        const nearestNeighbors = distances.sort((a, b) => a.distance - b.distance).slice(0, 5);

        const lines = lineGroup.selectAll('line')
            .data(nearestNeighbors, d => d.x + ',' + d.y);

        lines.enter()
            .append('line')
            .merge(lines)
            .attr('x1', xScale(x))
            .attr('y1', yScale(y))
            .attr('x2', d => xScale(d.x))
            .attr('y2', d => yScale(d.y))
            .attr('stroke', '#ff0000')
            .attr('stroke-width', 1);

        lines.exit().remove();
    }

    svg.on('mousemove', function (event) {
        const [mouseX, mouseY] = d3.pointer(event);
        const x = xScale.invert(mouseX - margin.left);
        const y = yScale.invert(mouseY - margin.top);
        updateLines(x, y);
    });
});
