class Match < ActiveRecord::Base
  attr_accessible :player1_id, :player2_id, :round, :tournament_id, :winner_id
  belongs_to :player1, class_name: Player, foreign_key: :player1_id
  belongs_to :player2, class_name: Player, foreign_key: :player2_id
  belongs_to :winner, class_name: Player, foreign_key: :winner_id
end
