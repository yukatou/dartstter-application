$(function() {

  var init = function() {
    $("#resetBtn").bind("click", reset);
    $("#statsBtn").bind("click", getLiveStats);
    $("#tweetBtn").bind("click", tweet);
    $("#awardBtn").bind("click", getLiveAward);
    $("#countupBtn").bind("click", getLiveCountup);
    getProfile();
  };


  var getProfile = function() {
    if(live_data) {
      $.ajax( {
        url: '/darts_live/profile',
        data: { id: live_data }, 
        success: function(data) {
          var html = "<p><span id='rating'>Rt."+data.rating+"</span>"
                   + "<span id='cardname'>"+data.cardname+"</span>"
                   + "<span id='homeshop'>("+data.homeshop +")</span></p>"
                   + "<p><span>from <a href='http://www.dartslive.jp/' target='_blank'>DARTSLIVE</a></span></p>";
          $("#live_data").html(html); 
        },
        beforeSend: function() {},
        complete: function() {},
      }); 

    } else {

      var html = "<p><a href='setting'>こちらで設定してください</a></p>";
      $("#live_data").html(html); 
    }
  };


  var reset = function() {
    $("#tweetContents").val("");
  };

  var tweet = function() {
    var contents = $("#tweetContents").val();
    var twitter_token = $.cookie('twitter_token');
    if(!contents) {
      alert("ツイート内容が入力されていません");
      return;
    }
    if(twitter_token) {
      contents += " #dartstter";
      $.ajax( {
        url: '/twitter/tweet',
        data: {twitter_token:twitter_token, contents:contents}, 
        success: function(data) {
          alert("ツイートしました！");
        },
      });
    } 
    else {
      alert("Twitterのログインができてないようです");
    }
  };

  var getLiveStats = function() {
    if(live_data) {
      $.ajax( {
        url: '/darts_live/stats',
        data: { id: live_data }, 
        success: function(data) {
          var tweet = "【今日のスタッツ】01: "+data.zero1_ave+"("+data.zero1_res+") pts "
                    + "Cri: "+data.cri_ave+"("+data.cri_res+") mark";
          $("#tweetContents").val(tweet);
        },
      }); 
    }
    else {
      alert("カード情報が入力されていません");
    }
  };

  var getLiveAward = function() {
    if(live_data) {
      $.ajax( {
        url: '/darts_live/award',
        data: { id: live_data }, 
        success: function(data) {
          var tweet = "【今日のアワード】";
          $.each(data, function(key, val) {
            if(val > 0) 
              tweet += key + ":" + val + " ";
          });
          $("#tweetContents").val(tweet);
        },
      }); 
    }
    else {
      alert("カード情報が入力されていません");
    }

  };

  var getLiveCountup = function() {
    if(live_data) {
      $.ajax( {
        url: '/darts_live/countup',
        data: { id: live_data }, 
        success: function(data) {
          var tweet = "【今日のCOUNT UP】最高:"+data.max+" 平均:"+data.ave;
          $("#tweetContents").val(tweet);
        },
      }); 
    }
    else {
      alert("カード情報が入力されていません");
    }
  };

  init();
});
