class Member < ActiveRecord::Base
  validates :name, presence: true
end
