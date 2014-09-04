class TsvController < ApplicationController
  unloadable


  def show
    case params[:for]
    when 'new_per_day'
      issues = Issue.all.select{|i| i.created_on >= 1.week.ago}.group_by{|e| Date::DAYNAMES[e.created_on.wday]}
      @tickets = Hash[issues.map{|k,v|[k,v.count]}]
    when 'overview_yearly'
      issues = Issue.all.select{|i| i.created_on >= 1.month.ago}.group_by{|e| e.created_on.strftime("%d-%b-%y")}
      @tickets = Hash[issues.map{|k,v|[k,v.count]}]
    when 'overview_overall'
      issues = Issue.all.group_by{|e| e.created_on.strftime("%d-%b-%y")}
      @tickets = Hash[issues.map{|k,v|[k,v.count]}]
    else
      @tickets = {}
    end
    puts @tickets.inspect
    render 'show', layout: false, format: 'text'
  end
end
