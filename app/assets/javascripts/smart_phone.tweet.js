$(function() {

  var init = function() {
    $("#tweetBtn").bind("click", tweet);
  };

  var tweet = function() {
    var contents = $("#tweetContents").val();
    if(!contents) {
      alert("ツイート内容が入力されていません");
      return;
    }else {
      contents += " #dartstter";
    }
    if(twitter_token) {
      $.ajax( {
        url: '/twitter/tweet',
        data: {twitter_token:twitter_token, contents:contents}, 
        success: function(data) {
          alert("ツイートしました！");
        },
      });
    } 
    else {
      alert("Twitter認証がまだできてないようです");
    }
  }
  
  $('#tweet').live('pagecreate',function(event){
    init();
  });
});
