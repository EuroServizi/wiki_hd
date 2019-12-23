module WikiHd
  class Engine < ::Rails::Engine
    isolate_namespace WikiHd
    require 'config' #carica gemma per i Settings da file yml
    
    #aggiunto per usare migration a livello di suite openweb
    initializer :append_migrations do |app|
      unless app.root.to_s.match(root.to_s)
        config.paths["db/migrate"].expanded.each do |p|
          app.config.paths["db/migrate"] << p
        end
      end
    end

    config.paths.add "lib", eager_load: true


  end
end
