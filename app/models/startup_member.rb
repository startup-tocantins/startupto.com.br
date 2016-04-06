class StartupMember < ActiveRecord::Base
  belongs_to :startup
  belongs_to :member
end
