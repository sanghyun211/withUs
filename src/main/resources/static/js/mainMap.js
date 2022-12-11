var HOME_PATH = window.HOME_PATH || '.';
var map;
var lati,longi;
var infoWindow;
var SearchMarkerList=[];
var menuLayer = $('<div style="position:absolute;z-index:10000;background-color:#fff;border:solid 1px #333;padding:10px;display:none;"></div>');
var address;
var readlist=[
    {"gr_sn":1,"mbr_sn":120,"rgtr_dt":null,"rgtr_id":0,"test_nm":"","txt_cn":"ㅋㅋㅋㅋㅋ","txt_date":"2022-12-17","txt_loc_lat":"35.8727089","txt_loc_lng":"128.7085681","txt_nm":"경도위도잘들어가는거봐 ㅋㅋㅋㅋ","txt_pic":"","txt_sn":55},
    {"gr_sn":1,"mbr_sn":86,"rgtr_dt":null,"rgtr_id":0,"test_nm":"","txt_cn":"dd","txt_date":"2022-12-21","txt_loc_lat":"35.7688718","txt_loc_lng":"128.7495952","txt_nm":"dd","txt_pic":"","txt_sn":56},
    {"gr_sn":1,"mbr_sn":120,"rgtr_dt":null,"rgtr_id":0,"test_nm":"","txt_cn":"asdf","txt_date":"2022-12-06","txt_loc_lat":"35.9191897","txt_loc_lng":"128.650332","txt_nm":"나다2","txt_pic":"","txt_sn":58},
    {"gr_sn":1,"mbr_sn":120,"rgtr_dt":null,"rgtr_id":0,"test_nm":"","txt_cn":"df","txt_date":"2022-11-28","txt_loc_lat":"35.8994466","txt_loc_lng":"128.6659961","txt_nm":"asd","txt_pic":"","txt_sn":59},
    {"gr_sn":1,"mbr_sn":120,"rgtr_dt":null,"rgtr_id":0,"test_nm":"","txt_cn":"gdgd","txt_date":"2022-12-09","txt_loc_lat":"35.8752475","txt_loc_lng":"128.6974102","txt_nm":"안녕하세요","txt_pic":"","txt_sn":60}
];

$(document).ready(function(){

    // 코드수정 반영 디버깅용
    //alert(crd.latitude+","+crd.longitude);

    // console.log("data: "+readlist);

    // 처음 접속했을때 오른쪽 네비바에 스토리 추가?
    $("#send").hide();
    $("#infoForm").hide();

});
function myFunction() {
    // var x = document.getElementById("myInput");
    // document.getElementById("demo").innerHTML = "You are searching for: " + x.value;
    // event.preventDefault();
    getData($("#searchInput").val());
}

function setMyMap() {

    var mapContainer = document.getElementById('map'), // 지도를 표시할 div
        mapOption = {
            center: new naver.maps.LatLng(lati, longi), // 지도의 중심좌표
            zoom: 15, // 지도의 확대 레벨
            mapTypeControl: true,

        };

    // 지도를 생성합니다
    map = new naver.maps.Map(mapContainer, mapOption);

    // 내 위치에 마커 띄우기
    var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lati, longi),
        map: map,
        // icon:{
        //     content: '<img src="resources/img/me.png"   width="100" height="50" alt="이미지" onerror="this.style.display=\'none\'" />',
        // }
        icon:{
            content:['<div class=infoWin style="background-color:#005cbf">' +
            '<div style ="font-weight: bold;font-size:17px;color: #FFFFFF">현재 위치</div>'+
            '</div>'

            ].join('')
        }
    });

    // 현재위치 인포창
    infoWindow = new naver.maps.InfoWindow({
        anchorSkew: true
    });
    //infoWindow.open(map, marker);

    setData(readlist); // 게시물 지도에 마커로 표시

    map.setCursor('pointer');
    map.getPanes().floatPane.appendChild(menuLayer[0]);

    // 마우스 클릭이벤트
    map.addListener('click', function(e) {

        $("#infoForm").hide();
        $("#send").show();

        searchCoordinateToAddress(e.coord);
        // setMarkerAndInfo(e);
    });

    // naver.maps.Event.addListener(map, 'keydown', function(e) {
    //     var keyboardEvent = e.keyboardEvent,
    //         keyCode = keyboardEvent.keyCode || keyboardEvent.which;
    //
    //     var ESC = 27;
    //
    //     if (keyCode === ESC) {
    //         keyboardEvent.preventDefault();
    //         menuLayer.hide();
    //     }
    // });

    naver.maps.Event.addListener(map, 'mousedown', function(e) {
        menuLayer.hide();
    });

    // function setMarkerAndInfo(e){
    //     var coordHtml = 'Point: ' + readlist[0].txt_cn + '<br />';
    //
    //     menuLayer.show().css({
    //         left: e.offset.x-22,
    //         top: e.offset.y-90,
    //         borderRadius:20
    //     }).html(coordHtml);
    // };
}
function setData(List){

    List.forEach(function (item){
        let itLocation = new naver.maps.LatLng(item.txt_loc_lat,item.txt_loc_lng);
        var marker = new naver.maps.Marker({
            map: map,
            position: itLocation,
            icon:{
                content:['<div class=infoWin style="background-color:#FF9F9F">' +
                    '<div style ="font-weight: bold;font-size:18px">'+item.txt_nm+'</div>'+ // 제목
                    '<div style ="font-weight: normal;font-size:14px">'+item.txt_date+'</div>'+
                    '</div>'

                ].join('')
            }
        });
        // 게시글 정보창 띄우기
//         var infowindow = new naver.maps.InfoWindow({
//             maxWidth: 500,
//             backgroundColor: "#eee",
//             borderColor: "#FFFFFF",
//             borderWidth: 5,
//             anchorSize: new naver.maps.Size(30, 30),
//             anchorSkew: true,
//             anchorColor: "#eee",
//             pixelOffset: new naver.maps.Point(0, -10)
//         });
//
//
        // infowindow.setContent([
        //             '<div class=infoWin style="background-color: #808080">' +
        //                 '<div style ="font-weight: bold;font-size:17px">'+item.txt_nm+'</div>'+ // 제목
        //                  '<div style ="font-weight: normal;font-size:13px">'+item.txt_date+'</div>'+
        //                     '</div>'
        //
        //         ].join(''));

        // 게시글 네비바에 띄우기
        naver.maps.Event.addListener(marker, "click", function(e) {

            infoWindow.close();


            $("#send").hide();
            $("#infoForm").show();
            // $("#sub").css("background-color", "yellow");

            $("#txtPic").val(item.txt_pic);  // 사진 첨부방법?
            $("#latiVal2").val(item.txt_loc_lat);
            $("#longiVal2").val(item.txt_loc_lng);
            $("#txtTitle").html(" <strong>" + item.txt_nm + "</strong>");
            $("#txtContent").html(item.txt_cn);
            $("#txtDate").html(item.txt_date);

            // // 클릭한 곳으로 센터&줌
            // map.setZoom(16);
            // map.setCenter(new naver.maps.LatLng(e.latitude, e.longitude));

            //infowindow.open(map, marker);
        });

        //infowindow.open(map, marker);
    });
};
function searchCoordinateToAddress(latlng) {

    infoWindow.close();

    naver.maps.Service.reverseGeocode({
        coords: latlng,
        orders: [
            naver.maps.Service.OrderType.ADDR,
            naver.maps.Service.OrderType.ROAD_ADDR
        ].join(',')
    }, function(status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
            return alert('Something Wrong!');
        }

        var items = response.v2.results,

            htmlAddresses = [];

        for (var i=0, ii=items.length, item, addrType; i<ii; i++) {
            item = items[i];
            address = makeAddress(item) || '';
            addrType = item.name === 'roadaddr' ? '[도로명 주소]' : '[지번 주소]';

            htmlAddresses.push((i+1) +'. '+ addrType +' '+ address);
        }

        infoWindow.setContent([
            '<div class=infoWin style="background-color:#808080" >',
            '<h4 style="margin-top:5px;">검색 좌표</h4>',
            htmlAddresses.join('<br />'),
            '</div>'
        ].join('\n'));
        infoWindow.open(map, latlng);

        getData(address);


    });
}

function getData(target){
    $.ajax({
        method: "GET",
        url: "https://dapi.kakao.com/v2/local/search/keyword.json?y=" + lati.toString() + "&x=" + longi.toString(),
        //url: "https://dapi.kakao.com/v2/local/search/keyword.json",
        data: {query: target},
        headers: {Authorization: "KakaoAK 00b285e6c72f581d9c2f16bb7c585100"}
    })
        .done(function (msg) {
            for (var i=0, ii=SearchMarkerList.length; i<ii; i++) {
                SearchMarkerList[i].setMap(null);
            }
            SearchMarkerList = [];

            console.log(msg);
            try {
                msg.documents.forEach(function (item){
                    var marker = new naver.maps.Marker({
                        map: map,
                        position: new naver.maps.LatLng(item.y, item.x), // la : y / lng : x
                    });

                    SearchMarkerList.push(marker);
                });

                // 인포창 표시
                $("#latiVal").val(msg.documents[0].y);
                $("#longiVal").val(msg.documents[0].x);
                $("#locationTitle").html(" <strong>" + msg.documents[0].place_name + "</strong>");
                $("#category_name").html("<li>" + "category: " + msg.documents[0].category_name + "</li>");
                $("#place_url").html("<li>" + "url: " + msg.documents[0].place_url + "</li>");
                $("#phone").html("<li>" + "phone: " + msg.documents[0].phone + "</li>");
                $("#distance").html("<li>" + "현위치로 부터 " + msg.documents[0].distance + "m 거리에 있습니다." + "</li>");

                //화면크기에서 벗어난 장소일 때만 이동됨
                var moveLatLon = new naver.maps.LatLng(msg.documents[0].y, msg.documents[0].x);
                map.panTo(moveLatLon);
                map.setZoom(16);

            } catch (error) {
                $("#locationTitle").html(" <strong>*정보 없음*</strong>");
                $("#category_name").html("<li>" + "" + "</li>");
                $("#place_url").html("<li>" + "" + "</li>");
                $("#phone").html("<li>" + "" + "</li>");
                $("#distance").html("<li>" + "" + "</li>");
            }
        });
}

function makeAddress(item) {
    if (!item) {
        return;
    }

    var name = item.name,
        region = item.region,
        land = item.land,

        isRoadAddress = name === 'roadaddr';

    var sido = '', sigugun = '', dongmyun = '', ri = '', rest = '';

    if (hasArea(region.area1)) {
        sido = region.area1.name;
    }

    if (hasArea(region.area2)) {
        sigugun = region.area2.name;
    }

    if (hasArea(region.area3)) {
        dongmyun = region.area3.name;
    }

    if (hasArea(region.area4)) {
        ri = region.area4.name;
    }

    if (land) {
        if (hasData(land.number1)) {
            if (hasData(land.type) && land.type === '2') {
                rest += '산';
            }

            rest += land.number1;

            if (hasData(land.number2)) {
                rest += ('-' + land.number2);
            }
        }

        if (isRoadAddress === true) {
            if (checkLastString(dongmyun, '면')) {
                ri = land.name;
            } else {
                dongmyun = land.name;
                ri = '';
            }

            if (hasAddition(land.addition0)) {
                rest += ' ' + land.addition0.value;
            }
        }
    }

    return [sido, sigugun, dongmyun, ri, rest].join(' ');
}

function hasArea(area) {
    return !!(area && area.name && area.name !== '');
}

function hasData(data) {
    return !!(data && data !== '');
}

function checkLastString (word, lastString) {
    return new RegExp(lastString + '$').test(word);
}

function hasAddition (addition) {
    return !!(addition && addition.value);
}

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    crd = pos.coords;
    lati = crd.latitude;
    longi = crd.longitude;

    setMyMap();
};

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
};


navigator.geolocation.getCurrentPosition(success, error, options);
