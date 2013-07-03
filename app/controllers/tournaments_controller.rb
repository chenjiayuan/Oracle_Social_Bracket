class TournamentsController < ApplicationController

  def new
    @tournament = Tournament.new
  end

  def index
    @tournaments = Tournament.paginate(page: params[:page], per_page: 5)
  end

  def show
    @tournament = Tournament.find(params[:id])
  end

  def edit
    @tournament = Tournament.find(params[:id])
  end

  def create
    @tournament = Tournament.new(params[:tournament])

    respond_to do |format|
      if @tournament.save
        format.html {
          flash[:success] = "Tournament created!"
          redirect_to @tournament
        }
        format.js
      else
        format.html {
          render 'new'
        }
        format.js
      end
    end

  end

  def start_tournament

    @tournament = Tournament.find(params[:id])
    @players = @tournament.players
  end

=begin
  def create
    @tournament = Tournament.new(params[:tournament])
    if @tournament.save
      if request.xhr?
        render @tournament
      else
        flash[:notice] = "Tournament created!"
        render 'index'
      end

    else
      if request.xhr?
        render status: 403
      else
        flash[:error] = "Tournament could not be created."
        render 'index'
      end
    end
  end

=end

  def destroy

    Tournament.find(params[:id]).destroy
    flash[:success] = "Tournament deleted!"
    redirect_to tournaments_path

  end

=begin
  def remove_from_tournament
    t = Tournament.find(params[:tournament_id])
    p = Player.find(params[:id])

    t.players.reject! { |player| player.id == p.id }
    t.save
    redirect_to tournament_players_path(t)
  end
=end


end