class PlayersController < ApplicationController

  def index

  end

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
