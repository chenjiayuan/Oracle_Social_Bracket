class Match < ActiveRecord::Base
  attr_accessible :player1_id, :player2_id, :round, :tournament_id, :winner_id, :name

  belongs_to :player1, class_name: Player, foreign_key: :player1_id
  belongs_to :player2, class_name: Player, foreign_key: :player2_id
  belongs_to :winner, class_name: Player, foreign_key: :winner_id

  validates_uniqueness_of :name

  after_commit do |m|
    if(!m.name || m.name.empty?)
      m.name = "Match-#{m.id}"
      m.save
    end

  end

  def players
    players = []
    players << self.player1 if self.player1
    players << self.player2 if self.player2
    players
  end

  private
    def unique_players
      errors.add :players, "The match needs to have two unique players" if self.player1_id == self.player2_id
    end

end
