module WikiHd
  class Tag < ApplicationRecord
    #t.string :nome
    has_many :soluzioni_tags
    has_many :soluzioni, through: :soluzioni_tags #crea realazione n a n con tabella di raccordo
  end
end
