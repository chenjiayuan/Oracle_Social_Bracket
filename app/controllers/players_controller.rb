class PlayersController < ApplicationController

  def index

  end

=begin
  def index
    if Tournament.all.any?
      @tournament = Tournament.all

      @tournament.each do |t|
        @player = t.pl
      end


    else
      redirect_to tournaments_path
    end

end

  end
=end

  def new
    @player = Player.new
  end

  def create
  end

  def destroy
    Player.find(params[:id]).destroy
    flash[:success] = "Player deleted!"
    redirect_to tournament_players_path
  end
end
