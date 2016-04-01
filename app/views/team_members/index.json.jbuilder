json.array!(@team_members) do |team_member|
  json.extract! team_member, :id, :nome, :email, :linkedin, :role
  json.url team_member_url(team_member, format: :json)
end
