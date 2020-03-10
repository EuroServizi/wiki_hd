require_dependency "wiki_hd/application_controller"

module WikiHd
  class HdController < ApplicationController
      #before_action :set_user, only: [:index]

     
      # GET /index
      def index
        applicazioni = AuthHub::ClientiApplicazione.all
        @applicazioni = applicazioni.to_a.map{|app| {'value' => app[:ID], 'label' => app[:DESCRIZIONE]} }.to_json unless applicazioni.blank? 
        @@hash_applicazioni = {}
        applicazioni.to_a.map{|app| {'value' => app[:ID], 'label' => app[:DESCRIZIONE]} }.each{|el_app| @@hash_applicazioni[el_app['value']] = el_app['label'] }
       
        respond_to do |format|
          format.html
          format.js
        end

      end

      # GET /lista_shd
      def lista_shd
        respond_to do |format|
          format.html
          format.js
        end
      end


      # GET /cerca_shd
      def cerca_shd
        respond_to do |format|
          format.html
          format.js
        end
      end

      # GET /nuova_risoluzione
      def nuova_risoluzione
        respond_to do |format|
          format.html
          format.js
        end
      end

      # POST /salva_risoluzione
      def salva_risoluzione
        @esito = {}
        begin
          soluzione = Soluzione.new
          soluzione.problematica = nuova_risoluzione_param[:problematica]
          soluzione.testo_soluzione = nuova_risoluzione_param[:testo_soluzione]
          soluzione.set_tags(nuova_risoluzione_param[:tags])
          soluzione.auth_hub_user = @current_user
          soluzione.auth_hub_clienti_applicazione = AuthHub::ClientiApplicazione.find(nuova_risoluzione_param[:applicazione]) unless nuova_risoluzione_param[:applicazione].blank?
          soluzione.save
          @esito['stato'] = 'ok'
          @esito['id_soluzione'] = soluzione.id
        rescue => exception
          logger.error exception.message
          logger.error exception.backtrace.join("\n")
          @esito['stato'] = 'ko'
          @esito['errore'] = exc.message
        end
        
        respond_to do |format|
          format.json { render json: @esito }
        end
      end

      # GET /risoluzioni  -> lista delle risoluzioni

      def risoluzioni
          begin
            size_per_page = risoluzioni_params[:sizePerPage].to_i
            page = risoluzioni_params[:page].to_i
            page = 1 if page == 0
            totale_righe = Soluzione.count
            totale_pagine = totale_righe.to_f / size_per_page
            totale_pagine = (totale_pagine.modulo(1) > 0 ? totale_pagine.truncate + 1 : totale_pagine.truncate ) #se ho decimali ho un'altra pagina
            limit = size_per_page
            offset = ((page - 1) * size_per_page)
            lista = Soluzione.order(id: :desc).limit(limit).offset(offset)
            lista_per_tabella = (lista.blank? ? [] : lista.to_a.map{|riga| {'id' => riga[:id], 'problematica' => riga[:problematica], 'applicazione' => @@hash_applicazioni[riga[:auth_hub_clienti_applicazione_id]] } })
            @esito = {
              stato: 'ok',
              totale_righe: totale_righe,
              totale_pagine: totale_pagine,
              lista_per_tabella: lista_per_tabella,
              pag_corrente: risoluzioni_params[:page].to_i
            }
          rescue => exception
            logger.error exception.message
            logger.error exception.backtrace.join("\n")
            @esito = {
              stato: 'ko',
              errore: exception.message
            }
          end
          
          
          respond_to do |format|
            format.json { render json: @esito }
          end
      end

      private

      def nuova_risoluzione_param
        params.require(:hd).permit(:problematica, :testo_soluzione, :applicazione, :tags => [])
      end

      def risoluzioni_params
        params.permit(:page, :sizePerPage)
      end

  end
end
