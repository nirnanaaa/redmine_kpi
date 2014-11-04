# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html
RedmineApp::Application.routes.draw do
  get '/tsv/:for' => 'tsv#show', :defaults => { :format => 'text' }
  get '/vstat/:for' => 'vstat#show'
end
