'use strict';

var React = require('react');
var ReactAddons = require('react/addons').addons;

var ActivitiesTable = require('./activitiesTable.jsx');

var ActivitiesBox = React.createClass({
    render: function() {
        return (
            <div className='activities-box' ref="ActivitiesBox">
                <ActivitiesTable data={ this.props.tableData } />
            </div>
        );
    }
});

module.exports = ActivitiesBox;