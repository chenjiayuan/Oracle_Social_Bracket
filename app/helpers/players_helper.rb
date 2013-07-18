module PlayersHelper

	# Returns the Gravatar (http://gravatar.com/) for the given user.
	def gravatar_for(player, options = { size: 50 })
		gravatar_id = Digest::MD5::hexdigest(player.email.downcase)
		size = options[:size]
		gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"
		image_tag(gravatar_url, alt: player.first_name + player.last_name, class: "gravatar")
	end

end
