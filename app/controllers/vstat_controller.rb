class VstatController < ApplicationController
  unloadable


  def show
    case params[:for]
    when 'new_per_day'
      issues = Issue.all.select{|i| i.created_on >= 1.week.ago}.group_by{|e| Date::DAYNAMES[e.created_on.wday]}
      tickets = Hash[issues.map{|k,v|[k,v.count]}]
      avg = tickets.values.inject(0.0){|sum,n| sum += n} / tickets.count
      max = tickets.values.max
      if params[:type] == 'set'
        render json: {max: max,set: Setting.plugin_redmine_kpi['weekly_set'].to_i}.to_json
      else
        render json: {avg: avg, max: max}.to_json
      end

    when 'monthly'
      issues = Issue.all.select{|i| i.created_on >= 1.month.ago}.group_by{|e| e.created_on.strftime("%d-%b-%y")}
      tickets = Hash[issues.map{|k,v|[k,v.count]}]
      avg = tickets.values.inject(0.0){|sum,n| sum += n} / tickets.count
      max = tickets.values.max
      render json: {avg: avg, max: max}.to_json
    else
      render json: {}.to_json
    end
  end
end
