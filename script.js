import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { app, db, storage, storageBucket } from '/src/index.js';

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

        console.log(completedTrips);

        // Generate the calendar grid
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;

            // Check if the day has a completed trip and add the icon
            const trip = completedTrips.find(trip => {
                // Check if the tripDate matches the current date in the loop
                return trip.date.toISOString().slice(0, 10) === date.toISOString().slice(0, 10);
            });
            if (trip) {
                const icon = document.createElement("img");
                icon.src = trip.picture; // Use the picture URL from Firestore
                icon.alt = trip.location;
                icon.classList.add("calendar-icon"); // Add a CSS class to the icon


                // Show the modal on icon hover
                icon.addEventListener("mouseenter", () => {
                    modal.innerHTML = `
                        <img src="${trip.picture}" alt="${trip.location}">
                        <h2>${trip.location}</h2>
                        <p>${trip.description}</p>
                    `;
                    modal.style.display = "block";
                });

                // Hide the modal when the mouse leaves the icon
                icon.addEventListener("mouseleave", () => {
                    modal.style.display = "none";
                });

                dayElement.appendChild(icon);
            }

            calendarContainer.appendChild(dayElement);
        }
    } catch (error) {
        console.error('Error fetching trip data:', error);
    }
});
