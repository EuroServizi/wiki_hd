require_dependency "wiki_hd/application_controller"

module WikiHd
  class WikiHdController < ApplicationController
      #before_action :set_user, only: [:index]

      # GET /index
      def index
        
        
        respond_to do |format|
          format.html
          format.js
        end
      end


  end
end
