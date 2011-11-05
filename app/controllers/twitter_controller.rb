# coding: utf-8

require 'time'

class TwitterController < ApplicationController

  CONSUMER_KEY    = "I2glWi3oeyVnox3ocT3zTA"
  CONSUMER_SECRET = "fkbkNqF62WRWc8SpOU2akWfhgVmTQEnhK6ehimJV28"
  SITE_URL        = "http://api.twitter.com"

  def tweet# {{{
    twitter_token = params[:twitter_token]
    contents      = params[:contents]
    access_token, access_verifier = Base64.decode64(twitter_token).split(":")
    #unless token = Token.find(access_id)
    #  raise 'Not Found'
    #end
    #$B0lEYG'>Z$5$l$?8e$O(Baccess token$B$@$1$G%"%/%;%9=PMh$k(B
    oauth_token = OAuth::AccessToken.new(
      self.consumer,
      access_token,
      access_verifier
    )
    rubytter = OAuthRubytter.new(oauth_token)
    rubytter.update(contents)

    respond_to do |format|
      format.html {
        redirect_to :controller =>:index,  :action => :index
      } 
      format.json { 
        result = {:status => "success"}
        render :json => result.to_json
      } 
    end
  rescue => ex
    error_handle ex
  end
# }}}
  def oauth# {{{

    callback_url = "http://#{request.host_with_port}/twitter/callback"
    request_token = self.consumer.get_request_token(
      :oauth_callback => callback_url
    )   
    session[:request_token] = request_token.token
    session[:request_token_secret] = request_token.secret
    session[:oauth_id] = params[:oauth_id]
    redirect_to request_token.authorize_url
  end 
# }}}
  def callback# {{{
    consumer = self.consumer
    request_token = OAuth::RequestToken.new(
      consumer,
      session[:request_token],
      session[:request_token_secret]
    )   
    access_token = request_token.get_access_token(
      {},
      :oauth_token => params[:oauth_token],
      :oauth_verifier => params[:oauth_verifier]
    )
    response = consumer.request(
      :get,
      '/account/verify_credentials.json',
      access_token,
      { :scheme => :query_string }
    )
    case response
      when Net::HTTPSuccess
      @user_info = JSON.parse(response.body)
      unless @user_info['screen_name']
        flash[:notice] = "Authentication failed"
        redirect_to :controller =>:index,  :action => :index
      end
    else
      RAILS_DEFAULT_LOGGER.error "Failed to get user info via OAuth"
      flash[:notice] = "Authentication failed"
      redirect_to :controller =>:index,  :action => :index
      return
    end
    session[:request_token] = nil
    session[:request_token_secret] = nil

    token = Base64.encode64(access_token.token + ":" + access_token.secret)

    cookies[:twitter_token] = {:value => token, :expires => 12.months.from_now}

    flash[:message] = "twitter認証が完了しました。"
    redirect_to :controller =>:index,  :action => :index
  end# }}}
  protected
  def consumer# {{{
    OAuth::Consumer.new(
      CONSUMER_KEY,
      CONSUMER_SECRET,
      {:site => SITE_URL}
    )   
  end 
# }}}
  def oauth_save(uid, token)# {{{
    item = Token.new(:uid => uid)
    item.token = token
    item.save
  end# }}}
end
