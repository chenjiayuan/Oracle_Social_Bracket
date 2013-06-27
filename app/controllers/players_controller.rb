class PlayersController < ApplicationController

  def index
    @players = Player.paginate(page: params[:page], per_page: 15)
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

    if params[:tournament_id]
      @tournament = Tournament.find(params[:tournament_id])
    end


  end

=begin
  def create

    @player = Player.new(params[:player])
    if params[:tournament_id]
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
=end

  def create

    if params[:player][:tournament_id].present?
      tournament_id = params[:player].delete :tournament_id
      tournament = Tournament.find(tournament_id)
    end

    @player = Player.new(params[:player])

    if @player.save
      if tournament
        tournament.players << @player
        tournament.save
        redirect_to tournament
      else
        redirect_to player_path(@player)
      end
    else
      if tournament
        session[:player_errors] = @player.errors
        redirect_to new_tournament_player_path(tournament)
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

    if params[:tournament_id]
      @tournament = Tournament.find(params[:tournament_id])
    end

    @player = Player.find(params[:id])

  end

  def edit
    if params[:tournament_id]
      @tournament = Tournament.find(params[:tournament_id])
    end

    @player = Player.find(params[:id])
  end

  def update

    if params[:player][:tournament_id].present?
      tournament_id = params[:player].delete :tournament_id
      tournament = Tournament.find(tournament_id)
    end

    @player = Player.find(params[:id])

    if @player.update_attributes(params[:player])
      flash[:success] = "Player updated"
      if tournament
        tournament.players.find(@player.id).save
        redirect_to tournament_players_path(tournament)
      else
        redirect_to @player
      end
    else
      flash[:error] = "That didn't work :("
      if tournament
        redirect_to tournament_players_path(tournament)
      else
        render 'new'
      end
    end
  end

end
