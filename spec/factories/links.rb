FactoryGirl.define do
  factory :link do
    kind "MyString"
    url "MyString"
    description "MyText"
    startup { FactoryGirl.create(:startup) }

    factory :link_invalid do
      url nil
    end
  end
end
