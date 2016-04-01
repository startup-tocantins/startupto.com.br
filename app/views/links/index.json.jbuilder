json.array!(@links) do |link|
  json.extract! link, :id, :kind, :url, :description, :startup_id
  json.url link_url(link, format: :json)
end
