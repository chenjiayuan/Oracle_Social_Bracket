class RemovePrevPlayersFromMatches < ActiveRecord::Migration
  def up
    remove_column :matches, :prev_player1_id
    remove_column :matches, :prev_player2_id
  end

  def down
    add_column :matches, :prev_player1_id, :integer
    add_column :matches, :prev_player2_id, :integer
  end
end
