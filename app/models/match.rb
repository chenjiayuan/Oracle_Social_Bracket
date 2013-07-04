class Match < ActiveRecord::Base
  attr_accessible :player1_id, :player2_id, :prev_player1_id, :prev_player2_id, :round, :tournament_id, :winner_id
  belongs_to :player1, class_name: Player, foreign_key: :player1_id
  belongs_to :player2, class_name: Player, foreign_key: :player2_id
end
