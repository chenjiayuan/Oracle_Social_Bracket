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
    @player = Player.new(params[:player])
    if params.has_key?(:tournament_id)
      @tournament = Tournament.find(params[:tournament_id])
      if @player.save
        redirect_to tournament_player_path(@tournament, @player)
      else
        redirect_to new_tournament_player_path(@tournament)
      end
    else
      if @player.save
        redirect_to @player
      else
        render 'new'
      end
    end

  end

  def destroy
    Player.find(params[:id]).destroy
    flash[:success] = "Player deleted!"
    redirect_to players_path
  end

  def show
    @player = Player.find(params[:id])
  end
end
