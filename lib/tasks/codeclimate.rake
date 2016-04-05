namespace :codeclimate do
  desc 'Run tests and send report to CodeClimate'
  task report: :environment do
    ENV['CODECLIMATE_REPO_TOKEN'] = ENV['XCODECLIMATE_REPO_TOKEN']
    system('rspec')
  end
end
