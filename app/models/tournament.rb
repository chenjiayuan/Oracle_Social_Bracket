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
=begin
      used_players = []

      players.each do |p|
        i = 0
        j = players.length - 1



      end
=end
    end
  end

  def start_tournament
    setup_matches
  end
end
