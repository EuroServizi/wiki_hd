class CreateWikiHdTags < ActiveRecord::Migration[5.2]
  def change
    create_table :wiki_hd_tags do |t|
      t.string :nome

      t.timestamps
    end
  end
end
