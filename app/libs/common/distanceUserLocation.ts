export interface Location {
    lat: number;
    lon: number;
  }
  
  export function getDistanceFromLatLon(
    restroLocation: Location,
    userLocation: Location,
    unit: "K" | "M" = "K"
  ) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (userLocation.lat - restroLocation.lat) * (Math.PI / 180);
    const dLon = (userLocation.lon - restroLocation.lon) * (Math.PI / 180);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(restroLocation.lat * (Math.PI / 180)) *
        Math.cos(userLocation.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c; // Distance in km
  
    if (unit === "M") {
      distance *= 0.621371; // Convert to miles
    }
  
    distance = parseFloat(distance.toFixed(2)); // Round to 2 decimal places  
    console.log("Distance:", distance, "km");
    // If distance is greater than 10 km, return false
    if (distance >= 10) return false;
  
    // If distance is within 3 km, delivery is free
    if (distance < 3) return "Free";
    // For every additional km beyond 3 km, add 0.5 to the base fee of 1
    const extraKm = distance - 3;
    const deliveryFee = 1 + extraKm * 0.5;
  
    return parseFloat(deliveryFee.toFixed(2)); // Return fee as a string with 2 decimal places
  }
  