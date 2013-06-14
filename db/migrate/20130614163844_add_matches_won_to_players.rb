class AddMatchesWonToPlayers < ActiveRecord::Migration
  def change
    add_column :players, :matches_won, :integer, default: 0
  end
end
