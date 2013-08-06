Brakkit::Application.routes.draw do

  resources :tournaments do
    member do
      post 'winner'
    end
    collection do
      post 'add_new_tournament'
      get 'search_tournaments'
    end

    resources :players do
      collection do
        post 'multiremove'
        post 'add_new_player'
      end
      member do
        delete 'delete_player_from_tournament_show'
      end
    end
  end

  resources :players do
    collection do
      post 'multiadd'
      post 'add_new_player'
      get 'search_players'
    end
    member do
      put 'update_player_ajax'
    end
  end

  resources :matches do
    collection do
      post 'add_new_match'
      get 'search_matches'
    end
    member do
      post 'verdict'
      post 'add_match_player'
      post 'remove_match_player'
      get 'non_match_players'
      post 'add_player_from_player_picker'
      get 'player_picker_search'
      post 'add_new_player_from_match'
    end

    resources :players do

    end
  end

  root to: 'tournaments#index'

  get '/home',    to: 'tournaments#index'
  get '/contact', to: 'static_pages#contact'
  get '/players', to: 'players#index'
  get '/players/:id', to: 'players#show'
  get '/tournaments/:id', to: 'tournaments#show'
  get '/tournaments/:id/player', to: 'players#show'
  get '/tournaments/:id/players/:id', to: 'players#show'
  post '/players/:id/edit', to: 'players#edit'
  post '/tournaments/:id/players/:id/edit', to: 'players#edit'
  get '/tournaments/:id/start', to: 'tournaments#start_tournament', as: 'start_tournament'
  get '/tournaments/:id/add_index/', to: 'players#add_index', as: 'add_index'
  get '/matches/:id/start_match', to: 'matches#start_match', as: 'start_match'

end
