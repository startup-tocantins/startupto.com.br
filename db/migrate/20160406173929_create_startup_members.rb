class CreateStartupMembers < ActiveRecord::Migration
  def change
    create_table :startup_members do |t|
      t.references :startup, index: true, foreign_key: true
      t.references :member, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
