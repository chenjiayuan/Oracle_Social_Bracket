class MatchesController < ApplicationController

  def index
    @matches = Match.where(tournament_id: 0).order("created_at DESC").paginate(page: params[:page], per_page: 16)
    @match = Match.new
  end

  def new
    @match = Match.new
  end

  def show
    @match = Match.find(params[:id])
    @player = Player.new
    @count = @match.players.count

    add_breadcrumb "Matches", matches_path
    add_breadcrumb "<span>#{@match.name}</span>", match_path(@match)
  end

  def destroy
    Match.find(params[:id]).destroy
    flash[:success] = "Match deleted!"
    redirect_to matches_path
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

  def add_new_match
    @match = Match.new(name: params['name'])

    respond_to do |format|
      format.json {
        if @match.save
          render json: @match
        else
          render json: @match.errors, status: :forbidden
        end
      }
    end
  end

  def search_matches
    search = params['search_term']
    matches = Match.where(tournament_id: 0)

    if !search.empty?
      search_result = matches.where("name LIKE :test", test: "%#{search}%")
    else
      search_result = matches.order("created_at DESC").paginate(page: params[:page], per_page: 16)
    end

    players = Player.select('id, full_name').where('full_name like :test', test: "%#{search}%")
    ids = players.map(&:id)
    search_result = (search_result + matches.find_all_by_player1_id(ids) + matches.find_all_by_player2_id(ids) + matches.find_all_by_winner_id(ids)).uniq

    search_result = search_result.map do |s|
      if s.winner_id != 0
        winner_name = s.winner.full_name
      else
        winner_name = ""
      end

      player1_id = s.player1 ? s.player1_id : 0
      player2_id = s.player2 ? s.player2_id : 0
      player1_name = s.player1 ? Player.find(player1_id).full_name : ""
      player2_name = s.player2 ? Player.find(player2_id).full_name : ""

      {
          id: s.id,
          name: s.name,
          player1_id: player1_id,
          player2_id: player2_id,
          player1_name: player1_name,
          player2_name: player2_name,
          winner_name: winner_name,
          winner_id: s.winner_id
      }
    end

    respond_to do |format|
      format.json {
        render json: {
            search_result: search_result
        }
      }
    end
  end

  def start_match
    @match = Match.find(params[:id])

    add_breadcrumb "Matches", matches_path
    add_breadcrumb "#{@match.name}", match_path(@match)
    add_breadcrumb "<span>Bracket View</span>", start_match_path
  end

  def add_match_player
    @match = Match.find(params['match_id'].to_i)
    player_id = params['player_id'].to_i
    row = 0
    @player = Player.find(player_id)

    if @match.player1_id == 0
      @match.player1_id = player_id
      row = 1
    elsif @match.player2_id == 0
      @match.player2_id = player_id
      row = 2
    end
    @match.save

    respond_to do |format|
      format.json {
        render json: {
          match: @match,
          player: @player,
          row: row
        }
      }
    end
  end

  def remove_match_player
    @match = Match.find(params['match_id'])
    player_id = params['player_id'].to_i
    player = Player.find(player_id)

    if @match.player1_id == player_id
      @match.player1_id = 0
    elsif @match.player2_id == player_id
      @match.player2_id = 0
    end
    @match.save

    respond_to do |format|
      format.json {
        render json: {
            player: player
        }
      }
    end
  end

  def non_match_players

    @match = Match.find(params[:id])

    @non_match_players = Player.where("id NOT IN (?)", [@match.player1_id, @match.player2_id]).order('created_at DESC')

    respond_to do |format|
      format.json{
        render json: {
            players: @non_match_players
        }
      }
    end
  end

  def add_player_from_player_picker
    @match = Match.find(params['match_id'])
    @player = Player.find(params['player_id'])
    row = 0

    if @match.player1_id == 0
      @match.update_attribute('player1_id', params['player_id'])
      row = 1
    elsif @match.player2_id == 0
      @match.update_attribute('player2_id', params['player_id'])
      row = 2
    end

    respond_to do |format|
      format.json {
        render json: {
            match: @match,
            player: @player,
            row: row,
            player_count: @match.players.count
        }
      }
    end
  end

  def player_picker_search
    @match = Match.find(params['match_id'])
    search = params['search']

    if !search.empty?
      search_result = Player.where("id NOT IN (?)", [@match.player1_id, @match.player2_id])
                            .where("first_name LIKE :search OR last_name LIKE :search OR full_name LIKE :search OR skill LIKE :search", search: "%#{search}%")
                            .uniq
                            .reverse
    else
      search_result = Player.where("id NOT IN (?)", [@match.player1_id, @match.player2_id])
                            .order('created_at DESC')
    end

    respond_to do |format|
      format.json {
        render json: {
          search_result: search_result
        }
      }
    end
  end

  def update
    m = Match.find(params['match_id'])
    m.name = params['name']

    respond_to do |format|
      format.json {
        if m.save
          render json: {
              new_name: m.name
          }
        else
          render json: m.errors, status: :forbidden
        end
      }
    end
  end

end
