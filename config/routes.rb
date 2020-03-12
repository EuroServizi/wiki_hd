WikiHd::Engine.routes.draw do

    get 'lista_shd' => 'hd#lista_shd', :as => :lista_shd
    get 'nuova_shd' => 'hd#nuova_shd', :as => :nuova_shd
    get 'cerca_shd' => 'hd#cerca_shd', :as => :cerca_shd

    get 'nuova_risoluzione' => 'hd#nuova_risoluzione', :as => :nuova_risoluzione
    get 'risoluzioni' => 'hd#risoluzioni', :as => :risoluzioni
    get 'risoluzioni/:id', to: 'hd#view_risoluzione', as: :view_risoluzione
    get 'tags' => 'hd#tags', :as => :tags

    post 'salva_risoluzione' => 'hd#salva_risoluzione', :as => :salva_risoluzione

    resources :soluzioni
    resources :risoluzioni

    get '/' => 'hd#index', :as => :index_hd

end
