class ApplicationController < ActionController::Base
  protect_from_forgery
  layout proc { |c| env['HTTP_X_PJAX'].present? ? false : 'application' }
end
