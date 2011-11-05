$(function() {

  live_data = null;

  var showLoading = function() {
    $("#loading").css("display","inline");
  } 

  var hiddenLoading = function() {
    $("#loading").css("display","none");
  }

  $.ajaxSetup({
    type: 'post',
    dataType: 'json',
    beforeSend: function() {
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
      alert(XMLHttpRequest.responseText); 
    },
    beforeSend: showLoading,
    complete: hiddenLoading,
  });

  var init = function() {
    live_data = $.cookie('live_data');
  };


  $("#refresh").click(function() {
    location.reload();
  });

  $("#back").click(function() {
    history.back();
  });

  encrypt = function(arr) {
    return $.base64Encode(arr.join(":"));
  };
  decrypt = function(data) {
    return $.base64Decode(data).split(":");
  };



  init();

});  
