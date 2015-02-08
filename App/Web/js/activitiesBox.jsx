'use strict';

var React = require('react');
var ActivitiesTable = require('./activitiesTable.jsx');
var ActivityForm = require('./activityForm.jsx');
var ActivityStatistics = require('./activityStatistics.jsx');
var ActivityService = require('./activityService.js');

var ActivitiesBox = React.createClass({
    getInitialState: function() {
        return {
            activitiesTableData: [],
            statisticsData: {},
            tabs: {
                table: 'active',
                form: '',
                stats: ''
            }
        };
    },

    componentDidMount: function() {
        ActivityService.getAllActivities(this.setActivities);
        ActivityService.getStatistics(this.setStatistics);
    },

    setActivities: function(response){
        if(this.isMounted()){
            this.setState({
                activitiesTableData: response.body
            });
        }
    },

    setStatistics: function(response) {
        if(this.isMounted()){
            this.setState({
                statisticsData: response.body
            });
        }
    },

    addActivityToState: function(newActivity){
        var activities = this.state.activitiesTableData;
        activities.push(newActivity);
        this.setState({
            activitiesTableData: activities
        });
    },

    updateEventHandler: function(newActivityId) {
        ActivityService.getActivity(newActivityId, this.addActivityToState);
        ActivityService.getStatistics(this.setStatistics);
    },

    activateTab: function(tabName) {
        var newTabState = {
            table: '',
            form: '',
            stats: ''
        };

        for(var propertyName in newTabState) {
           if(propertyName === tabName){
                newTabState[propertyName] = 'active';
           }
        }

        this.setState({
            tabs: newTabState
        });
    },

    deleteEventHandler: function(activityId) {
        ActivityService.deleteActivity(activityId, this.removeActivityFromState);
    },

    removeActivityFromState: function(activityIdToDelete){
        var activities = this.state.activitiesTableData;
        var filteredActivities = activities.filter(function (activity){
            return activity.id !== activityIdToDelete;
        });
        this.setState({
            activitiesTableData: filteredActivities
        });
    },

    render: function() {
        return (
            <div className='activities-box' ref="ActivitiesBox">
                <ul className="nav nav-tabs">
                    <li role="presentation" className={ this.state.tabs.table }><a href="#table" onClick={ this.activateTab.bind(this, "table") }>List of Activities</a></li>
                    <li role="presentation" className={ this.state.tabs.form }><a href="#form" onClick={ this.activateTab.bind(this, "form") }>Add new activity</a></li>
                    <li role="presentation" className={ this.state.tabs.stats }><a href="#stats" onClick={ this.activateTab.bind(this, "stats") }>Statistics</a></li>
                </ul>
                <div className="tab-content">
                    <div id="table" className={ "tab-pane " + this.state.tabs.table }><ActivitiesTable data={ this.state.activitiesTableData } deleteActivity={ this.deleteEventHandler }/></div>
                    <div id="form" className={ "tab-pane " + this.state.tabs.form }><ActivityForm updateEventHandler={ this.updateEventHandler } /></div>
                    <div id="stats" className={ "tab-pane " + this.state.tabs.stats }><ActivityStatistics data={ this.state.statisticsData } /></div>
                </div>
            </div>
        );
    }
});

module.exports = ActivitiesBox;