/* Global Variables */

const apiAccessKey = "&appid=5b2f8535cd1bc372024f48bfc3fb76ba&units=imperial";
const apiBaseUrl = "https://api.openweathermap.org/data/2.5/weather?zip=";
const submitButton = document.querySelector("#generate");
const displayDate = document.querySelector("#date");
const displayTemperature = document.querySelector("#temp");
const displayContent = document.querySelector("#content");

// Create a new date instance dynamically with JS

let currentDate = new Date();
let formattedDate = currentDate.getFullYear() + ' / ' + (currentDate.getMonth() + 1) + ' / ' + currentDate.getDate();

// Event listener to add function to existing HTML DOM element
submitButton.addEventListener("click", sendPost);

// Function called by event listener
async function sendPost(e) {
    e.preventDefault();
    const zipCode = document.querySelector("#zip").value;
    const feelings = document.querySelector("#feelings").value;
    if (zipCode === "" || feelings === "") {
        alert("Please enter zip code and feelings");
        return;
    }
    try {
        const temperature = await fetchApiData(zipCode);
        const data = {
            temperature,
            date: formattedDate,
            userResponse: feelings,
        };
        await postDataToServer("/newData", data);
        await updateDisplay();
    } catch (error) {
        console.log("error");
    }
}

// Function to GET Web API Data
async function fetchApiData(zipCode) {
    const url = `${apiBaseUrl}${zipCode}${apiAccessKey}`;
    const apiResponse = await fetch(url);
    const parsedResponse = await apiResponse.json();
    if (parsedResponse.cod === "404") {
        alert("Please enter a valid zip code");
        return;
    }
    const data = parsedResponse.main.temp;
    return data;
}

// Function to POST data
async function postDataToServer(url = "", data = {}) {
    const serverResponse = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return serverResponse.json();
}

// Function to GET Project Data
async function updateDisplay() {
    const request = await fetch("/all");
    try {
        const endPointData = await request.json();
        console.log(endPointData.Date);
        displayDate.innerHTML = endPointData.date;
        displayTemperature.innerHTML = `${Math.round(endPointData.temperature)}° degree`;
        displayContent.innerHTML = endPointData.userResponse;
    } catch (error) {
        console.log(error);
    }
}