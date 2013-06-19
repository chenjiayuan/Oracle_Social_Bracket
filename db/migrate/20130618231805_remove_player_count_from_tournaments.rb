class RemovePlayerCountFromTournaments < ActiveRecord::Migration
  def up
    remove_column :tournaments, :player_count
  end

  def down
    add_column :tournaments, :player_count, :integer
  end
end
