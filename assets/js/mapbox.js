mapboxgl.accessToken = x;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
    center: data.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});
const marker = new mapboxgl.Marker()
    .setLngLat(data.geometry.coordinates)
    .addTo(map);