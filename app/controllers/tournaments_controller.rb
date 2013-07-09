class TournamentsController < ApplicationController

  def new
    @tournament = Tournament.new
  end

  def index
    @tournament = Tournament.new
    @tournaments = Tournament.paginate(page: params[:page], per_page: 5).order("created_at DESC")
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

  def winner
    @tournament = Tournament.find(params[:id])
    @match = Match.find(params['match-id'])
    @player = Player.find(params['player-id'])
    match_number = params['match-number'].to_i
    round = params['round-id'].to_i

    if(match_number % 2 == 0)
      next_match = match_number / 2
    else
      next_match = (match_number + 1) / 2
    end

    if @tournament.matches.where(round: round + 1).any?
      next_match_number = next_match + (@tournament.matches.where(round: 1).count)
      next_match_id = next_match_number + @tournament.matches.first.id - 1
    else
      next_match_id = 0
    end


    @match.winner_id = @player.id
    @player.matches_won = @player.matches_won + 1
    winner_name = "#{@player.first_name}" + " " + "#{@player.last_name}"
    @match.save
    @player.save

    if next_match_id != 0

      @next_match = Match.find(next_match_id)

      if(@next_match.player1_id == 0)
        @next_match.player1_id = @player.id
        next_match_player = 1
      else
        @next_match.player2_id = @player.id
        next_match_player = 2
      end

      @next_match.save

    else
      @tournament.winner_id = @player.id
      @tournament.active = false
      @tournament.save
    end

    respond_to do |format|
      format.json {
        render json: {
            player: @player,
            match: @match,
            tournament_id: @tournament.id,
            winner_name: winner_name,
            next_match_id: next_match_id,
            next_match_player: next_match_player,
            next_match_number: next_match_number
        }
      }

    end
  end

  def add_new_tournament

    @tournament = Tournament.new(name: params['name'])

    respond_to do |format|
      format.json {
        if @tournament.save
          render json: {
              tournament: @tournament,
          }
        else
          render json: @tournament.errors, status: :forbidden
        end

      }

    end
  end

end