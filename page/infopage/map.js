var map;

function Initialization(_map){
    map = _map;
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
}

function DrawPolygon(){
    $.getJSON("../../data/sido.json", function(geojson){
        var data = geojson.features;
        var name = '';
        var code = '';

        $.each(data, function(index, val){
            name = val.properties.SIG_KOR_NM;
            code = val.properties.SIG_CD;

            if(val.geometry.type == "MultiPolygon")
            {
                displayArea(name, code, val.geometry.coordinates, true);
            }
            else{
                displayArea(name, code, val.geometry.coordinates, false);
            }
        });
    });
}

function makePolygon(coordinates){
    var polygonPath = [];
    
   
    $.each(coordinates[0], function(index, coordinate){
        polygonPath.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
    });
    return new kakao.maps.Polygon({
        path: polygonPath,
        strokeWeight:1,
        strokeColor: '#004c80',
        strokeOpacity: 0.8,
        strokeStyle: 'longdash',
        fillColor: '#A2FF99',
        fillOpacity:0.2
    });
}

function makeMultiPolygon(coordinates){
    var polygonPath = [];
    $.each(coordinates, function(index, val2){
        var coordinates2 = [];

        $.each(val2[0], function(index2, coordinate){
            coordinates2.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
        });
        
        polygonPath.push(coordinates2);
    });

    return new kakao.maps.Polygon({
        path: polygonPath,
        strokeWeight:1,
        strokeColor: '#004c80',
        strokeOpacity: 0.8,
        strokeStyle: 'longdash',
        fillColor: '#A2FF99',
        fillOpacity:0.2
    });
}

function displayArea(name, code, coordinates, multi){
    var polygon;
    if(multi){
        polygon = makeMultiPolygon(coordinates);
    }
    else{
        polygon = makePolygon(coordinates);
    }
    polygon.setMap(map);
}

function displayMarker(){
    fetch("http://localhost:5000/Certified")
    .then(response => response.json())  
    .then(json => {
        $.each(json, function(index,space){
            var marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(space.y, space.x)
            })
            marker.setMap(map);

        })
    })
}