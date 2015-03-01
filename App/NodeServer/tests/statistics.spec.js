'use strict';

var Statistics     = require('../statistics.js'),
    assert         = require('node-assertthat'),
    moment         = require('moment');

var activitiesData = [
    {
        id: 2,
        name: 'Jurassic Park II',
        date: '2014-09-25',
        duration: 130,
        activityType: 'Movie',
        watchedInCinema: true
    },
    {
        id: 1,
        name: 'Jurassic Park',
        date: '2014-09-20',
        duration: 120,
        activityType: 'Movie',
        watchedInCinema: true
    },
    {
        id: 6,
        name: 'Jurassic Park',
        date: '2014-10-01',
        duration: 120,
        activityType: 'Movie',
        watchedInCinema: true
    },
    {
        id: 3,
        name: 'Futurama S01E01',
        date: '2014-10-01',
        duration: 20,
        activityType: 'Series',
        watchedInCinema: false
    },
    {
        id: 4,
        name: 'Futurama S01E02',
        date: '2014-10-10',
        duration: 20,
        activityType: 'Series',
        watchedInCinema: false
    },
    {
        id: 5,
        name: 'Futurama S01E03',
        date: '2014-10-17',
        duration: 20,
        activityType: 'Series',
        watchedInCinema: false
    }];

var activitiesDataWithTwoMoviesAndOnlyOneIsWatchedInTheCinema = [{
        id: 1,
        name: 'Matrix',
        date: '2014-09-25',
        duration: 130,
        activityType: 'Movie',
        watchedInCinema: false
    },
    {
        id: 2,
        name: 'Matrix II',
        date: '2014-09-30',
        duration: 120,
        activityType: 'Movie',
        watchedInCinema: true
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
            var activityWithMinDate     = activitiesData[1],
                minDate                 = moment(activityWithMinDate.date),
                expectedDays            = moment().diff(minDate, 'days');

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