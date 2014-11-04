Redmine::Plugin.register :redmine_kpi do
  name 'Redmine Kpi plugin'
  author 'Florian Kasper'
  description 'Produces KPI-Statistics for Redmine'
  version '0.0.1'
  url 'https://github.com/nirnanaaa/redmine-kpi'
  author_url 'https://floriankasper.org'
  settings :default => {
      'weekly_set' => 3,
    }, :partial => 'settings/kpi_settings'
  
end
