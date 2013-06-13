class TournamentPlayer < ActiveRecord::Base
  attr_accessible :player_id, :tournament_id
  belongs_to :player
  belongs_to :tournament
end
