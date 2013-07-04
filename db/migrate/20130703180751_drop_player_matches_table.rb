class DropPlayerMatchesTable < ActiveRecord::Migration
  def up
    drop_table :player_matches
  end
end
