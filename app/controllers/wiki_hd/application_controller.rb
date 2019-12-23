module WikiHd
  class ApplicationController < ::ApplicationController
    protect_from_forgery with: :exception
    before_action :authenticate_user!






    
      private

      #Metodo che fa l'autenticazione
      def authenticate_user!
        if user_signed_in?
          if @current_user.stato != 'confermato'
              signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
              #cancello sessioni di openweb
              if signed_out
                session.keys.each{ |chiave_sessione|
                  next if chiave_sessione == "_csrf_token"
                  session.delete(chiave_sessione.to_sym)
                }
                messaggio = "Utente non confermato dall'amministratore"
                redirect_to auth_hub.new_user_session_path, notice: messaggio
                return
              end
          end
          
          return true
        else
          messaggio = nil
          #controllo se arrivo da form di login
          if request.post? and !params['user'].blank?
            @current_user = warden.authenticate!(:scope => :user)
            #controllo se lo stato è confermato
            if @current_user.stato == 'confermato'
              return true
            else
              signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
              #cancello sessioni di openweb
              if signed_out
                session.keys.each{ |chiave_sessione|
                  next if chiave_sessione == "_csrf_token"
                  session.delete(chiave_sessione.to_sym)
                }
                messaggio = "Utente non confermato dall'amministratore"
              end
            end
          end
          messaggio ||= "Si prega di accedere per vedere la pagina!"
          redirect_to auth_hub.new_user_session_path, notice: messaggio
        end
      end


  end
end
