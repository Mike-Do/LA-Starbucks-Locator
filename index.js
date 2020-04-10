window.onload = function () {};
var map;
var markers = [];
var infoWindow;

function initMap() {
  var losAngeles = {
    lat: 34.06338,
    lng: -118.35808,
  };
  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 11,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });

  infoWindow = new google.maps.InfoWindow();

  searchStores();
}

function setOnClickListener() {
  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach(function (elem, index) {
    elem.addEventListener("click", function () {
      new google.maps.event.trigger(markers[index], "click");
    });
  });
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function searchStores() {
  var foundStores = [];
  var zipCode = document.getElementById("zip-code-input").value;
  if (zipCode) {
    for (var store of stores) {
      var postal = store.address["postalCode"].substring(0, 5);

      if (postal == zipCode) {
        foundStores.push(store);
      }
    }
  } else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showStoreMarkers(foundStores);
  setOnClickListener();
}

function displayStores(stores) {
  var storesHTML = "";
  for (var [index, store] of stores.entries()) {
    var address = store["addressLines"];
    var phone = store["phoneNumber"];
    storesHTML += `
      <div class="store-container">
        <div class="store-container-background">
            <div class="store-info-container">
                <div class="store-address">
                      <span>${address[0]}</span>
                      <span>${address[1]}</span>
                </div>
                <div class="store-phone-number">
                      ${phone}
                </div>
              </div>
                <div class="store-number-container">
                  <div class="store-number">
                      ${index + 1}
                </div>
              </div>  
            </div>
          </div>
      </div> 

  
    `;
    document.querySelector(".store-list").innerHTML = storesHTML;
  }
}

function showStoreMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  for (var [index, store] of stores.entries()) {
    var latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]
    );
    var name = store["name"];
    var address = store["addressLines"][0];
    var phone = store["phoneNumber"];
    var open = store["openStatusText"];
    bounds.extend(latlng);
    createMarker(latlng, name, open, address, phone, index);
  }
  map.fitBounds(bounds);
}

function createMarker(latlng, name, open, address, phone, index) {
  var html = `
    <div class="store-info-window">
      <div class="store-info-name">
          ${name}      
      </div>
      <div class="store-info-status">
        ${open}
      </div>
      <div class="store-info-address">
        <div class="circle">  
          <i class="fas fa-location-arrow"></i>
        </div> 
        ${address}
      </div>
      <div class="store-info-phone">
        <div class="circle">
          <i class="fas fa-phone-alt"></i>
        </div>
        ${phone}
      </div>
    </div>
  `;

  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    animation: google.maps.Animation.DROP,
    label: index.toString(),
  });
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
