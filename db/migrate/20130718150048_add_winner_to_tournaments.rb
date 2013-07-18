class AddWinnerToTournaments < ActiveRecord::Migration
  def change
    add_column :tournaments, :winner_name, :string
  end
end
