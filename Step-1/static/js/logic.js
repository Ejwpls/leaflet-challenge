// Crate map object , start of oceania
var MyMap = L.map("map", {
    center: [0.7893,113.9213],
    zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(MyMap);



// Get geojson data from the URL
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

    //console.log(data)

  // Get the magnitude the Geojson to get all the colours 
  function stylemag(data) {
    return {
      opacity: 1,
      fillOpacity: 0.7,
      fillColor: getColor(data.properties.mag),
      color: "#000000",
      radius: getRadius(data.properties.mag),
      stroke: true,
      weight: 1.0
    };
  }

  // function to determine the colour based on magnitude (Green to red)
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
  // Function to exxagerate the radius, so can be plotted
  function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }

    return magnitude *2;
  }

  // Add GeoJSON data 
  L.geoJson(data, {
    // Place circle marker from lat lng of data
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // Apply same style for each markers using stylemag function
      style: stylemag,
      // create a popup
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>where at: " + feature.properties.place);
      }
    }).addTo(MyMap)

// MAKING OF LEGEND
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    legend.addTo(MyMap);
});
