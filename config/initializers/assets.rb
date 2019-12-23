module WikiHd
    class Engine < Rails::Engine
        Rails.application.config.assets.paths << root.join("app", "assets", "stylesheets" ,"wiki_hd")
        Rails.application.config.assets.paths << root.join("app", "assets", "javascripts" ,"wiki_hd")
        Rails.application.config.assets.paths << root.join("app", "assets", "images" ,"wiki_hd")
        Rails.application.config.assets.precompile += %w( wiki_hd/main.css )
    end
end