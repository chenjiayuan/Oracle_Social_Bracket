class Player < ActiveRecord::Base
  attr_accessible :email, :first_name, :last_name, :skill, :matches_won, :full_name

  before_save do |user|
    user.email = email.downcase
    user.full_name = "#{first_name} #{last_name}"
  end

  validates :first_name, presence: true, length: { minimum: 2 }
  validates :last_name, presence: true, length: { minimum: 2 }
  validates :full_name, uniqueness: true
  validates :skill, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive: false }

  has_many :tournaments, through: :tournament_players
  has_many :tournament_players, dependent: :destroy

  def full_name
    "#{self.first_name} #{self.last_name}"
  end

  def increment_wins
    self.matches_won = self.matches_won + 1
    self.save(validate: false)
  end

end
