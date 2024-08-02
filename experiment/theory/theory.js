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
