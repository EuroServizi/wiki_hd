require_dependency "wiki_hd/application_controller"

module WikiHd
  class HdController < ApplicationController
      #before_action :set_user, only: [:index]
      before_action :set_class_var
      
      @@applicazioni = nil
      @@hash_applicazioni = {}
      
     
      # GET /index
      def index
        # applicazioni = AuthHub::ClientiApplicazione.all
        # @applicazioni = applicazioni.to_a.map{|app| {'value' => app[:ID], 'label' => app[:DESCRIZIONE]} }.to_json unless applicazioni.blank? 
        # @@hash_applicazioni = {}
        # applicazioni.to_a.map{|app| {'value' => app[:ID], 'label' => app[:DESCRIZIONE]} }.each{|el_app| @@hash_applicazioni[el_app['value']] = el_app['label'] }
        @applicazioni = @@applicazioni
    
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
          soluzione = (nuova_risoluzione_param[:id].blank? ? Soluzione.new : Soluzione.find(nuova_risoluzione_param[:id]) )
          soluzione.problematica = nuova_risoluzione_param[:problematica]
          soluzione.testo_soluzione = nuova_risoluzione_param[:testo_soluzione]
          soluzione.set_tags(nuova_risoluzione_param[:tags])
          soluzione.auth_hub_user = @current_user
          soluzione.auth_hub_clienti_applicazione = AuthHub::ClientiApplicazione.find(nuova_risoluzione_param[:applicazione]) unless nuova_risoluzione_param[:applicazione].blank?
          soluzione.save
          @esito['stato'] = 'ok'
          @esito['id_soluzione'] = soluzione.id
        rescue => exc
          logger.error exc.message
          logger.error exc.backtrace.join("\n")
          @esito['stato'] = 'ko'
          @esito['errore'] = exc.message
        end
        
        respond_to do |format|
          format.json { render json: @esito }
        end
      end

      # POST /cancella_risoluzione
      def cancella_risoluzione
        @esito = {}
        begin
          soluzione = Soluzione.find(cancella_risoluzione_param[:id])
          unless soluzione.blank?
            soluzione.destroy
          end
          @esito['stato'] = 'ok'
          @esito['id_soluzione'] = soluzione.id
        rescue => exc
          logger.error exc.message
          logger.error exc.backtrace.join("\n")
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

      def view_risoluzione
          begin
            id_risoluzione = risoluzioni_corrente_params[:id]
            risoluzione = Soluzione.find(id_risoluzione)
            unless risoluzione.blank?
              @esito = {
                stato: 'ok',
                problematica: risoluzione.problematica,
                testo_soluzione: risoluzione.testo_soluzione,
                tags: (risoluzione.tags.count > 0 ? risoluzione.tags.map{|tag| tag.nome}.join(", ") : []),
                applicazione: (risoluzione.auth_hub_clienti_applicazione.blank? ? '' : risoluzione.auth_hub_clienti_applicazione.DESCRIZIONE )
              }
            else
              @esito = {
                stato: 'ko',
                errore: "Risoluzione non presente con id #{id_risoluzione}"
              }
            end
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

      def tags
          begin
            totale_righe = Tag.count
            lista = Tag.order(nome: :asc)
            lista_per_tabella = (lista.blank? ? [] : lista.to_a.map{|riga| {'value' => riga[:id], 'label' => riga[:nome] } })
            @esito = {
              stato: 'ok',
              totale_righe: totale_righe,
              lista_per_tabella: lista_per_tabella,
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

      def set_class_var
        if @@applicazioni.blank?
          applicazioni ||= AuthHub::ClientiApplicazione.all
          #var di classe per select
          @@applicazioni = applicazioni.to_a.map{|app| {'value' => app[:ID], 'label' => app[:DESCRIZIONE]} }.to_json unless applicazioni.blank? 
          #hash delle applicazioni, chiave = id della tabella e valore = descrizione
          if @@hash_applicazioni.blank?  
            applicazioni.to_a.map{|app| {'value' => app[:ID], 'label' => app[:DESCRIZIONE]} }.each{|el_app| @@hash_applicazioni[el_app['value']] = el_app['label'] } unless applicazioni.blank?
          end
        end
      end

      private

      def nuova_risoluzione_param
        params.require(:hd).permit(:problematica, :testo_soluzione, :applicazione, :id, :tags => [])
      end

      def risoluzioni_params
        params.permit(:page, :sizePerPage)
      end

      def risoluzioni_corrente_params
        params.permit(:id)
      end

      def cancella_risoluzione_param
        params.permit(:id)
      end

  end
end
