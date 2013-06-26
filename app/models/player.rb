class Player < ActiveRecord::Base
  attr_accessible :email, :first_name, :last_name, :skill

  before_save { |user| user.email = email.downcase }

  validates :first_name, presence: true, uniqueness: true, length: { minimum: 2 }
  validates :last_name, presence: true, uniqueness: true, length: { minimum: 2 }
  validates :skill, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive: false }


  has_many :tournaments, through: :tournament_players
  has_many :tournament_players, dependent: :destroy
  has_many :matches, through: :player_matches
  has_many :player_matches, dependent: :destroy
end
