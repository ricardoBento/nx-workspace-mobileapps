// If your app runs this program on browser,
// you need to set `API_KEY_FOR_BROWSER_RELEASE` and `API_KEY_FOR_BROWSER_DEBUG`
// before `plugin.google.maps.Map.getMap()`
//
//   API_KEY_FOR_BROWSER_RELEASE for `https:` protocol
//   API_KEY_FOR_BROWSER_DEBUG for `http:` protocol
//


// $(document).ready(function () {
// }


plugin.google.maps.environment.setEnv({
    'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyDF88CG_QBe0d5ONwFWReH588ct7-K9eVQ',
    'API_KEY_FOR_BROWSER_DEBUG': ''
  });

var map;
document.addEventListener("deviceready", function () {
    var div = document.getElementById("map_canvas");

    // Initialize the map view
    map = plugin.google.maps.Map.getMap(div);

    // Wait until the map is ready status.
    map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
}, false);

function onMapReady() {
    var button = document.getElementById("button");
    button.addEventListener("click", onBtnClicked, false);
}

function onBtnClicked() {
    map.showDialog();
}
