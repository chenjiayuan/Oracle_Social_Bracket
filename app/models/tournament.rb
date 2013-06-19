class Tournament < ActiveRecord::Base
  attr_accessible :name, :winner_id, :active

  before_save { |t| t.player_count = 0 }

  validates :name, presence: true, uniqueness: true

  has_many :players, through: :tournament_players
  has_many :tournament_players, dependent: :destroy

end
