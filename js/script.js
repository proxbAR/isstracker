let setVal;

let api_url = "https://api.wheretheiss.at/v1/satellites/25544";

let mymap = L.map("mapid").setView([0, 0], 3);

let marker = L.marker([0, 0]);

let circle = L.circle([0, 0], {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
});

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    // id: "mapbox/streets-v11",
    id: "mapbox/dark-v9",
    // id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: config.accessToken,
  }
).addTo(mymap);

async function getISS() {
  let jsondata = await fetch(api_url);
  let finaldata = await jsondata.json();
  let { latitude, longitude, velocity, altitude } = finaldata;
  // COUNTRY API FROM NOMINATIM
  let country_api = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
  );
  let final_country = await country_api.json();
  let country_name = "";
  let state_name = "";
  if (final_country.hasOwnProperty("address")) {
    if (typeof final_country.address.state === "undefined") {
      state_name = "Not available";
    } else {
      state_name = final_country.address.state;
    }
    if (typeof final_country.address.country === "undefined") {
      country_name = "Not available";
      state_name = "Not available";
    } else {
      country_name = final_country.address.country;
    }
  }
  let newlatitude = latitude.toFixed(4);
  let newlongitude = longitude.toFixed(4);
  let newvelocity = velocity.toFixed(2);
  altitude = altitude.toFixed(2);
  // if (country_name == "") {
  //   let flagcstat = document.getElementsByClassName("cstatflag");
  //   if (flagcstat[0].style.display != "none") {
  //     for (let i = 0; i < flagcstat.length; i++) {
  //       flagcstat[i].style.display = "none";
  //     }
  //   }
  // } else {
  //   let flagcstat = document.getElementsByClassName("cstatflag");
  //   if (flagcstat[0].style.display != "block") {
  //     for (let i = 0; i < flagcstat.length; i++) {
  //       flagcstat[i].style.display = "block";
  //     }
  //   }
  // }
  if (country_name == "") {
    country_name = "Not available";
    state_name = "Not available";
  }

  document.getElementById("ctry").textContent = country_name;
  document.getElementById("cstat").textContent = state_name;
  document.getElementById("lat").textContent = newlatitude;
  document.getElementById("lon").textContent = newlongitude;
  document.getElementById("vel").textContent = newvelocity + " kmph";
  document.getElementById("alti").textContent = altitude + " km";
  mymap.setView([latitude, longitude], 3);
  marker.setLatLng([latitude, longitude]).addTo(mymap);
  circle.setLatLng([latitude, longitude]).addTo(mymap);
}

let flag = 0;
document.getElementById("startTrack").addEventListener("click", function () {
  if (flag == 0) {
    setVal = setInterval(getISS, 1000);
    setTimeout(() => {
      document.getElementById("startTrack").innerHTML =
        "<h4>STOP TRACKING</h4>";
      document.getElementById("stat").style.display = "flex";
    }, 1500);
    flag = 1;
  } else {
    clearInterval(setVal);
    document.getElementById("startTrack").innerHTML = "<h4>START TRACKING</h4>";
    flag = 0;
  }
});
