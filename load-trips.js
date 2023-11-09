import { addDoc, collection, Timestamp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js';
import { app, db, storage, storageBucket } from '/src/index.js';

// Testing - checking if storage is defined
if (storage) {
    console.log('Firebase Storage has been successfully imported.');
  } else {
    console.error('Firebase Storage import failed.');
  }

console.log(storage); // Testing - checking storage object import successful
console.log("Storage Bucket Name:", storageBucket); // Testing - checking storage bucket name is correct 

// Function to show the success message popup
function showPopup(message) {
    const popup = document.querySelector('.popup-container');
    const popupMessage = document.querySelector('.popup-message');
    popupMessage.innerHTML = message; // Set the message content

    popup.style.right = '0';

    // Automatically hide the popup after a delay
    setTimeout(function() {
        hidePopup();
    }, 3000); // 
}

// Function to hide the success message popup
function hidePopup() {
    const popup = document.querySelector('.popup-container');
    popup.style.right = '-100%'; // Slide it back off-screen to the right
}

// Function to start the loading animation
function startLoadingAnimation() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
}

// Function to stop the loading animation
function stopLoadingAnimation() {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
}

document.getElementById("tripForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Start the loading animation
    startLoadingAnimation();


    const tripDate = document.getElementById("tripDate").value;
    const tripLocation = document.getElementById("tripLocation").value;
    const tripDescription = document.getElementById("tripDescription").value;
    const tripImageInput = document.getElementById("tripImage"); // Get the file input element
    
    // Check if a file is selected
    if (tripImageInput.files.length > 0) {

        const tripImageFile = tripImageInput.files[0];
        
        // Upload the image to Firebase Storage (replace 'images' with your storage path)
        const storageRef = ref(storage, 'trips/' + tripImageFile.name);

        const storageSnapshot = await uploadBytes(storageRef, tripImageFile);

        // Get the download URL of the uploaded image
        const imageUrl = await getDownloadURL(storageSnapshot.ref);

        const newTrip = {
            date: Timestamp.fromDate(new Date(tripDate)),
            location: tripLocation,
            description: tripDescription,
            picture: imageUrl, // Store the image URL in Firestore
        };

        // Write the new trip data to Firestore
        try {
    
            // Hide the form or relevant content
            

            const tripsCollectionRef = collection(db, 'trips');
            await addDoc(tripsCollectionRef, newTrip);
            console.log('Trip data added to Firestore:', newTrip);

            stopLoadingAnimation();

            // Optionally, you can update the calendar here if needed
            //updateCalendar(); // Currently throwing error in console

            // Clear the form fields after successful submission
            document.getElementById("tripForm").reset();
       


            // Call the showPopup function when you want to display the message
            showPopup('Trip successfully added!'); // Example usage
        
       
        } catch (error) {
            console.error('Error adding trip data:', error);
             // Start the loading animation
             stopLoadingAnimation();
        }
    } else {
        // Handle the case where no image is selected
        console.error('No image selected.');
       
        stopLoadingAnimation();
    }
});
