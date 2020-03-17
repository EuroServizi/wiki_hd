class AddWikiHdAllegato < ActiveRecord::Migration[5.2]
  def change

    create_table :wiki_hd_allegati do |t|
      t.string :nome
      t.string :dimensione
      t.belongs_to :soluzione
      t.timestamps
    end

  end
end
