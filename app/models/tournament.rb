class Tournament < ActiveRecord::Base
  attr_accessible :name, :winner_id, :active

  validates :name, presence: true, uniqueness: true

  has_many :players, through: :tournament_players
  has_many :tournament_players, dependent: :destroy
  has_many :matches

end
