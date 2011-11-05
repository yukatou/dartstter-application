$(function() {
  var init = function() {
    getTweet(); 
    //$("#refreshBtn").bind("click", getTweet);
    //$(".detailBtn").live("click", showDetail);
  }

  var showDetail = function() {
    var screen_name = $(this).text();
    var tweet_id = $(this).attr('rel');
    var user_id = $("#"+tweet_id+" .user_id").val();
    var text = $("#"+tweet_id+" .text").text();
    var time = $("#"+tweet_id+" .time").text();
    var image = $("#"+tweet_id+" .image").attr('src');

    $("#operate_"+tweet_id).toggle();
   // $('#reply_li .image').attr('src', image);
   // $('#reply_li .time').text(time);
   //  $('#reply_li .text').text(text);
   //  $('#reply_li .name').text(screen_name);
    //$('#reply_ul').listview('refresh');
    //$.mobile.changePage("#comment");
    
  }

  var getTweet = function() {
    key = localStorage['twitter_token'];
    $.ajax( {
      url: '/twitter/get_tweet_list',
      type: 'get',
      data: {key: key},  
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      beforeSend: function() {
        $.mobile.pageLoading();
      },
      success: function(data) {
        $.mobile.pageLoading(true);
        //$("#list").empty();

        $.each(data, function(i, item) {
          var html = "<li>"
                   + "<div style='float:left;'>"
                   + "<img src='"+item.profile_image_url+"' width~'50px' height='50px'/>"
                   + "</div>"
                   + "<div style='float:left; margin-left:10px;'>"
                   + "<h3>"+item.screen_name+"</h3>"
                   + "<p style=''>"+ item.created_at + "</p>"
                   + "</div>"
                   + "<p style='clear:both; white-space:normal;'>"+item.text+"</p>"
                  /* + "<input type='hidden' class='user_id' value='"+item.user_id+"' />"
                   + "<div style='display:none' id='operate_"+item.tweet_id+"'>"
                   + "<textarea></textarea><br />"
                   + "<input type='button' value='リツイート'/>"
                   + "<input type='button' value='フォローする'/>"
                   + "</div>"*/
                   + "</li>";

          $("#list").append(html);
          $('#list').listview('refresh');

        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
        $.mobile.pageLoading(true);
        alert(XMLHttpRequest.responseText); 
      },
    }); 
  };

  init();
});
