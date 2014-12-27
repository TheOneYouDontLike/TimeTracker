'use strict';

var jsdom = require('jsdom').jsdom;
var assert = require('node-assertthat');

global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.parentWindow;
global.navigator = window.navigator;

var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var ActivitiesForm = require('../js/activityForm.jsx');

describe('activities-form', function () {
    var renderedForm;

    beforeEach(function () {
        renderedForm = TestUtils.renderIntoDocument(<ActivitiesForm />);
    });

    it('should change input and select values onChange event', function () {
        // given
        var renderedInputs = TestUtils.scryRenderedDOMComponentsWithClass(renderedForm, 'form-control');
        var nameInput = renderedInputs[0].getDOMNode();
        var dateInput = renderedInputs[1].getDOMNode();
        var durationInput = renderedInputs[2].getDOMNode();
        var activityTypeSelect = renderedInputs[3].getDOMNode();
        
        // when
        SimulateInputChange(nameInput, 'hello world');
        SimulateInputChange(dateInput, '2014-02-02');
        SimulateInputChange(durationInput, '5');
        SimulateInputChange(activityTypeSelect, 'Movie');

        assert.that(renderedForm.state.Name, is.equalTo('hello world'));
        assert.that(renderedForm.state.Date, is.equalTo('2014-02-02'));
        assert.that(renderedForm.state.Duration, is.equalTo('5'));
        assert.that(renderedForm.state.ActivityType, is.equalTo('Movie'));
    });

    function SimulateInputChange (inputNode, value) {
        TestUtils.Simulate.change(inputNode, 
            { 
                target: { 
                    value: value, 
                    name: inputNode.name
                }
            });
    }

    it('should change checkbox value onChange event', function () {
        // given
        var watchedInCinemaCheckbox = renderedForm.getDOMNode().querySelectorAll('input[type=checkbox]')[0];

        // when
        TestUtils.Simulate.change(watchedInCinemaCheckbox);

        // then
        assert.that(renderedForm.state.WatchedInCinema, is.equalTo(true));
    });
});