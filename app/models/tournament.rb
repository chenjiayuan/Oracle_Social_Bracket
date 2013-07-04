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
      players_length = players.length
      round = 1
      rounds = Math.log2(players_length)
      match_count = 0

      i = 0
      j = players_length - 1

      # round 1 loop

      temp = players_length / 2

      while temp > 0
        first_player = players[i]
        second_player = players[j]

        m = Match.create({player1_id: first_player.id, player2_id: second_player.id, round: round, tournament_id: self.id})
        self.matches << m
        match_count = match_count + 1
        temp = temp - 1
        i = i + 1
        j = j - 1
      end

      round = round + 1
      bro = match_count / 2

      while round <= rounds
        temp = bro
        while temp > 0
          m = Match.create({round: round, tournament_id: self.id})
          self.matches << m
          match_count = match_count + 1
          temp = temp - 1
        end
        round = round + 1
        bro = bro / 2
      end

      # self.save

    end
  end


  def start_tournament
    setup_matches
  end
end
