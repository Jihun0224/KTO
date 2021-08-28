var map;
var MarkerArr = [];
var EntireMarker = [];
var FilterdMarker = [];
var SelectedMarker = null
var temp=99;
function Initialization(_map){
    map = _map;
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    kakao.maps.event.addListener(map, 'zoom_changed', function() {        

        var level = map.getLevel();
        if (level>13){
            setMarkers(null);
            // DrawPolygon();
        }
        else{            
            setMarkers(map)
        }
    });
}

function filterBtn(option){
    FilterdMarker=[]
    if(option == 0){
        FilterdMarker = EntireMarker;
    }
    else if(option == 1){
        
        EntireMarker.map((MakerArr)=>{
            if(MakerArr.Fb === "한옥"){
              FilterdMarker.push(MakerArr)
            }
          })
    }
    else if(option ==2){
        EntireMarker.map((MakerArr)=>{
            if(MakerArr.Fb === "호텔"){
              FilterdMarker.push(MakerArr)
            }
          })
    }
    else{
        EntireMarker.map((MakerArr)=>{
            if(MakerArr.Fb === "민박"){
              FilterdMarker.push(MakerArr)
            }
          })
    }
    MarkerArr = FilterdMarker
    setfilteredMarkers(map)
}

function setfilteredMarkers(map) {
    for (var i = 0; i < EntireMarker.length; i++) {
        EntireMarker[i].setMap(null);
    }   
    for (var i = 0; i < FilterdMarker.length; i++) {
        FilterdMarker[i].setMap(map);
    }  
            
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
        "https://raw.githubusercontent.com/Jihun0224/KTO/9af2149d150227a68a141282ec774297be5c2ea7/images/hanok.svg?token=AOHIQEAVK3MV25LYSEBT5MLBE7UJE",
        new kakao.maps.Size(31, 35),
        {
            offset: new kakao.maps.Point(16, 34),
            shape: "poly",
            coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
        }
      );
      var Hotelicon = new kakao.maps.MarkerImage(
        "https://raw.githubusercontent.com/Jihun0224/KTO/9af2149d150227a68a141282ec774297be5c2ea7/images/hotel.svg?token=AOHIQEEZOLBSCFDN26GSCH3BE7UKI",
        new kakao.maps.Size(31, 35),
        {
            offset: new kakao.maps.Point(16, 34),
            shape: "poly",
            coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
        }
      );
      var BBicon = new kakao.maps.MarkerImage(
        "https://raw.githubusercontent.com/Jihun0224/KTO/9af2149d150227a68a141282ec774297be5c2ea7/images/bb.svg?token=AOHIQECHEJD66VNIKC4CX6DBE7UCS",
        new kakao.maps.Size(31, 35),
        {
            offset: new kakao.maps.Point(16, 34),
            shape: "poly",
            coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
        }
      );
      var Hanokicon_sel = new kakao.maps.MarkerImage(
        "https://github.com/Jihun0224/KTO/blob/master/images/hanok_select.png?raw=true",
        new kakao.maps.Size(41, 45),
        {
            offset: new kakao.maps.Point(16, 34),
            shape: "poly",
            coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
        }
      );
      var Hotelicon_sel = new kakao.maps.MarkerImage(
        "https://github.com/Jihun0224/KTO/blob/master/images/hotel_select.png?raw=true",
        new kakao.maps.Size(41, 45),
        {
            offset: new kakao.maps.Point(16, 34),
            shape: "poly",
            coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
        }
      );
      var BBicon_sel = new kakao.maps.MarkerImage(
        "https://github.com/Jihun0224/KTO/blob/master/images/bb_select.png?raw=true",
        new kakao.maps.Size(41, 45),
        {
            offset: new kakao.maps.Point(16, 34),
            shape: "poly",
            coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
        }
      );
    fetch("/Certified")
    .then(response => response.json())  
    .then(json => {
        $.each(json, function(index,place){
            var id = place.id;
            
            var position = new kakao.maps.LatLng(place.y,  place.x)
            var name = place.name.split('[')[0]
            var address = place.address
            var phoneNumber = place.phoneNumber
            var infoUrl = place.infoUrl
            var summary = place.summary
            var info = place.info
            var help = place.help
            var imgSrc = place.src
            
            
            var marker = new kakao.maps.Marker({
                map: map,
                position: position,
                title:
                id == 1?"한옥":
                id == 2?"호텔":
                "민박",
                image: 
                id == 1?Hanokicon:
                id == 2?Hotelicon:
                BBicon
            })
                        // var marker1 = new kakao.maps.Marker({ 
            //     // 지도 중심좌표에 마커를 생성합니다 
            //     position: map.getCenter() 
            // }); 
            // marker1.setMap(map);

            // kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
            //     var latlng = mouseEvent.latLng; 

            //             // 마커 위치를 클릭한 위치로 옮깁니다
            //     marker1.setPosition(latlng);
            // });

            // 클릭 이벤트
            
            kakao.maps.event.addListener(marker, 'click', function() {
                document.getElementById("hotel-name").innerHTML=name;
                document.getElementById("hotel-addr").innerHTML=address;
                document.getElementById("hotel-num").innerHTML=phoneNumber;
                $("#hotel-url").attr("href",infoUrl);
                document.getElementById("hotel-summary").innerHTML=summary;
                document.getElementById("hotel-info").innerHTML=info;
                $("#hotel-img").attr("src",imgSrc);

                // 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면
                // 마커의 이미지를 클릭 이미지로 변경합니다
                
                
                if(id==1)
                {
                    marker.setImage(Hanokicon_sel)

                    if (SelectedMarker!=null){
                        if(temp==1){
                            SelectedMarker.setImage(Hanokicon)
                        }
                        if(temp==2){
                            SelectedMarker.setImage(Hotelicon)
                        }
                        if(temp!=1 && temp!=2){
                            SelectedMarker.setImage(BBicon)
                        }
                    }
                    else{
                    }
                }
                if(id==2)
                {
                    marker.setImage(Hotelicon_sel)

                    if (SelectedMarker!=null){
                        if(temp==1){
                            SelectedMarker.setImage(Hanokicon)
                        }
                        if(temp==2){
                            SelectedMarker.setImage(Hotelicon)
                        }
                        if(temp!=1 && temp!=2){
                            SelectedMarker.setImage(BBicon)
                        }
                    }
                    else{
                    }
                }
                if(id!=1 && id!=2)
                {
                    marker.setImage(BBicon_sel)

                    if (SelectedMarker!=null){
                        if(temp==1){
                            SelectedMarker.setImage(Hanokicon)
                        }
                        if(temp==2){
                            SelectedMarker.setImage(Hotelicon)
                        }
                        if(temp!=1 && temp!=2){
                            SelectedMarker.setImage(BBicon)
                        }
                    }
                    else{
                        console.log("qq")
                    }
                }

                // 열린 관광 요소(12개)
                if(help.indexOf("장애인 화장실") != -1)
                {
                    $("#b1").attr("style","background-color:rgb(157,186,209)");
                    $("#bb1").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b1").attr("style","background-color:white");
                    $("#bb1").attr("style","font-size:14px;color:rgb(157,186,209)");
                }
                
                if(help.indexOf("장애인용 엘리베이터") != -1)
                {
                    $("#b2").attr("style","background-color:rgb(157,186,209)");
                    $("#bb2").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b2").attr("style","background-color:white");
                    $("#bb2").attr("style","font-size:14px;color:rgb(157,186,209)");
                }

                if(help.indexOf("장애인 전용 주차구역") != -1)
                {
                    $("#b3").attr("style","background-color:rgb(157,186,209)");
                    $("#bb3").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b3").attr("style","background-color:white");
                    $("#bb3").attr("style","font-size:14px;color:rgb(157,186,209)");
                }

                if(help.indexOf("주출입구 단차없음") != -1)
                {
                    $("#b4").attr("style","background-color:rgb(157,186,209)");
                    $("#bb4").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b4").attr("style","background-color:white");
                    $("#bb4").attr("style","font-size:14px;color:rgb(157,186,209)");
                }

                if(help.indexOf("지하철 접근가능") != -1)
                {
                    $("#b5").attr("style","background-color:rgb(157,186,209)");
                    $("#bb5").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b5").attr("style","background-color:white");
                    $("#bb5").attr("style","font-size:14px;color:rgb(157,186,209)");
                }

                if(help.indexOf("저상버스 접근가능") != -1)
                {
                    $("#b6").attr("style","background-color:rgb(157,186,209)");
                    $("#bb6").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b6").attr("style","background-color:white");
                    $("#bb6").attr("style","font-size:14px;color:rgb(157,186,209)");
                }

                if(help.indexOf("휠체어 대여") != -1)
                {
                    $("#b7").attr("style","background-color:rgb(157,186,209)");
                    $("#bb7").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b7").attr("style","background-color:white");
                    $("#bb7").attr("style","font-size:14px;color:rgb(157,186,209)");
                }

                if(help.indexOf("시각장애인 편의서비스") != -1)
                {
                    $("#b8").attr("style","background-color:rgb(157,186,209)");
                    $("#bb8").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b8").attr("style","background-color:white");
                    $("#bb8").attr("style","font-size:14px;color:rgb(157,186,209)");
                }

                if(help.indexOf("청각장애인 편의서비스") != -1)
                {
                    $("#b9").attr("style","background-color:rgb(157,186,209)");
                    $("#bb9").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b9").attr("style","background-color:white");
                    $("#bb9").attr("style","font-size:14px;color:rgb(157,186,209)");
                }

                if(help.indexOf("수유실") != -1)
                {
                    $("#b10").attr("style","background-color:rgb(157,186,209)");
                    $("#bb10").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b10").attr("style","background-color:white");
                    $("#bb10").attr("style","font-size:14px;color:rgb(157,186,209)");
                }

                if(help.indexOf("장애인 객실") != -1)
                {
                    $("#b11").attr("style","background-color:rgb(157,186,209)");
                    $("#bb11").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b11").attr("style","background-color:white");
                    $("#bb11").attr("style","font-size:14px;color:rgb(157,186,209)");
                }

                if(help.indexOf("유모차 대여") != -1)
                {
                    $("#b12").attr("style","background-color:rgb(157,186,209)");
                    $("#bb12").attr("style","font-size:14px;color:white");
                }
                else
                {
                    $("#b12").attr("style","background-color:white");
                    $("#bb12").attr("style","font-size:14px;color:rgb(157,186,209)");
                }
                SelectedMarker = marker
                temp = id
          });
          

            $('head').append('<link rel="stylesheet" href="../static/infopage_css/overlay.css">');
            var contents = 
            '<div class="overlaywrap">' + 
            '    <div class="overlayinfo">' + 
            '        <div class="title">' + name +'</div>' + 
            '        <div class="body">' + 
            '            <div class="img">' +
            '                <img src="'+ imgSrc+ '"width="73" height="70">' +
            '           </div>' + 
            '            <div class="overlaydesc">' + 
            '                <div class="ellipsis">'+address+'</div>' + 
            '                <div class="jibun ellipsis">'+phoneNumber+'</div>' + 
            '                <div><a href='+ infoUrl +'target="_blank" class="link">상세보기</a></div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>';
            var content = document.createElement('div');
            content.innerHTML = contents;
            content.style.cssText = 'background-color: white';
            

            marker.setMap(map);
            MarkerArr.push(marker);
            

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
    EntireMarker = MarkerArr;

}
