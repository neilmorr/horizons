import { addDoc, collection, Timestamp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { app, db, storage, storageBucket } from '/src/index.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js';

// Testing - checking if storage is defined
if (storage) {
    console.log('Firebase Storage has been successfully imported.');
  } else {
    console.error('Firebase Storage import failed.');
  }

console.log(storage); // Testing - checking storage object import successful
console.log("Storage Bucket Name:", storageBucket); // Testing - checking storage bucket name is correct 

document.getElementById("tripForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const tripDate = document.getElementById("tripDate").value;
    const tripLocation = document.getElementById("tripLocation").value;
    const tripDescription = document.getElementById("tripDescription").value;
    const tripImageInput = document.getElementById("tripImage"); // Get the file input element
    
    // Check if a file is selected
    if (tripImageInput.files.length > 0) {
        const tripImageFile = tripImageInput.files[0];
        console.log(tripImageFile.name);
        
        // Upload the image to Firebase Storage (replace 'images' with your storage path)
        const storageRef = ref(storage, 'trips/' + tripImageFile.name);
        console.log('Storage Reference:', storageRef); // Log storage reference


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
            const tripsCollectionRef = collection(db, 'trips');
            await addDoc(tripsCollectionRef, newTrip);
            console.log('Trip data added to Firestore:', newTrip);

            // Optionally, you can update the calendar here if needed
            updateCalendar(); // Currently throwing error in console

            // Clear the form fields after successful submission
            document.getElementById("tripForm").reset();
        } catch (error) {
            console.error('Error adding trip data:', error);
        }
    } else {
        // Handle the case where no image is selected
        console.error('No image selected.');
    }
});
