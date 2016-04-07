FactoryGirl.define do
  factory :startup do
    name "VigilantesApp"
    description "App of Vigilance"
    logo "images/logo.png"
    category :security
    stage :ideacao
    country :brazil
    state :tocantins
    city 'Palmas'
    site 'vigilantesapp.com' 
    contact 'contato@vigilantesapp.com'
    latitude nil
    longitude nil
    group :movimento_statup_tocantins
    fundation "2015-04-06"
  end
end
