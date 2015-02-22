'use strict';

var jsdom = require('jsdom').jsdom;
var assert = require('node-assertthat');

global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.parentWindow;
global.navigator = window.navigator;

var sinon = require('sinon');
global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

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

        assert.that(renderedForm.state.name, is.equalTo('hello world'));
        assert.that(renderedForm.state.date, is.equalTo('2014-02-02'));
        assert.that(renderedForm.state.duration, is.equalTo('5'));
        assert.that(renderedForm.state.activityType, is.equalTo('Movie'));
    });

    it('should change checkbox value onChange event', function () {
        // given
        var watchedInCinemaCheckbox = renderedForm.getDOMNode().querySelectorAll('input[type=checkbox]')[0];

        // when
        TestUtils.Simulate.change(watchedInCinemaCheckbox);

        // then
        assert.that(renderedForm.state.watchedInCinema, is.equalTo(true));
    });

    describe('when sending data to api', function () {

        var initialState = {
                name: '',
                date: '',
                duration: 0,
                activityType: 'Movie',
                watchedInCinema: false
            };

        var mockedState = {
                name: 'someName',
                date: '2014-02-02',
                duration: 123,
                activityType: 'Movie',
                watchedInCinema: true
            };

        var submitButton;

        beforeEach(function () {
            submitButton = renderedForm.getDOMNode().querySelector('input[type=button]');
        });

        it('should send correct values from state', function () {
            // given
            var requests = [];
            global.XMLHttpRequest.onCreate = function (req) { requests.push(req); };

            // when
            renderedForm.setState(mockedState);
            TestUtils.Simulate.click(submitButton);

            // then
            var parsedBody = JSON.parse(requests[0].requestBody);
            assert.that(parsedBody, is.equalTo(mockedState));
        });

        it('should reset state after sending', function () {
            // given
            var requests = [];
            global.XMLHttpRequest.onCreate = function (req) { requests.push(req); };

            renderedForm.setState(mockedState);

            var updateEventHandlerStub = sinon.stub();
            renderedForm.props.updateEventHandler = updateEventHandlerStub;

            // when
            TestUtils.Simulate.click(submitButton);
            requests[0].respond(200,  { "Content-Type": "application/json" }, '');

            // then
            assert.that(renderedForm.state, is.equalTo(initialState));
            assert.that(updateEventHandlerStub.calledOnce, is.true());
        });
    });
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