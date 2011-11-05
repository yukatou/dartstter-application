// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$(function() {

  live_data = null;
  twitter_token = null;

  var showLoading = function() {
    $.mobile.pageLoading();  
  } 

  var hiddenLoading = function() {
    $.mobile.pageLoading(true);  
  }

  $.ajaxSetup({
    type: 'post',
    dataType: 'json',
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
      alert(XMLHttpRequest.responseText); 
    },
    beforeSend: showLoading,
    complete: hiddenLoading,
  });

  var init = function() {
    live_data = $.cookie('live_data');
    twitter_token = $.cookie('twitter_token');
    if(live_data) {
      $.ajax( {
        url: '/darts_live/profile',
        data: { id: live_data }, 
        success: function(data) {
          var html = "<p><span class='red bold'>Rt."+data.rating+"</span>"
                   + " <span>"+data.cardname+"</span></p>"
                   + "<p><span>"+data.homeshop +"</span></p>"
                   + "<p><span>from <a href='http://www.dartslive.jp/' target='_blank'>DARTSLIVE</a></span></p>";
          $("#live_data").html(html); 
        },
        beforeSend: function() {},
        complete: function() {},
      }); 
    }
    else {
      var html = "<p class='red center'><a href='setting'>こちらで設定してください</a></p>";
      $("#live_data").html(html); 
    }

    $('#statsBtn').bind('click', getStats);
    $('#awardBtn').bind('click', getAward);
    $('#countupBtn').bind('click', getCountup);
  }

  $("#refresh").click(function() {
    location.reload();
  });

  $("#back").click(function() {
    history.back();
  });

  encrypt = function(arr) {
    return $.base64Encode(arr.join(":"));
  }
  decrypt = function(data) {
    return $.base64Decode(data).split(":");
  }

  var getStats = function() {
    if(live_data) {
      $.ajax( {
        url: '/darts_live/stats',
        data: { id: live_data }, 
        success: function(data) {
          var contents = "【今日の結果】01: "+data.zero1_ave+"("+data.zero1_res+") pts "
                    + "Cri: "+data.cri_ave+"("+data.cri_res+") mark";
          $('#tweetContents').val(contents);
          $.mobile.changePage('#tweet', 'slide');
        },
      }); 
    }
    else {
      alert("カード情報が入力されていません");
    }
  };

  var getAward = function() {
    if(live_data) {
      $.ajax( {
        url: '/darts_live/award',
        data: { id: live_data }, 
        success: function(data) {
          var contents = "【今日のアワード】";
          $.each(data, function(key, val) {
            if(val > 0) 
              contents += key + ":" + val + " ";
          });
          $('#tweetContents').val(contents);
          $.mobile.changePage('#tweet', 'slide');
        },
      }); 
    }
    else {
      alert("カード情報が入力されていません");
    }
  };

  var getCountup = function() {

    if(live_data) {
      $.ajax( {
        url: '/darts_live/countup',
        data: { id: live_data}, 
        success: function(data) {
          var contents = "【今日のCOUNT UP】最高:"+data.max+" 平均:"+data.ave;
          $('#tweetContents').val(contents);
          $.mobile.changePage('#tweet', 'slide');
        },
      }); 
    }
    else {
      alert("カード情報が入力されていません");
    }
  };

  init();
});  
