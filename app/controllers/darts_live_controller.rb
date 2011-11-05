# coding: utf-8

class DartsLiveController < ApplicationController
 
  def check # {{{
    response = HTTPClient.new.post(
      "http://api.dartstter.net/profile.json", 
      :body => {'id'=> params[:id]},
      :header => {"Accept"=>"application/json"}
    )   
    render :text => response.body, :status => response.status
  end
# }}}

  def profile # {{{
    response = HTTPClient.new.post(
      "http://api.dartstter.net/profile.json", 
      :body => {'id'=> params[:id]},
      :header => {"Accept"=>"application/json"}
    )   
    render :text => response.body, :status => response.status
  end
# }}}

 def stats # {{{
    response = HTTPClient.new.post(
      "http://api.dartstter.net/stats.json", 
      :body => {'id'=> params[:id]},
      :header => {"Accept"=>"application/json"}
    )   
    render :text => response.body, :status => response.status
  end
# }}}

 def award # {{{
    response = HTTPClient.new.post(
      "http://api.dartstter.net/award.json", 
      :body => {'id'=> params[:id]},
      :header => {"Accept"=>"application/json"}
    )   
    render :text => response.body, :status => response.status
  end
# }}}

 def countup # {{{
    response = HTTPClient.new.post(
      "http://api.dartstter.net/countup.json", 
      :body => {'id'=> params[:id]},
      :header => {"Accept"=>"application/json"}
    )   
    render :text => response.body, :status => response.status
  end
# }}}
 
end
