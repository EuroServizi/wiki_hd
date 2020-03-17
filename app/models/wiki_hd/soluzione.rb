module WikiHd
  class Soluzione < ApplicationRecord
      belongs_to :auth_hub_user, class_name: 'AuthHub::User'
      has_many :soluzioni_tags
      has_many :tags, through: :soluzioni_tags #crea realazione n a n con tabella di raccordo
      belongs_to :auth_hub_clienti_applicazione, class_name: 'AuthHub::ClientiApplicazione', optional: true

      # t.string :problematica
      # t.text :testo_soluzione
      # t.references :auth_hub_users, foreign_key: true
      # t.references :wiki_hd_tags, foreign_key: true
      # t.references :auth_hub_clienti_applicazione
  
      before_destroy :rimuovi_associazioni_tags

      #passo array di tags e collego a tabella tags
      def set_tags(array_tags)
        unless array_tags.blank?
          tags_da_salvare = []
          #qui arriva un array che contiene o id di tag presenti o il nome del nuovo tag
          array_tags.each{|tag|
            tag = tag.strip
            tag_pres = WikiHd::Tag.where("id = ?", tag.to_i)
            if tag_pres.size == 1
              tags_da_salvare << tag_pres.first
            else
              nuovo_tag = WikiHd::Tag.new
              nuovo_tag.nome = tag
              nuovo_tag.save
              tags_da_salvare << nuovo_tag
            end
          }
          self.tags = tags_da_salvare
        end
      end

      #cancello associazione coi tags presenti. I tags restano!
      def rimuovi_associazioni_tags
          self.tags.delete_all
      end
  
  end
end
