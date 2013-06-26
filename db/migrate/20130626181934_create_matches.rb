class CreateMatches < ActiveRecord::Migration
  def change
    create_table :matches do |t|
      t.integer :player1_id, default: 0
      t.integer :player2_id, default: 0
      t.integer :tournament_id, default: 0
      t.integer :winner_id, default: 0
      t.integer :round, default: 0
      t.integer :prev_player1_id, default: 0
      t.integer :prev_player2_id, default: 0

      t.timestamps
    end
  end
end
