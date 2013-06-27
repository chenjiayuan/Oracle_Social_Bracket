class Tournament < ActiveRecord::Base
  attr_accessible :name, :winner_id, :active

  validates :name, presence: true, uniqueness: true

  has_many :players, through: :tournament_players
  has_many :tournament_players, dependent: :destroy
  has_many :matches

  def setup_matches
    if !self.matches.any? && self.players.any?
      players = self.players
      players.sort! { |a, b| a.skill <=> b.skill }
      used_players = 0
      players_length = players.length
      half_players_length = players_length / 2
      round = 1



        i = 0
        j = players_length - 1

      # round 1 loop

        while i <= half_players_length
          first_player = players[i]
          second_player = players[j]

          m = Match.create({player1_id: first_player.id, player2_id: second_player.id, round: 1, tournament_id: self.id})
          self.matches << m

          i = i + 1
          j = j - 1
        end


    end
  end

  def start_tournament
    # setup_matches
  end
end
