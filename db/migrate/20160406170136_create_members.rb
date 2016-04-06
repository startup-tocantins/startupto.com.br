class CreateMembers < ActiveRecord::Migration
  def change
    create_table :members do |t|
      t.string :nome
      t.string :email
      t.string :linkedin
      t.string :role

      t.timestamps null: false
    end
  end
end
