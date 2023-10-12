import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { app, db, storage, storageBucket } from '/src/index.js';

// Define the getMonthName function
function getMonthName(monthIndex) {
    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];
    return months[monthIndex];
}

document.addEventListener("DOMContentLoaded", async () => {
    const calendarContainer = document.querySelector(".calendar");
    const modal = document.getElementById("modal");

    try {
       // Retrieve trip data from Firestore
       const tripsCollectionRef = collection(db, 'trips');
       const querySnapshot = await getDocs(tripsCollectionRef);

       const completedTrips = [];
       querySnapshot.forEach((doc) => {
           const tripData = doc.data();
           
           // Check if the 'date' property exists before converting to a Date object
           if (tripData.date && typeof tripData.date.toDate === 'function') {
            // Convert Firestore Timestamp to JavaScript Date
            tripData.date = tripData.date.toDate();
            completedTrips.push(tripData);
        }
        });

        // Generate the calendar grid
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Select the H1 element by its id
        const monthHeader = document.getElementById("monthHeader");

        const monthName = getMonthName(currentMonth);

        // Update the text content of the H1 element
        monthHeader.textContent = `Your adventures in ${monthName}`;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;

            // Check if the day has a completed trip
            const trip = completedTrips.find(trip => {
                // Check if the tripDate matches the current date in the loop
                return trip.date.toISOString().slice(0, 10) === date.toISOString().slice(0, 10);
            });
            if (trip) {

                dayElement.classList.add("has-trip"); // Add a CSS class to style it with a border
                dayElement.style.cursor = "pointer"; // Change cursor style

                // Show the modal on dayElement click if a trip is present
                dayElement.addEventListener("click", () => {
                    if (trip) {
                        modal.innerHTML = `
                            <img src="${trip.picture}" alt="${trip.location}">
                            <h2>${trip.location}</h2>
                            <p>${trip.description}</p>
                            <button id="closeModal">x</button>
                        `;
                        modal.style.display = "block";

                        // Add event listener to close the modal when clicking the close button
                        const closeModalButton = document.getElementById("closeModal");
                        closeModalButton.addEventListener("click", () => {
                            modal.style.display = "none";
                        });

                        // Add event listener to close the modal when clicking outside of its boundaries
                        window.addEventListener("mousedown", (event) => {
                            if (modal.style.display === "block" && !modal.contains(event.target)) {
                                modal.style.display = "none";
                            }
                        });
                    }
                });
            }
            calendarContainer.appendChild(dayElement);
        }
    } 
    catch (error) {
        console.error('Error fetching trip data:', error);
    }
});
