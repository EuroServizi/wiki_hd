class CreateWikiHdSoluziones < ActiveRecord::Migration[5.2]
  def change
    create_table :wiki_hd_soluziones do |t|
      t.string :problematica
      t.text :testo_soluzione

      t.timestamps
    end
  end
end
