$:.push File.expand_path("lib", __dir__)

# Maintain your gem's version:
require "wiki_hd/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "wiki_hd"
  s.version     = WikiHd::VERSION
  s.authors     = ["fabiano"]
  s.email       = ["fabiano.pavan@soluzionipa.it"]
  s.homepage    = "http://start.soluzionipa.it/wiki_hd"
  s.summary     = "Wiki HD (Help Desk)"
  s.description = "Gestore della Wiki per Help Desk"
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  s.add_dependency "rails", "~> 5.2.0"
  s.add_dependency "mysql2", "= 0.4.10"
  s.add_dependency 'config' #PER USARE SETTINGS IN DEVISE.RB
end
