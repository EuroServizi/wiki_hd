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
  
  
  
    #passo array di tags e collego a tabella tags
    def set_tags(array_tags)
      unless array_tags.blank?
        array_tags.each{|tag|
          tag = tag.strip
          tag_pres = WikiHd::Tag.where("nome = ?", tag)
          if tag_pres.size == 1
            self.tags << tag_pres
          else
            nuovo_tag = WikiHd::Tag.new
            nuovo_tag.nome = tag
            nuovo_tag.save
            self.tags << nuovo_tag
          end
        }
      end
    end
  
  end
end