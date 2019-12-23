WikiHd::Engine.routes.draw do

    get 'index' => 'wiki_hd#index', :as => :index_hd

    resources :soluzioni

end
