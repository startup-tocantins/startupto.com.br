FactoryGirl.define do
  factory :member do
    name "Mark Zuckerberg"
    email "mark@facebook.com"
    linkedin "MyString"
    role "CEO"

    factory :member_invalid do
      name nil 
    end

  end
end
