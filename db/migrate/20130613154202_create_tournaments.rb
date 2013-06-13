class CreateTournaments < ActiveRecord::Migration
  def change
    create_table :tournaments do |t|
      t.string :name
      t.integer :player_count, default: 0

      t.timestamps
    end
  end
end
