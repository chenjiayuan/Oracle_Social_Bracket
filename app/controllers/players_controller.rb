include ActionView::Helpers::TextHelper

require 'will_paginate/array'


class PlayersController < ApplicationController
  before_filter :follow_crumbs
  skip_before_filter :follow_crumbs, only: :add_index

  # after_filter :render_pjax, :except => [:create, :destroy]

  def follow_crumbs
    if params[:tournament_id]
      add_breadcrumb "Tournaments", :tournaments_path
    elsif params[:match_id]
      add_breadcrumb "Matches", matches_path
    else
      add_breadcrumb "Players", :players_path
    end
  end

  def index

    @player = Player.new

    @players = Player.order("created_at DESC").paginate(page: params[:page], per_page: 16)

    if params[:tournament_id]
      @tournament = Tournament.find(params[:tournament_id])
    end

    # add_breadcrumb "Players Index", players_path

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

    if params[:match_id]
      @match = Match.find(params[:match_id])
    end

    if @tournament
      add_breadcrumb @tournament.name, tournament_path(@tournament)
      add_breadcrumb "<span>New Player</span>", new_tournament_player_path(@tournament), :title => "new!"
    elsif
      add_breadcrumb @match.name, match_path(@match)
      add_breadcrumb "<span>New Player</span>", new_match_player_path(@match), :title => "new!"
    else
      add_breadcrumb "<span>New Player</span>", new_player_path
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

    if params[:player][:match_id].present?
      match_id = params[:player].delete :match_id
      match = Match.find(match_id)
    end

    @player = Player.new(params[:player])

    if @player.save
      if tournament
        tournament.players << @player
        tournament.save
        flash[:success] = "Player created"
        redirect_to tournament_path(tournament)
      elsif match
        if match.player1_id == 0
          match.player1_id = @player.id
        elsif match.player2_id == 0
          match.player2_id = @player.id
        end
        match.save
        redirect_to match_path(match)
      else
        flash[:success] = "Player created"
        redirect_to player_path(@player)
      end
    else
      if tournament
        flash[:error] = "That didn't work :("
        session[:player_errors] = @player.errors
        redirect_to new_tournament_player_path(tournament)
      elsif match
        flash[:error] = "That didn't work :("
        session[:player_errors] = @player.errors
        redirect_to new_match_player_path(match)
      else
        render 'new'
      end
    end
  end


  def destroy

    if(params[:tournament_id])
      t = Tournament.find(params[:tournament_id])
      t.tournament_players.where(player_id: params[:id]).destroy_all
      flash[:success] = "Player removed from tournament"
      redirect_to tournament_path(t)

    elsif(params[:match_id])
      m = Match.find(params[:match_id])
      Player.find(params[:id]).destroy
      flash[:success] = "Player deleted!"
      redirect_to match_path(m)

    else
      Player.find(params[:id]).destroy
      flash[:success] = "Player deleted!"
      redirect_to players_path
    end

  end

  def show

    if params[:tournament_id]
      @tournament = Tournament.find(params[:tournament_id])
    end

    if params[:match_id]
      @match = Match.find(params[:match_id])
    end

    @player = Player.find(params[:id])

    @player_tournaments = @player.tournaments.order("created_at DESC").paginate(page: params[:tournaments_page], per_page: 1)
    @matches = Match.where("(player1_id = :p1id or player2_id = :p1id) and tournament_id = :tid", {p1id: 124, tid: 0}).order("created_at DESC").paginate(page: params[:matches_page], per_page: 1)

    if @tournament
      add_breadcrumb @tournament.name, tournament_path(@tournament)
      add_breadcrumb "<span>#{@player.first_name} #{@player.last_name}</span>", tournament_player_path(@tournament, @player)
    elsif @match
      add_breadcrumb @match.name, match_path(@match)
      add_breadcrumb "<span>#{@player.first_name} #{@player.last_name}</span>", match_player_path(@match, @player)
    else
      add_breadcrumb "<span>#{@player.first_name} #{@player.last_name}</span>", player_path(@player)
    end

  end

  def edit
    if params[:tournament_id]
      @tournament = Tournament.find(params[:tournament_id])
    end

    if params[:match_id]
      @match = Match.find(params[:match_id])
    end

    @player = Player.find(params[:id])

    if @tournament
      add_breadcrumb @tournament.name, tournament_path(@tournament)
      add_breadcrumb "#{@player.first_name} #{@player.last_name}", tournament_player_path
      add_breadcrumb "<span>Edit</span>", edit_tournament_player_path
    else
      add_breadcrumb "#{@player.first_name} #{@player.last_name}", player_path(@player)
      add_breadcrumb "<span>Edit</span>", edit_player_path(@player)
    end

  end

  def update

    if params[:player][:tournament_id].present?
      tournament_id = params[:player].delete :tournament_id
      tournament = Tournament.find(tournament_id)
    end

    if params[:player][:match_id].present?
      match_id = params[:player].delete :match_id
      match = Match.find(match_id)
    end

    @player = Player.find(params[:id])

    if @player.update_attributes(params[:player])
      flash[:success] = "Player updated"
      if tournament
        tournament.players.find(@player.id).save
        redirect_to tournament_players_path(tournament)
      elsif match
        redirect_to match_path(match)
      else
        redirect_to @player
      end
    else
      if tournament
        flash[:error] = "That didn't work :("
        redirect_to tournament_players_path(tournament)
      elsif match
        flash[:error] = "That didn't work :("
        redirect_to match_path(match)
      else
        flash[:error] = @player.errors.to_a.to_sentence
        redirect_to edit_player_path(@player)
      end
    end
  end

  def multiadd

    if params[:tournament_id]
      # Rails.logger.debug "#{eval(params[:tournament_id]).class.inspect}"
      temp = eval(params[:tournament_id])
      tournament = Tournament.find(temp)
      # Rails.logger.debug "#{params[:tournament_id].class.inspect}"

    end

    if tournament
      if params[:player_ids]
        params[:player_ids].each do |id|
          @player = Player.find(id)
          if !tournament.tournament_players.where(player_id: id).any?
            @player = Player.find(id)
            tournament.players << @player
            tournament.save
          end
        end
        flash[:success] = "#{pluralize(params[:player_ids].count, "player was", "players were")} added."
        redirect_to tournament
      else
        flash[:error] = "No players were added."
        redirect_to tournament
      end
    end    
  end

  def multiremove

    if params[:tournament_id]
      # Rails.logger.debug "#{eval(params[:tournament_id]).class.inspect}"
      temp = eval(params[:tournament_id])
      tournament = Tournament.find(temp)
      # Rails.logger.debug "#{params[:tournament_id].class.inspect}"
    end

    if tournament && params[:player_ids]
      params[:player_ids].each do |id|
        tournament.tournament_players.where(player_id: id).destroy_all
      end
      flash[:success] = "#{pluralize(params[:player_ids].count, "player was", "players were")} removed."
      redirect_to tournament
    else
      flash[:error] = "No player(s) selected to remove."
      redirect_to tournament
    end
    
  end

  def add_index

    @tournament = Tournament.find(params[:id])
    if @tournament.players.empty?
      @players = Player.paginate(page: params[:page], per_page: 16)
    else
      @players = Player.where("id NOT IN (?)", @tournament.players).paginate(page: params[:page], per_page: 16)
    end

    add_breadcrumb "Tournaments", :tournaments_path
    add_breadcrumb @tournament.name, tournament_path(@tournament)
    add_breadcrumb "<span>Add Existing Players</span>", add_index_path

  end

  def add_new_player
    @player = Player.new({first_name: params['first_name'],
                          last_name: params['last_name'],
                         email: params['email'],
                         skill: params['skill']})
    respond_to do |format|
      format.json {
        if @player.save
          render json: @player
        else
          render json: @player.errors, status: :forbidden
        end
      }
    end

  end

  def search_players

    search = params['search_term']

    if !search.empty?
      search_result = Player.where("first_name LIKE :test OR last_name LIKE :test OR full_name LIKE :test OR email LIKE :test", test: "%#{search}%").uniq.reverse
    else
      search_result = Player.order("created_at DESC").paginate(page: params[:page], per_page: 16)
    end

    respond_to do |format|
      format.json {
        render json: {
            search_result: search_result
        }
      }
    end
  end

  private

    def player_params
      params.require(:player).permit(:first_name, :last_name, :email, :skill)
    end

end