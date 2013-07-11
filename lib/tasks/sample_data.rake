namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    128.times do |n|
      firstname  = Faker::Name.first_name
      firstname = "#{firstname}#{n+1}"
      lastname = Faker::Name.last_name
      lastname = "#{lastname}#{n+1}"
      email = "example-#{n+1}@example.com"
      skill = rand(10) + 1
      Player.create!(first_name: firstname,
                   last_name: lastname,
                   email: email,
                   skill: skill)
    end
  end
end