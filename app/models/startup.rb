class Startup < ActiveRecord::Base
  validates :name, :description, :contact, presence: true, allow_blank: false
end
