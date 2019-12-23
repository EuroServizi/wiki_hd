module WikiHd
  class Soluzione < ApplicationRecord
      belongs_to :user, class_name: 'AuthHub::User'
      has_and_belongs_to_many :tag
      belongs_to :clienti_applicazione, class_name: 'AuthHub::ClientiApplicazione'
  end
end
