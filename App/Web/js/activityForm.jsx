'use strict';

var React = require('react');
var ActivityService = require('./ActivityService.js');

var ActivityForm = React.createClass(
    {
        getInitialState: function () {
            return {
                name: '',
                date: '',
                duration: 0,
                activityType: 'Movie',
                watchedInCinema: false
            };
        },

        handleBasicInputChange: function (event) {
            var newStateValue = {};
            newStateValue[event.target.name] = event.target.value;

            this.setState(newStateValue);
        },

        handleCheckBoxInputChange: function () {
            this.setState({ watchedInCinema: !this.state.watchedInCinema });
        },

        handleSubmit: function () {
            ActivityService.postActivity(this.state, this.updateParentComponentAndResetCurrentState);
        },

        updateParentComponentAndResetCurrentState: function (newActivityId) {
            this.setState(this.getInitialState());
            this.props.updateEventHandler(newActivityId);
            //this.props.activateTab('table');
        },

        render: function () {
            return (
                <div className="row">
                    <div className="col-xs-6 col-xs-offset-3">
                        <form className="activity-form" role="form">
                            <div className="form-group">
                                <label htmlFor="activity-name">Name:</label>
                                <input type="text" name="name" className="form-control" id="activity-name" value={ this.state.name } onChange={ this.handleBasicInputChange } />
                            </div>
                            <div className="form-group">
                                <label htmlFor="activity-date">Date:</label>
                                <input type="date" name="date" className="form-control" id="activity-date" value={ this.state.date } onChange={ this.handleBasicInputChange }/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="activity-duration">Duration:</label>
                                <input type="number" name="duration" max-length="3" className="form-control" id="activity-duration" value={ this.state.duration } onChange={ this.handleBasicInputChange }/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="activity-type">Activity type:</label>
                                <select name="activityType" className="form-control" id="activity-type" value={ this.state.activityType } onChange={ this.handleBasicInputChange }>
                                    <option value="Movie">Movie</option>
                                    <option value="Series">Series</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>
                                    Watched in cinema ? <input type="checkbox" name="watchedInCinema" checked={ this.state.watchedInCinema } onChange={ this.handleCheckBoxInputChange }/>
                                </label>
                            </div>
                            <input type="button" value="Add new" className="btn btn-default" onClick={ this.handleSubmit }/>
                        </form>
                    </div>
                </div>
            );
        }
    });

module.exports = ActivityForm;