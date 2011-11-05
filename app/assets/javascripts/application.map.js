(function($){

  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var map;
  var currentLocation;
  var geocoder;

  $(function(){

    var cardno;
    var passwd;

    var init = function() {
      if(initCheckId()) {
        initMap();
      }
    };

    var initCheckId = function() {
      cardno = $.cookie('live_cardno');
      passwd = $.cookie('live_passwd');

      if(!cardno || !passwd) {
        alert("カードデータを入力してください");
        return false;
      }
      return true;
    };

    var initMap = function() {
        geocoder = new google.maps.Geocoder();
        navigator.geolocation.getCurrentPosition(function(position) {
          currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          var options = {
            zoom: 12, 
            center: currentLocation,
            //disableDefaultUI: true,
            navigationControl: true,
            navigationControlOptions: {
              style: google.maps.NavigationControlStyle.SMALL
            },
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          map = new google.maps.Map($("#map_canvas").get(0), options);
          map.setCenter(currentLocation);
          directionsDisplay.setMap(map);
          //setMarker(currentLocation);
          createPintypeMarkerIcon(
            {map:map, position:currentLocation, title:'現在地'},
            {}//fillColor:"FF0000", letter:"99"}
          ); 
          setImadko();
        });
    };


    var setMarker = function(position) {
        var marker = new google.maps.Marker({
            position: position,
            map: map, 
            title: "Current Location",
        });
        return marker;
    };
    
    var removeMarker = function() {


    }

    var getCodeAddress = function(address) {
      if (geocoder) {
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            return results[0].geometry.location;
          } 
          else {
            alert("Geocode was not successful for the following reason: " + status);
          }
        });
      }
    };

    var setInfoWindow = function(marker, contentString) {

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });

    };

    var onError =  function(e) {
      alert('code: '    + e.code    + '\n' +
            'message: ' + e.message + '\n');
    }

    
    var setCurrentLocation = function() {
      navigator.geolocation.getCurrentPosition(function(position) {
          currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          map.setCenter(currentLocation);
          marker.setPosition(currentLocation);
      }, onError);
    }

    var setImadko = function() {
      $.ajax( {
        url: '/darts_live/map',
        data: { data:getdata([cardno, passwd])},
        success: function(data) {
          $.each(data, function(key, row) {
            var shopLocation  = new google.maps.LatLng(row.geocode.lat, row.geocode.lng);

            var num = row.users.length;
            if(0 <= num && num <= 1) color = "4169E1";
            else if(2 <= num && num <= 4) color = "008000";
            else if(5 <= num  && num <= 9) color = "FF8C00";
            else  color = "FF0000";

            var marker = createPintypeMarkerIcon(
                {map:map, position:shopLocation, title:row.shopname},
                {fillColor:color, letter:""+num, letterColor:"FFFFFF"}
              ); 
            var shop_url = "http://www.dartslive.jp/kt/search/shop.jsp?si=" + row.sid;
            var contentString = '<div id="user_info_window">'
                              + '<h3><a href="'+ shop_url +'" target="_blank">'+ row.shopname +'</a></h3>'
                              + '<p>'+ row.address +'</p>'
                              + '<ul>';
            $.each(row.users, function(key, user) {
              contentString += '<li>' + user + '</li>';
            });

            contentString += '</ul></div>';
            setInfoWindow(marker, contentString);
          });
        },
      }); 
    }

    var createPintypeMarkerIcon = function (mopts, opts) {
      opts = (opts)? opts : {};
      var fillColor = opts.fillColor || "FF776D";
      var letter = escapeUserText_(opts.letter) || "";
      var letterColor = opts.letterColor || "000000";
      var icon = opts.icon || "";
      var pinStyle = "pin";
      var starFillColor = (opts.pinStyle==="star" && !opts.starFillColor)?"FFFF00":opts.starFillColor;
      var label = (letter||icon)?(letter||icon):"+";
      switch(opts.pinStyle){
        case "star": pinStyle = "pin_star"; break;
        case "left": pinStyle = "pin_sleft"; break;
        case "right": pinStyle = "pin_sright"; break;
        default: pinStyle = "pin";
      }
      var pinProgram = (icon) ? "_icon":"_letter";
      var baseUrl = "http://chart.apis.google.com/chart?chst=d_map_xpin"+pinProgram+"&chld=";
      var iconUrl = baseUrl+""+pinStyle+"|"+(label)+"|"+fillColor;
      if(label==="+") iconUrl += "|"; else if(letter) iconUrl += "|"+letterColor;
      if(opts.pinStyle==="star") iconUrl += "|"+starFillColor;
      if(isEmpty(opts)===false) mopts.icon=iconUrl;
      if(isEmpty(opts)===false && mopts.flat!==false){
        var shadowUrl = (pinStyle === "pin"||opts.pinStyle==="star")? "http://maps.google.com/mapfiles/shadow50.png":"http://chart.apis.google.com/chart?chst=d_map_xpin_shadow&chld="+pinStyle;
        var anc = (pinStyle === "pin"||opts.pinStyle==="star")? new google.maps.Point(10, 34):new google.maps.Point(14, 35)
        var shadow = new google.maps.MarkerImage(shadowUrl,
        new google.maps.Size(37, 34), new google.maps.Point(0,0), anc);
        mopts.shadow = shadow;
      }
      var m = new google.maps.Marker(mopts);
      return m;
      function escapeUserText_(text) {
        if (text === undefined) {
        return null;
        }
        text = text.replace(/@/g, "@@");
        text = text.replace(/\\/g, "@\\");
        text = text.replace(/'/g, "@'");
        text = text.replace(/\[/g, "@[");
        text = text.replace(/\]/g, "@]");
        return encodeURIComponent(text);
      };
      function isEmpty(hash) {
        for ( var i in hash ) return false;
        return true;
      };
    };

    init();

  });

})(jQuery)
