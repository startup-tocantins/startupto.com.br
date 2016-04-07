require 'rails_helper'

RSpec.describe Startup, type: :model do

  let(:startup) { FactoryGirl.build(:startup) }

  describe 'need' do
    it "name" do
      startup.name = nil
      startup.save
      expect(startup.errors.messages).to have_key(:name)      
    end

    it "description" do
      startup.description = nil
      startup.save
      expect(startup.errors.messages).to have_key(:description)      
    end

  end

end
