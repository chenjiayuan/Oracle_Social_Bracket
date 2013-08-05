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

      # Initialize the head and tail to first two players
      # Give a temp variable so we can use playoff_matches later

      leftover = p.length - (playoff_matches * 2)
      true_length = p.length - playoff_matches
      iterations = Math.log2(true_length) - 2
      filler_matches = true_length - playoff_matches
      p_tail = 1
      p_head = 0
      counter = playoff_matches
      move_length = true_length/4
      pma = [] # Playoff matches array
      pma_index = true_length - 1
      switch = false

      # Set up the playoff round
      
      while counter > 0
        first_player = p[p_tail]
        second_player = p[p_head]

        if counter == playoff_matches
          pma << Match.new({round: round, tournament_id: self.id, name: ""})
          pma << Match.new({player1_id: first_player.id, player2_id: second_player.id, round: round, tournament_id: self.id, name: ""})
        elsif switch == true
          pma[pma_index] = Match.new({player1_id: first_player.id, player2_id: second_player.id, round: round, tournament_id: self.id, name: ""})
          if pma_index == 3
            pma_index = 2
          elsif pma_index == 2
            pma_index = true_length - 4
            move_length = 4
            switch = false
          elsif pma_index + move_length >= true_length
            iterations = iterations - 1
            if iterations == 0
              pma_index = 3
            else
              pma_index = pma_index + 2
              move_length = 4
              switch = false
            end
          else
            pma_index = pma_index + move_length
            if iterations > 0
              move_length = true_length/4
            elsif iterations < 0
              move_length = 4
            end
          end
        else
          pma[pma_index] = Match.new({player1_id: first_player.id, player2_id: second_player.id, round: round, tournament_id: self.id, name: ""})
          if pma_index - move_length <= 3 || pma[pma_index - move_length] != nil
            switch = true
            iterations = iterations - 1
            if iterations == 0
              pma_index = 3
            elsif iterations < 0
              move_length = move_length/2
              pma_index = pma_index + move_length
              move_length = 4
            else
              pma_index = pma_index - 2
              move_length = 2 * (Math.log2(true_length) - 2)
            end
          else
            pma_index = pma_index - move_length
          end
        end

        if p_head == 0
          p_tail = (playoff_matches * 2) - 1
          p_head = p_head + 2
        else
          p_tail = p_tail - 1
          p_head = p_head + 1
        end

        counter = counter - 1

      end

      # If only one playoff match, create space for the filler matches to be placed later

      if playoff_matches == 1 && p.length > 3
        pma[filler_matches] = nil
      end

      # Reverse the order of the weaker playoff matches past the first if more than 2
      # This way, the seeding for playoff matches is lined up correctly with non-playoff matches

      if playoff_matches > 2
        check_front = 3
        check_end = true_length - 1
        while check_front < check_end
          if pma[check_front] != nil && pma[check_end] != nil
            temp = pma[check_front]
            pma[check_front] = pma[check_end]
            pma[check_end] = temp
            check_front = check_front + 2
            check_end = check_end - 2
          else
            check_front = check_front + 2
          end
        end
      end

      # Replace all nils in the array with blank matches

      # m = Match.create({round: round, tournament_id: self.id, name: ""})
      # pma.map! { |x| x == nil ? m : x }

      # Assign the playoff matches array's content to our tournament

      while pma.length > 0
        if pma[0] == nil
          self.matches << Match.new({round: round, tournament_id: self.id, name: ""})
          pma.delete_at(0)
        else
          self.matches << pma.shift
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
      match_array = []

      # Iterate through the rest of the players left in the players array and add them according to skill

      while round <= rounds
        temp = match_count
        while temp > 0
          if p_head == p_tail || spare_players > 0 
            first_player = p[p_tail]
            match_array << Match.new({player1_id: first_player.id, round: round, tournament_id: self.id, name: ""})
            p_tail = p_tail - 1
          elsif p_head < p_tail
            first_player = p[p_tail]
            second_player = p[p_head]
            match_array << Match.new({player1_id: first_player.id, player2_id: second_player.id, round: round, tournament_id: self.id, name: ""})
            p_tail = p_tail - 1
            p_head = p_head + 1              
          else
            m = Match.new({round: round, tournament_id: self.id, name: ""})
            if round > 2
              self.matches << m
            else
              match_array << m
            end
          end
          temp = temp - 1
          spare_players = spare_players - 1
        end

        # Logic for seeding the non-playoff players

        if round == 2
          head = 0
          tail = match_array.length - 1
          counter = 1

          if head == tail
            self.matches << match_array[head]
          else
            while counter <= (match_array.length / 2)
              self.matches << match_array[head]
              self.matches << match_array[tail]
              if counter == 1
                head = (tail / 2) + 1
                tail = head - 1
              else
                head = head + 1
                tail = tail - 1
              end
              counter = counter + 1
            end
          end
        end

        round = round + 1
        match_count = match_count / 2
      end

      self.matches.each { |m|
        m.save
      }

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
      match_array = []

      i = 0
      j = players_length - 1

      # round 1 loop

      temp = players_length / 2

      while temp > 0
        first_player = players[j]
        second_player = players[i]

        m = Match.new({player1_id: first_player.id, player2_id: second_player.id, round: round, tournament_id: self.id})
        match_array << m
        match_count = match_count + 1
        temp = temp - 1
        i = i + 1
        j = j - 1
      end

      head = 0
      tail = match_array.length - 1
      counter = 1

      if head == tail
        self.matches << match_array[head]
      else
        while counter <= (match_array.length / 2)
          self.matches << match_array[head]
          self.matches << match_array[tail]
          if counter == 1
            head = (tail / 2) + 1
            tail = head - 1
          else
            head = head + 1
            tail = tail - 1
          end
          counter = counter + 1
        end
      end

      round = round + 1
      bro = match_count / 2

      while round <= rounds
        temp = bro
        while temp > 0
          m = Match.new({round: round, tournament_id: self.id})
          self.matches << m
          match_count = match_count + 1
          temp = temp - 1
        end
        round = round + 1
        bro = bro / 2
      end

      self.matches.each { |m|
        m.save
      }

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