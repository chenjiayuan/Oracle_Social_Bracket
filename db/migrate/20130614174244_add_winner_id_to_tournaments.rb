class AddWinnerIdToTournaments < ActiveRecord::Migration
  def change
    add_column :tournaments, :winner_id, :integer, default: 0
  end
end
