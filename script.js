const targetDateInput = document.getElementById("target-date");
const formattedDateElement = document.getElementById("formatted-date");
const countdownElements = {
    years: document.getElementById("years"),
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
};
// Load saved date from localStorage if it exists and start countdown
const savedDate = localStorage.getItem("countdownDate");

if (savedDate) {
    targetDateInput.value = savedDate;
    const formattedDate = formatDate(new Date(savedDate));
    formattedDateElement.textContent = `Quedan para el ${formattedDate}:`;
    startCountdown(new Date(savedDate));
}

// Event listener to save the date and start countdown when the date changes
targetDateInput.addEventListener("change", () => {
    const selectedDate = targetDateInput.value;
    if (selectedDate) {
        localStorage.setItem("countdownDate", selectedDate);
        const selectedDateAsDate = new Date(selectedDate);
        selectedDateAsDate.setHours(14, 30, 0, 0);
        const formattedDate = formatDate(selectedDateAsDate);
        formattedDateElement.textContent = `Quedan para el ${formattedDate}:`;
        startCountdown(selectedDateAsDate);
    }
});

// Function to format the date as "DD-MM-YYYY"
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Function to start the countdown
function startCountdown(targetDate) {
    clearInterval(window.countdownInterval);
    window.countdownInterval = setInterval(() => {
        updateCountdown(targetDate);
    }, 1000);
    if (targetDate - new Date() >= 0) {
        loadImage();
    }
}

function loadImage() {
    const remadoresDiv = document.getElementById('remadores');
    remadoresDiv.style.display = "block";
    const imageContainer = document.getElementById('image-container');
    imageContainer.textContent = "Loading...";
    const xhr = new XMLHttpRequest();
    const imageUrl = 'remar.gif'; // Replace with your image URL

    xhr.open('GET', imageUrl, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
        if (xhr.status === 200) {
            const blob = xhr.response;
            const objectURL = URL.createObjectURL(blob);

            imageContainer.innerHTML = '';

            const img = document.createElement('img');
            img.src = objectURL;
            img.id = "myImage";
            img.width = 300;
            img.onload = function () {
                imageContainer.appendChild(img);
            }
            img.onerror = function () {
                imageContainer.textContent = "Error loading image";
            }
        } else {
            imageContainer.textContent = "Error loading image";
            console.error('Error loading image:', xhr.status);
        }
    };

    xhr.onerror = function () {
        imageContainer.textContent = "Error loading image";
        console.error('Network error while loading image.');
    };

    xhr.send();
}

function timeDifference(targetDate) {
    const now = new Date();
    const timeDifference = targetDate - now;
    return timeDifference;
}

// Function to update countdown elements
function updateCountdown(targetDate) {
    const now = new Date();
    const timeDifference = targetDate - now;

    if (timeDifference <= 0) {
        clearInterval(window.countdownInterval);
        countdownElements.years.textContent = "00";
        countdownElements.days.textContent = "00";
        countdownElements.hours.textContent = "00";
        countdownElements.minutes.textContent = "00";
        countdownElements.seconds.textContent = "00";
        return;
    }

    const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25));
    const days = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    countdownElements.years.textContent = String(years).padStart(1, "0");
    countdownElements.days.textContent = String(days).padStart(1, "0");
    countdownElements.hours.textContent = String(hours).padStart(1, "0");
    countdownElements.minutes.textContent = String(minutes).padStart(1, "0");
    countdownElements.seconds.textContent = String(seconds).padStart(1, "0");
}


