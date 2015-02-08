'use strict';

var Statistics = require('../statistics.js');
var sinon = require('sinon');
var assert = require('node-assertthat');
var moment = require('moment');

var activitiesData = [
    {
        Id: 2,
        Name: 'Jurassic Park II',
        Date: '2014-09-25',
        Duration: 130,
        ActivityType: 'Movie',
        WatchedInCinema: true
    },
    {
        Id: 1,
        Name: 'Jurassic Park',
        Date: '2014-09-20',
        Duration: 120,
        ActivityType: 'Movie',
        WatchedInCinema: true
    },
    {
        Id: 6,
        Name: 'Jurassic Park',
        Date: '2014-10-01',
        Duration: 120,
        ActivityType: 'Movie',
        WatchedInCinema: true
    },
    {
        Id: 3,
        Name: 'Futurama S01E01',
        Date: '2014-10-01',
        Duration: 20,
        ActivityType: 'Series',
        WatchedInCinema: false
    },
    {
        Id: 4,
        Name: 'Futurama S01E02',
        Date: '2014-10-10',
        Duration: 20,
        ActivityType: 'Series',
        WatchedInCinema: false
    },
    {
        Id: 5,
        Name: 'Futurama S01E03',
        Date: '2014-10-17',
        Duration: 20,
        ActivityType: 'Series',
        WatchedInCinema: false
    }];

var activitiesDataWithTwoMoviesAndOnlyOneIsWatchedInTheCinema = [{
        Id: 1,
        Name: 'Matrix',
        Date: '2014-09-25',
        Duration: 130,
        ActivityType: 'Movie',
        WatchedInCinema: false
    },
    {
        Id: 2,
        Name: 'Matrix II',
        Date: '2014-09-30',
        Duration: 120,
        ActivityType: 'Movie',
        WatchedInCinema: true
    }];

describe('statistics', function() {
    describe('when there is a lot of activities', function() {
        var statistics;

        before(function() {
            statistics = new Statistics(activitiesData);
        });

        it('should count activities total duration', function() {
            assert.that(statistics.totalDurationOfActivities, is.equalTo(430));
        });

        it('should determine statistics time span', function() {
            var activityWithMinDate = activitiesData[1];
            var minDate = moment(activityWithMinDate.Date);
            var expectedDays = moment().diff(minDate, 'days');

            assert.that(statistics.totalTimeSpan, is.equalTo(expectedDays));
        });

        it('should calculate movies total duration', function() {
            assert.that(statistics.totalDurationOfMovies, is.equalTo(370));
        });

        it('should calculate series total duration', function() {
            assert.that(statistics.totalDurationOfSeries, is.equalTo(60));
        });

        it('should calculate average interval between activities', function() {
            assert.that(statistics.averageIntervalBetweenActivities, is.equalTo(6.75));
        });

        it('should calculate average interval between cinema visits', function() {
            assert.that(statistics.averageIntervalBetweenCinemaVisits, is.equalTo(5.5));
        });

        it('should calculate total number of activities', function() {
            assert.that(statistics.totalNumberOfMovies, is.equalTo(3));
            assert.that(statistics.totalNumberOfSeries, is.equalTo(3));
        });
    });

    describe('when there are two movies and one is watched in the cinema', function() {
        it('should return 0 interval between cinema visits', function() {
            var statistics = new Statistics(activitiesDataWithTwoMoviesAndOnlyOneIsWatchedInTheCinema);
            assert.that(statistics.averageIntervalBetweenCinemaVisits, is.equalTo(0));
        });
    });

    describe('when there is only one activity', function() {
        var statistics;

        before(function() {
            var activitiesDataWithOnlyOneActivity = [activitiesData[0]];
            statistics = new Statistics(activitiesDataWithOnlyOneActivity);
        });

        it('should set average interval between activities to 0', function() {
            assert.that(statistics.averageIntervalBetweenActivities, is.equalTo(0));
        });

        it('should set average interval between cinema visits to 0', function() {
            assert.that(statistics.averageIntervalBetweenCinemaVisits, is.equalTo(0));
        });
    });

    describe('when there are no activities', function() {
        var statistics;

        before(function() {
            var noActivities = [];
            statistics = new Statistics(noActivities);
        });

        it('every property value should be set to 0', function() {
            assert.that(statistics.totalDurationOfActivities, is.equalTo(0));
            assert.that(statistics.totalTimeSpan, is.equalTo(0));
            assert.that(statistics.totalDurationOfMovies, is.equalTo(0));
            assert.that(statistics.totalDurationOfSeries, is.equalTo(0));
            assert.that(statistics.averageIntervalBetweenActivities, is.equalTo(0));
            assert.that(statistics.averageIntervalBetweenCinemaVisits, is.equalTo(0));
            assert.that(statistics.totalNumberOfMovies, is.equalTo(0));
            assert.that(statistics.totalNumberOfSeries, is.equalTo(0));
        });
    });
});