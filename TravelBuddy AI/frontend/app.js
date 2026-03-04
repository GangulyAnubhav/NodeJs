async function planTrip() {

const destination = document.getElementById("destination").value;
const days = document.getElementById("days").value;
const style = document.getElementById("style").value;

const resultDiv = document.getElementById("result");
resultDiv.innerHTML = "⏳ Generating your AI itinerary...";
console.log("Hello from planTrip function!");

try {
    console.log(`Sending request: Destination=${destination}, Days=${days}, Style=${style}`);
    const response = await fetch("http://localhost:7071/api/planTrip", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            destination: destination,
            days: days,
            style: style
        })
    });

    const responseJson = await response.json();
    console.log("Received response:", responseJson);

    const trip = responseJson.data; 
    
    // Trip title 
    let html = `<h2>${trip.tripTitle}</h2>`; html += `<p><b>Travel Style:</b> ${trip.styleApplied}</p><hr>`; 
    
    // Loop itinerary 
    trip.itinerary.forEach(day => { 
        html += `<h3>Day ${day.day}</h3><ul>`; 
        
        day.activities.forEach(activity => { 
            html += `<li>${activity}</li>`; 
        }); 
        html += `</ul>`; 
    }); 
    resultDiv.innerHTML = html;

} catch (error) {
    resultDiv.innerHTML = "❌ Failed to connect to AI service.";
    console.error(error);
}

}
