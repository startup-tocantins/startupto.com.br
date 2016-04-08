class Link < ActiveRecord::Base
  belongs_to :startup
  validates :kind, :url, presence: true
  # TODO: adicionar testes de relacionamento com :startup
end
