json.array!(@members) do |member|
  json.extract! member, :id, :name, :email, :linkedin, :role
  json.url member_url(member, format: :json)
end
