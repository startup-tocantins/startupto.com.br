json.array!(@startups) do |startup|
  json.extract! startup, :id, :name, :description, :logo, :category, :stage, :country,
                :state, :city, :site, :contact, :latitude, :longitude, :group, :fundation
  json.url startup_url(startup, format: :json)
end
