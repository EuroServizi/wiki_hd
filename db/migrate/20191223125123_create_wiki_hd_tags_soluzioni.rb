class CreateWikiHdTagsSoluzioni < ActiveRecord::Migration[5.2]
  def change

    create_table :wiki_hd_tags do |t|
      t.string :nome
      t.timestamps
    end

    add_index :wiki_hd_tags, :nome, unique: true

    create_table :wiki_hd_soluzioni do |t|
      t.string :problematica
      t.text :testo_soluzione
      t.references :auth_hub_user, foreign_key: true
      #t.references :wiki_hd_tags, foreign_key: true, index: true
      t.references :auth_hub_clienti_applicazione #, foreign_key: true
      t.timestamps
    end

    create_table :wiki_hd_soluzioni_tags do |t|
      #nome dei campi usati nel modello, a cui viene concatenato _id
      t.belongs_to :soluzione
      t.belongs_to :tag
      t.timestamps
    end

  end


end
