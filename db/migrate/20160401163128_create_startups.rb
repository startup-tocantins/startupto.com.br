class CreateStartups < ActiveRecord::Migration
  def change
    create_table :startups do |t|
      t.string :name
      t.text :description
      t.string :logo
      t.string :category
      t.string :stage
      t.string :country
      t.string :state
      t.string :city
      t.string :site
      t.string :contact
      t.string :latitude
      t.string :longitude
      t.string :group
      t.date :fundation

      t.timestamps null: false
    end
  end
end
