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

describe('statistics', function() {
    describe('when generating', function() {
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
            assert.that(statistics.moviesTotalDuration, is.equalTo(370));
        });

        it('should calculate series total duration', function() {
            assert.that(statistics.seriesTotalDuration, is.equalTo(60));
        });

        it('should calculate average interval between activities', function() {
            assert.that(statistics.averageIntervalBetweenActivities, is.equalTo(6.75));
        });

        it('should calculate average interval between cinema visits', function() {
            assert.that(statistics.averageIntervalBetweenCinemaVisits, is.equalTo(5.5));
        });
    });
});

//         [Test]
//         public void Should_calculate_total_number_of_watched_activities()
//         {
//             // given
//             var listOfActivities = new List<Activity>
//             {
//                 new Activity("Bringing Up Baby", new DateTime(2014, 01, 01), 100, ActivityType.Movie),
//                 new Activity("Vertigo", new DateTime(2014, 01, 04), 120, ActivityType.Movie),
//                 new Activity("True Detective", new DateTime(2014, 01, 04), 120, ActivityType.Series)
//             };

//             // when
//             var statistics = new Statistics(listOfActivities, _dateProvider);

//             var totalNumberOfWatchedMovies = statistics.TotalNumberOfMovies;
//             var totalNumberOfWatchedSeries = statistics.TotalNumberOfSeries;

//             // then
//             Assert.That(totalNumberOfWatchedMovies, Is.EqualTo(2));
//             Assert.That(totalNumberOfWatchedSeries, Is.EqualTo(1));
//         }

//         [Test]
//         public void Should_calculate_average_interval_between_visits_in_the_cinema()
//         {
//             // given
//             var activities = new List<Activity>
//             {
//                 new Activity("Interstellar", new DateTime(2014, 01, 01), 100, ActivityType.Movie){ WatchedInCinema = true },
//                 new Activity("Transformers", new DateTime(2014, 01, 04), 120, ActivityType.Movie){ WatchedInCinema = true },
//                 new Activity("Jurassic Park", new DateTime(2014, 01, 08), 120, ActivityType.Movie){ WatchedInCinema = true },
//                 new Activity("Roman Holiday", new DateTime(2014, 01, 20), 120, ActivityType.Movie)
//             };

//             // when
//             var averageIntervalBetweenCinemaVisits = new Statistics(activities, _dateProvider).AverageIntervalBetweenCinemaVisits;

//             // then
//             Assert.That(averageIntervalBetweenCinemaVisits, Is.EqualTo(3.5));
//         }

//         [Test]
//         public void Should_set_average_interval_between_cinema_visits_to_0_if_there_is_only_one_activity()
//         {
//             // given
//             var activities = new List<Activity>
//             {
//                 new Activity("Interstellar", new DateTime(2014, 01, 01), 100, ActivityType.Movie){ WatchedInCinema = true }
//             };

//             // when
//             var averageIntervalBetweenCinemaVisits = new Statistics(activities, _dateProvider).AverageIntervalBetweenCinemaVisits;

//             // then
//             Assert.That(averageIntervalBetweenCinemaVisits, Is.EqualTo(0));
//         }