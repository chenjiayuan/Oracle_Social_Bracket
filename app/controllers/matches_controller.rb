class MatchesController < ApplicationController

  def index
    @matches = Match.where(tournament_id: 0)..order("created_at DESC").paginate(page: params[:page], per_page: 15)
  end

  def new
    @match = Match.new
  end

  def show
    @match = Match.find(params[:id])
  end

  def verdict
    @match = Match.find(params['match-id'])
    @player = Player.find(params['player-id'])

    if(@match.player1_id == @player.id)
      @loser = @match.player2
    else
      @loser = @match.player1
    end

    @match.winner = @player
    @player.increment_wins

    @match.save

    respond_to do |format|
      format.json {
         render json: {
             player: @player,
             match: @match,
             winner_name: @player.full_name,
             loser_name: @loser.full_name
         }
      }
    end
  end
end
