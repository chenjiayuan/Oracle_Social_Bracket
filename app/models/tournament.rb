class Tournament < ActiveRecord::Base
  attr_accessible :name, :winner_id, :active, :winner_name

  validates :name, presence: true, uniqueness: true

  has_many :players, through: :tournament_players
  has_many :tournament_players, dependent: :destroy
  has_many :matches
  belongs_to :winner, class_name: Player, foreign_key: :winner_id


  before_save do |t|
    if winner_id != 0
      t.winner_name = Player.find(winner_id).full_name
    end
  end

  def setup_playoff

    if !self.matches.any? && self.players.any?

      self.active = true
      p = self.players
      p_length = p.length
      p.sort! { |a, b| a.skill <=> b.skill }
      round = 1
      playoff_matches = 0

      # Loop to see how many playoff matches there should be
      # This is equal to the number of players - the next lowest power of 2
      # Ex: 15 - 8 = 7 playoff matches

      while !power_of_2?(p_length)
        p_length = p_length - 1
        playoff_matches = playoff_matches + 1
      end

      # Set the tail to the end of the array
      # Set the head to just enough players to fill out the playoff matches
      # Give a temp variable so we can use playoff_matches later

      leftover = p.length - (playoff_matches * 2)
      true_length = p.length - playoff_matches
      filler_matches = true_length - playoff_matches
      p_tail = 1
      p_head = 0
      temp = playoff_matches

      # Set up the playoff round
      # Need to fix logic for this though. Right now, it just puts in players according to skill top to bottom.

      while temp > 0
        first_player = p[p_tail]
        second_player = p[p_head]

        if filler_matches > 0
          m = Match.create({round: round, tournament_id: self.id, name: ""})
          self.matches << m
        end

        m = Match.create({player1_id: first_player.id, player2_id: second_player.id, round: round, tournament_id: self.id, name: ""})
        self.matches << m

        p_tail = p_tail + 2
        p_head = p_head + 2
        temp = temp - 1
        filler_matches = filler_matches - 1

      end

      # Keep putting in the filler matches

      if temp == 0 && filler_matches != 0
        while filler_matches > 0
          m = Match.create({round: round, tournament_id: self.id, name: ""})
          self.matches << m
          filler_matches = filler_matches - 1
        end
      end

      # Set up the other rounds

      round = round + 1
      if p.length > (true_length + true_length/2)
        spare_players = true_length - (p.length - true_length)
      else
        spare_players = p.length - true_length
      end
      rounds = Math.log2(true_length) + 1
      match_count = (true_length) / 2
      p_tail = p.length - 1
      p_head = p.length - leftover

      # Iterate through the rest of the players left in the players array and add them according to skill

      while round <= rounds
        temp = match_count
        while temp > 0
          if p_head == p_tail || spare_players > 0 
            first_player = p[p_tail]
            m = Match.create({player1_id: first_player.id, round: round, tournament_id: self.id, name: ""})
            self.matches << m
            p_tail = p_tail - 1
          elsif p_head < p_tail
            first_player = p[p_tail]
            second_player = p[p_head]
            m = Match.create({player1_id: first_player.id, player2_id: second_player.id, round: round, tournament_id: self.id, name: ""})
            self.matches << m
            p_tail = p_tail - 1
            p_head = p_head + 1              
          else
            m = Match.create({round: round, tournament_id: self.id, name: ""})
            self.matches << m
          end
          temp = temp - 1
          spare_players = spare_players - 1
        end
        round = round + 1
        match_count = match_count / 2
      end

      self.save

    end
    
  end

  def setup_normal
    if !self.matches.any? && self.players.any?

      players = self.players
      players_length = players.length
      self.active = true
      players.sort! { |a, b| a.skill <=> b.skill }
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

        m = Match.create({player1_id: first_player.id, player2_id: second_player.id, round: round, tournament_id: self.id, name: ""})
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
          m = Match.create({round: round, tournament_id: self.id, name: ""})
          self.matches << m
          match_count = match_count + 1
          temp = temp - 1
        end
        round = round + 1
        bro = bro / 2
      end

      self.save

    end
  end

  def start_tournament
    if power_of_2?(self.players.length)
      setup_normal
    else
      setup_playoff
    end
  end

  def power_of_2?(number)
    return true if number == 1
    return false if number == 0 || number % 2 != 0
    power_of_2?(number / 2)
  end

end
