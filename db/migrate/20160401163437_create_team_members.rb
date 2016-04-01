class CreateTeamMembers < ActiveRecord::Migration
  def change
    create_table :team_members do |t|
      t.string :nome
      t.string :email
      t.string :linkedin
      t.string :role

      t.timestamps null: false
    end
  end
end
