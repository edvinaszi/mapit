
let marker, circle, zoomed
let watchId
let whatYouFound = ""
let markers = {
    berries: [],
    mushrooms: [],
    fish: []
};
let fishMarker = L.icon({
    iconUrl: 'fishMarker.png',
    iconSize: [60, 60]
})
let mushroomMarker = L.icon({
    iconUrl: 'mushroomMarker.png',
    iconSize: [60, 60]
})
let berryMarker = L.icon({
    iconUrl: 'berryMarker.png',
    iconSize: [60, 60]
})
let selectMarker 




updateView()
berriesMarker()

function updateView(){
    
    mapHTML = /*HTML*/`
    <div id="map" class="map"></div>
    <div class="mapButtons">
    <img id="locationImg" src="arrowgrey.png" onclick="showLocation()">
    <img id="addMarkerImg" onclick="addMarker()" src="buttonMarkerGrey.svg">
    </div>
    <div>
    <img id="fullScreen" onclick="fullScreen()" src="fullScreen.svg">
    </div>
    <input placeholder="Name of find" onkeyup="inputMarker(this.value)">
    <button onclick="registerMarker()">Register find</button>
    <button onclick="showMarkers()">Show markers</button>
    <button onclick="hideAll()">Hide markers</button><br>
    <button onclick="berriesMarker()">Berries</button>
    <button onclick="mushroomsMarker()">Mushrooms</button>
    <button onclick="fishesMarker()">Fish</button>
    <div><br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> </div>
    `;
    
    document.getElementById("app").innerHTML = mapHTML
    
    var map = L.map('map');
    map.setView([59.055, 10.02], 13);
    
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    window.map = map
    
}

let markerImg = document.getElementById("addMarkerImg")
let locationImg = document.getElementById("locationImg")
let fullScreenMap = document.getElementById("map")
let fullScreenButton = document.getElementById("fullScreen")

fullScreen()

function showLocation(){
    navigator.geolocation.clearWatch(watchId)
    watchId = navigator.geolocation.watchPosition(success, error);
    locationImg.src = "arrowg.png" 
}


function success(position){
    const lat = position.coords.latitude
    const lng = position.coords.longitude
    const accuracy = position.coords.accuracy

    if (circle) {
        map.removeLayer(circle);
    }

    var circleIcon = L.icon({iconUrl:"circle2.svg", iconSize: [20,20]})
    
  
    
    circle = L.marker([lat, lng], {
        icon: circleIcon,
    }).addTo(map);

    circle.bindPopup("This is you.")

    if(!zoomed){
       zoomed = map.setView([lat, lng], 13);
    }

    map.setView([lat, lng])
}

function error(err){
    if(err.code === 1){
        alert("Location access denied.")
    }   
}


function addMarker(){
    map.on('click', addMarkerOnClick);
    var img = document.getElementById("addMarkerImg")
    markerImg.src = 'buttonMarkerGreen.svg'
}


function addMarkerOnClick(e){

    const lat = e.latlng.lat
    const lng = e.latlng.lng

    marker = L.marker([lat, lng]).addTo(map).bindPopup(`${whatYouFound}`)

    marker.setIcon(selectMarker)

    map.panTo([lat, lng])

    if (map.on('click', addMarkerOnClick)){
        map.off('click', addMarkerOnClick);
        markerImg.src = 'buttonMarkerGrey.svg'
        }
    
}

function fullScreen(){
    if (fullScreenMap.classList.contains("map")){
        fullScreenMap.classList.remove("map")
        fullScreenMap.classList.add("map2")
        fullScreenButton.src = "fullScreen.svg"
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    } else{
        fullScreenMap.classList.remove("map2")
        fullScreenMap.classList.add("map")
        fullScreenButton.src = "exitFullScreen.svg"
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
}

function inputMarker(found){
    whatYouFound = found
}

function registerMarker(){
    if (marker && selectMarker){
        const name = whatYouFound
        const findInfo = {
            nameOfFound: name,
            dateFound: "21.02.1994",
            location: marker.getLatLng(),
            marker: marker,
            selectMarker: selectMarker
        }
            markers.berries.push(findInfo);
           
    }

}

function showMarkers(){

    hideAll()

    markers.berries.forEach(function(findInfo) {
        const location = findInfo.location;
        const newMarker = L.marker([location.lat, location.lng], { icon: findInfo.selectMarker }).addTo(map);
        newMarker.bindPopup(findInfo.nameOfFound);
        findInfo.marker = newMarker;
    });
}

function hideAll(){

    markers.berries.forEach(function(findInfo) {
        const marker = findInfo.marker;
        if (marker) {
            map.removeLayer(marker);
        }
    })

    if(fullScreenMap.classList.contains("map2")){
    fullScreenMap.classList.remove("map2")
    fullScreenMap.classList.add("map2")
} else {
        fullScreenMap.classList.remove("map")
        fullScreenMap.classList.add("map")
    }
}

function mushroomsMarker(){
    selectMarker = mushroomMarker
}
function berriesMarker(){
    selectMarker = berryMarker
}
function fishesMarker(){
    selectMarker = fishMarker
}
