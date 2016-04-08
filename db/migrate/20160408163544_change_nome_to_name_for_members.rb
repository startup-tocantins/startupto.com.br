class ChangeNomeToNameForMembers < ActiveRecord::Migration
  def change
    rename_column :members, :name, :name
  end
end
