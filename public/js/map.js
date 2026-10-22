mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11', // Use the standard style for the map
    projection: 'globe', // display the map as a globe
    zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
    center: listing.geometry.coordinates // center the map on this longitude and latitude
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker({color : "red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false
        }).setHTML(
            `<h4>${listing.title}</h4>
             <p>Exact location will be shared after booking</p>`
        )
    )
    .addTo(map)
    
const markerElement = marker.getElement();

// Show popup when hovering over the marker
markerElement.addEventListener("mouseenter", () => {
    marker.togglePopup();
});

// Close popup when leaving the marker
markerElement.addEventListener("mouseleave", () => {
    marker.togglePopup();
});