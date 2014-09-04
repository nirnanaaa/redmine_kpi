# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html
RedmineApp::Application.routes.draw do
  get '/tsv' => 'tsv#show', :defaults => { :format => 'text' }
end
