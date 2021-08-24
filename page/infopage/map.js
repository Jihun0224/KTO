var map;
var MarkerArr = [];
function Initialization(_map){
    map = _map;
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    kakao.maps.event.addListener(map, 'zoom_changed', function() {        

        var level = map.getLevel();
        if (level>12){
            setMarkers(null);
            DrawPolygon();
        }
        else{            
            setMarkers(map)
        }
    });
}
function setMarkers(map) {
    for (var i = 0; i < MarkerArr.length; i++) {
        MarkerArr[i].setMap(map);
    }            
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
    var activeId = null;
    var timeoutId = null;
    
    var Hanokicon = new kakao.maps.MarkerImage(
        "../../images/hanok.svg",
        new kakao.maps.Size(31, 35),
        {
            offset: new kakao.maps.Point(16, 34),
            shape: "poly",
            coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
        }
      );
      var Hotelicon = new kakao.maps.MarkerImage(
        "../../images/hotel.svg",
        new kakao.maps.Size(31, 35),
        {
            offset: new kakao.maps.Point(16, 34),
            shape: "poly",
            coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
        }
      );
      var BBicon = new kakao.maps.MarkerImage(
        "../../images/bb.svg",
        new kakao.maps.Size(31, 35),
        {
            offset: new kakao.maps.Point(16, 34),
            shape: "poly",
            coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
        }
      );
    fetch("http://localhost:5000/Certified")
    .then(response => response.json())  
    .then(json => {
        $.each(json, function(index,place){
            var id = place.id;

            var position = new kakao.maps.LatLng(place.y,  place.x)
            var name = place.name.split('[')[0]
            var marker = new kakao.maps.Marker({
                map: map,
                position: position,
                image: 
                id == 1?Hanokicon:
                id == 2?Hotelicon:
                BBicon
            })
            

            $('head').append('<link rel="stylesheet" type="text/css" href="overlay.css">');
            var contents = 
            '<div class="overlaywrap">' + 
            '    <div class="overlayinfo">' + 
            '        <div class="title">' + name +'</div>' + 
            '        <div class="body">' + 
            '            <div class="img">' +
            '                <img src="https://cfile181.uf.daum.net/image/250649365602043421936D" width="73" height="70">' +
            '           </div>' + 
            '            <div class="overlaydesc">' + 
            '                <div class="ellipsis">'+place.address+'</div>' + 
            '                <div class="jibun ellipsis">'+place.phoneNumber+'</div>' + 
            '                <div><a href='+ place.infoUrl +'target="_blank" class="link">상세보기</a></div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>';
            var content = document.createElement('div');
            content.innerHTML = contents;
            content.style.cssText = 'background-color: white';

            marker.setMap(map);
            MarkerArr.push(marker)

            var overlay = new kakao.maps.CustomOverlay({
                yAnchor: 2.5,
                content: content,
                position: position
            });
            var mouseOverHandler = function() {
                if (timeoutId !== null && id === activeId) {
                    window.clearTimeout(timeoutId);
                    timeoutId = null;
                    return;
                }
                overlay.setMap(map);
                activeId = id;
            };
            
            var mouseOutHandler = function() {
                timeoutId = window.setTimeout(function() {
                    overlay.setMap(null);
                    activeId = null;
                    timeoutId = null;
                }, 50);
            };
            
            kakao.maps.event.addListener(marker, 'mouseover', mouseOverHandler);
            kakao.maps.event.addListener(marker, 'mouseout', mouseOutHandler);
            content.addEventListener('mouseover', mouseOverHandler);
            content.addEventListener('mouseout', mouseOutHandler);

        })
    })

}
