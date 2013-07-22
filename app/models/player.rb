class Player < ActiveRecord::Base
  attr_accessible :email, :first_name, :last_name, :skill, :matches_won, :full_name

  before_save do |user|
    user.email = email.downcase
    user.full_name = "#{first_name} #{last_name}"
  end

  validates :first_name, presence: true, length: { minimum: 2 }
  validates :last_name, presence: true, length: { minimum: 2 }
  validates :skill, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive: false }
  # validates_uniqueness_of :first_name, scope: [:last_name], message: "Name has already been taken"
  #validates_uniqueness_of :full_name

  validate :player_unique_name

  has_many :tournaments, through: :tournament_players
  has_many :tournament_players, dependent: :destroy
  belongs_to :match


  def first_name=(value)
    write_attribute(:full_name, "#{value} #{self.last_name}")
  end

  def last_name=(value)
    write_attribute(:full_name, "#{self.first_name} #{value}")
  end

  def full_name
    "#{self.first_name} #{self.last_name}"
  end

  def increment_wins
    self.matches_won = self.matches_won + 1
    self.save(validate: false)
  end

  private

  def player_unique_name
  	if self.class.exists?(first_name: first_name, last_name: last_name)
  		errors.add :name, 'has already been taken'
  	end
  end

end
