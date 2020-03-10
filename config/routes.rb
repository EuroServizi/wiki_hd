WikiHd::Engine.routes.draw do

    get 'lista_shd' => 'hd#lista_shd', :as => :lista_shd
    get 'nuova_shd' => 'hd#nuova_shd', :as => :nuova_shd
    get 'cerca_shd' => 'hd#cerca_shd', :as => :cerca_shd

    get 'nuova_risoluzione' => 'hd#nuova_risoluzione', :as => :nuova_risoluzione
    get 'risoluzioni' => 'hd#risoluzioni', :as => :risoluzioni

    post 'salva_risoluzione' => 'hd#salva_risoluzione', :as => :salva_risoluzione

    resources :soluzioni

    get '/' => 'hd#index', :as => :index_hd

end
