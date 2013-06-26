class Match < ActiveRecord::Base
  attr_accessible :player1_id, :player2_id, :prev_player1_id, :prev_player2_id, :round, :tournament_id, :winner_id

  has_many :players, through: :player_matches
  has_many :player_matches, dependent: :destroy
end
