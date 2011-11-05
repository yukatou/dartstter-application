class AuthException < Exception; end
class NotFoundException < Exception; end

require 'time'
require 'base64'
require 'uri'
require 'net/http'
require 'json'
require 'base64'
require 'nkf'
require 'kconv'

class ApplicationController < ActionController::Base
  protect_from_forgery

  protected
  def error_handle(e, code=500)
    error_log(e, code) if(500 <= code) 
    render :text => e.message, :status => code 
  end 

  def error_log(e, code)
    str = sprintf("%d:%s (%s)", code, e.message, e.backtrace[0])
    logger.error(str)
    if Settings.alert
      Notice.notice(str).deliver
    end
  end
end
