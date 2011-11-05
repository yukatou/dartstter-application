$(function() {
  var expires = 365 * 3;
  var init = function() {
    initCheckLiveId();
    //initCheckTwitterOAuth();
    $("#resetDataBtn").bind("click", resetForm);
    $("#loginBtn").bind("click", checkLiveAccount);
  };

  var initCheckLiveId = function() {
    if(live_data)  {
      data = decrypt(live_data)
      $('#cardno').val(data[0]); 
      $('#passwd').val($.base64Decode(data[1])); 
    }
    else {
      $("#live_txt").css('color', 'red');
    }
  };

  var resetForm = function() {
    $('#cardno').val("");
    $('#passwd').val(""); 
  };

  var checkLiveAccount = function() {
    var cardno = $('#cardno').val();
    var passwd = $('#passwd').val(); 
    if(cardno && passwd) {
      passwd = $.base64Encode(passwd);
      $.ajax( {
        url: '/darts_live/check',
        data: { id: encrypt([cardno, passwd]) }, 
        success: function(data) {
          live_data = encrypt([cardno, passwd]);
          $.cookie('live_data', live_data, { expires:expires });
          $("#live_txt").css('color', '');
          alert("データの確認ができました。");
        },
      }); 
    }
    else {
      alert("入力情報が正しくありません。");
    }
    return false;
  };

  $('#setting').live('pagecreate',function(event, ui){
    init();
  });
});
