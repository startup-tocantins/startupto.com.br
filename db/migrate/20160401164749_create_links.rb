class CreateLinks < ActiveRecord::Migration
  def change
    create_table :links do |t|
      t.string :kind
      t.string :url
      t.string :description
      t.references :startup, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
