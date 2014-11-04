class TsvController < ApplicationController
  unloadable

  before_filter :selected
  before_filter :find_issues


  # GET /tsv/:for
  #
  # Every request CAN have the parameter p as an array p[]=
  # If p is present, the selection will be from these projects:
  # [{project: "ABC", values: {}}, {project: "CDE", values: {}}]
  def show
    case params[:for]
    when 'user_hours'
      user_hours
    when 'new_per_day'
      weekly_avg
    when 'overview_yearly'
      monthly_avg
    when 'overview_overall'
      issues = Issue.all
      @tickets = (issues.first.created_on.to_date..Date.today).map{|t| {issues: issues.select{|i| i.created_on.to_date < t}.count, project: 0, date: t.strftime("%d-%b-%y")}}
      project = Project.find_by_identifier("tagesgeschaeft")
      issues = project.issues
      tickets_tag = Hash[(issues.first.created_on.to_date..Date.today).map{|t| [t.strftime("%d-%b-%y"),issues.select{|i| i.created_on.to_date < t}.count] }]
      @tickets.map!{|v| {date: v[:date], global: v[:issues], tagesgeschaeft: tickets_tag[v[:date]]}}

    else
      @tickets = {}
    end
    render json: @tickets.to_json
    
  end

  def selected
    if params[:p]
      @selected = params[:p].map{|p| p.to_i}
    else
      @selected = Project.all.map{|p| p.id}
    end
  end
  def find_issues
    issues = Issue.eager_load(:project).all
    @issues = issues
  end


  def ftime(time)
    time.strftime("%d-%b-%y")
  end
  def rtoa(range)
    range.map{|date| ftime(date)}
  end

  def group_tickets(selection, timerange)
    grouping = selection.group_by{|e| ftime(e.created_on.to_date)}
    overall_tickets = Hash[grouping.map{|k,v|[k,v.count]}]
    count_for_date_overall = Hash[rtoa(timerange).map{|date| [date, overall_tickets[date]||0]}]
  end
  def for_timerange(timerange)

    selection = @issues.select{|i| timerange.include?(i.created_on.to_date)}

    count_for_date_overall = group_tickets(selection, timerange)
    
    pre_sort = {keys: rtoa(timerange)}
    pre_sort_values = []
    pre_sort_values << {project: "Global", values: count_for_date_overall}

    if params[:p] && params[:p].kind_of?(Array)
      params[:p].each do |param|
        begin
          proj = Project.find(param)
          val = {project: proj.name}
        rescue ActiveRecord::RecordNotFound
          next
        end

        p_select = selection.select{|i| i.project.id == proj.id}
        val[:values] = group_tickets(p_select,timerange)
        pre_sort_values << val
      end
    end

    pre_sort[:values] = pre_sort_values


    @tickets = pre_sort


  end
  def monthly_avg
    timerange = 1.month.ago.to_date..Date.today
    for_timerange(timerange)
  end
  # [week days]
  def weekly_avg
    timerange = 1.week.ago.to_date..Date.today
    for_timerange(timerange)
  end

  def user_grouping(entries,timerange)
    group = entries.group_by{|e| ftime(e.spent_on)}
    overall_hours = Hash[group.map{|k,v|[k,v.inject(0){|sum,e|sum+e.hours}]}]
    count_for_date_overall = Hash[rtoa(timerange).map{|date| [date, overall_hours[date]||0]}]
  end

  def user_hours
    current_user = User.current
    timerange = 1.month.ago.to_date..Date.today
    time_entry_all = TimeEntry.eager_load(:user).all
    time_entries = time_entry_all.select{|e| e.user.id == current_user.id}

    entries = time_entries.select{|e| timerange.include?(e.spent_on)}
    grouping = user_grouping(entries, timerange)

    pre_sort = {keys: rtoa(timerange)}
    pre_sort_values = []
    pre_sort_values << {project: "Self", values: grouping}

    if params[:p] && params[:p].kind_of?(Array)
      params[:p].each do |param|
        begin
          user = User.find(param)
          val = {project: user.login}
        rescue ActiveRecord::RecordNotFound
          next
        end

        p_select = time_entry_all.select{|t| t.user.id == user.id}
        val[:values] = user_grouping(p_select,timerange)
        pre_sort_values << val
      end
    end

    pre_sort[:values] = pre_sort_values





    @tickets = pre_sort
  end

  # Get all tickets. Can select projects p[]=
  def overall_tickets

  end
end
