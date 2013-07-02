class PlayersController < ApplicationController

  def index
    @players = Player.paginate(page: params[:page], per_page: 15)

    if params[:tournament_id]
      @tournament = Tournament.find(params[:tournament_id])
    end

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
        flash[:success] = "Player created"
        redirect_to tournament
      else
        flash[:success] = "Player created"
        redirect_to player_path(@player)
      end
    else
      if tournament
        flash[:error] = "That didn't work :("
        session[:player_errors] = @player.errors
        redirect_to new_tournament_player_path(tournament)
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
      if tournament
        flash[:error] = "That didn't work :("
        redirect_to tournament_players_path(tournament)
      else
        render 'new'
      end
    end
  end

  def trash

    if params[:tournament_id]
      # Rails.logger.debug "#{eval(params[:tournament_id]).class.inspect}"
      temp = eval(params[:tournament_id])
      tournament = Tournament.find(temp)
      # Rails.logger.debug "#{params[:tournament_id].class.inspect}"

    end

    if tournament
      temp_arr = []
      params[:player_ids].each do |id|
        @player = Player.find(id)
        if !tournament.tournament_players.where(player_id: id).any?
          @player = Player.find(id)
          tournament.players << @player
          tournament.save
          flash[:success] = "Players added"
        else
          temp_arr << @player
          # flash[:error] = "Player already in tournament"
        end

      end

      if temp_arr.any?
        names = []
        for s in temp_arr
          names << s.first_name + " " + s.last_name
        end

        s = ""

        flash[:error] = "#{temp_arr.count} players were not added > #{names.to_sentence} "
      end
      redirect_to tournament
    end

    #Player.destroy(params[:player_ids])

    #respond_to do |format|
    #  format.html { redirect_to players_path }
    #  format.json { head :no_content }
    #end
    
  end


end