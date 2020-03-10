module WikiHd
    
    #Modello di raccordo
    class SoluzioneTag < ApplicationRecord
        belongs_to :soluzione
        belongs_to :tag
    end
end
