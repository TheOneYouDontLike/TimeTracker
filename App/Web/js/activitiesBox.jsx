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
            statisticsData: {}
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
    
    updateEventHandler: function() {
        ActivityService.getAllActivities(this.setActivities);
        ActivityService.getStatistics(this.setStatistics);
    },

    render: function() {
        return (
            <div className='activities-box' ref="ActivitiesBox">
                <ActivitiesTable data={ this.state.activitiesTableData } />
                <ActivityForm updateEventHandler={ this.updateEventHandler } />
                <ActivityStatistics data={ this.state.statisticsData } />
            </div>
        );
    }
});

module.exports = ActivitiesBox;