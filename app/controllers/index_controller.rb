# coding:utf-8

require 'cgi'
require 'httpclient'

class IndexController < ApplicationController
  TAG = "#dartstter" 

  def index# {{{
    @title = Settings.application_name
    #unless request.smart_phone? && request.mobile?
      @timeline = [] 
      if res = getTweetList()
        result = JSON.parse(res)
        i = 0
        result.each do |row|
          @timeline[i] = Hash.new
          @timeline[i][:id] = row["id"]
          @timeline[i][:text] = row["text"].gsub(/(http:\/\/[\x21-\x7e]+)/, '<a href="\\1">\\1</a>').gsub(/@(\S+)/, '<a href="http://twitter.com/\\1">@\\1</a>').gsub(/(#[\x21-\x7e]+)/, '<span class="hash">\\1</span>')
          @timeline[i][:screen_name] = row["user"]["screen_name"]
          @timeline[i][:user_id] = row["user"]["id"]
          @timeline[i][:profile_image_url] = row["user"]["profile_image_url"]
          @timeline[i][:created_at] = Time.parse(row["created_at"]).strftime("%Y/%m/%d %H:%M:%S")
          i += 1
        end
      end
    #end
  end
# }}}
  def setting# {{{
    @title = "各種設定"
  end
# }}}
  def help# {{{
    @title = "ヘルプ"
  end
# }}}
  def get_tweet# {{{
    @title = "ツイート"
  end
# }}}
  def tweet# {{{
    redirect_to :action => "get_tweet" if params[:tweetContents].empty?
    contents = params[:tweetContents] + " #{TAG}"
    token = cookies[:twitter_token]
    begin
      exec_tweet(token, contents)
      flash[:message] = "ツイートしました。表示されるまで少し間を置いてください"
      redirect_to :action => "get_tweet"
      return
    rescue => e
      flash[:error_message] = e.message
      redirect_to :action => "get_tweet"
    end
  end
# }}}
  private
  def exec_tweet(token, contents)# {{{
    response = HTTPClient.new.post(
      "http://#{request.host_with_port}/twitter/tweet", 
      :body => {'twitter_token'=>token, 'contents'=>contents},
      :header => {"Accept"=>"application/json"}
    )
    if response.status == 200
      response.body 
    else
      raise response.body
    end
  end
# }}}
  def getTweetList #{{{
    rubytter = Rubytter.new()
    result = rubytter.search(TAG)
    result.to_json
  end
 # }}}

end
