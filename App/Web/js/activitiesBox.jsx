'use strict';

var React = require('react');
var ActivitiesTable = require('./activitiesTable.jsx');
var ActivityForm = require('./activityForm.jsx');
var ActivityService = require('./activityService.jsx');

var ActivitiesBox = React.createClass({
    getInitialState: function () {
        return {
            activitiesTableData: []
        };
    },

    componentDidMount: function () {
        ActivityService.getAllActivities(this.setActivities);
    },

    setActivities: function (response){
        if(this.isMounted()){
            this.setState({
                activitiesTableData: response.body
            });
        }
    },
    
    updateEventHandler: function () {
        ActivityService.getAllActivities(this.setActivities);
        console.log(this.state);
    },

    render: function () {
        return (
            <div className='activities-box' ref="ActivitiesBox">
                <ActivitiesTable data={ this.state.activitiesTableData } />
                <ActivityForm updateEventHandler={ this.updateEventHandler } />
            </div>
        );
    }
});

module.exports = ActivitiesBox;