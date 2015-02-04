'use strict';

var Statistics = require('../statistics.js');
var sinon = require('sinon');
var assert = require('node-assertthat');
var moment = require('moment');

var activitiesData = [
    {
        Id: 1,
        Name: 'Jurassic Park',
        Date: '2014-01-01',
        Duration: 120,
        ActivityType: 'Movie',
        WatchedInCinema: false
    },
    {
        Id: 2,
        Name: 'Jurassic Park II',
        Date: '2014-01-31',
        Duration: 130,
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
        Date: '2014-10-01',
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
            assert.that(statistics.totalDurationOfActivities, is.equalTo(290));
        });

        it('should determine statistics time span', function() {
            var activityWithMinDate = activitiesData[0];
            var minDate = moment(activityWithMinDate.Date);
            var expectedDays = moment().diff(minDate, 'days');

            assert.that(statistics.totalTimeSpan, is.equalTo(expectedDays));
        });

        it('should calculate movies total duration', function() {
            assert.that(statistics.moviesTotalDuration, is.equalTo(250));
        });

        it('should calculate series total duration', function() {
            assert.that(statistics.seriesTotalDuration, is.equalTo(40));
        });
    });
});


//         [Test]
//         public void Should_calculate_series_total_duration()
//         {
//             // given
//             var listOfActivities = new List<Activity>
//             {
//                 new Activity("Interstellar", new DateTime(2014, 01, 01), 100, ActivityType.Movie),
//                 new Activity("The Dark Knight", new DateTime(2014, 05, 01), 120, ActivityType.Movie),
//                 new Activity("Dexter", new DateTime(2014, 10, 01), 80, ActivityType.Series),
//                 new Activity("Breaking Bad", new DateTime(2014, 10, 01), 80, ActivityType.Series)
//             };

//             // when
//             var totalDurationOfMovies = new Statistics(listOfActivities, _dateProvider).TotalDurationOfSeries;

//             // then
//             Assert.That(totalDurationOfMovies, Is.EqualTo(160));
//         }

//         [Test]
//         public void Should_calculate_average_interval_between_activities()
//         {
//             // given
//             var listOfActivities = new List<Activity>
//             {
//                 new Activity("El Dorado", new DateTime(2014, 01, 01), 100, ActivityType.Movie),
//                 new Activity("When Harry Met Sally", new DateTime(2014, 01, 04), 120, ActivityType.Movie),
//                 new Activity("Firefly", new DateTime(2014, 01, 08), 80, ActivityType.Series),
//                 new Activity("Twin Peaks", new DateTime(2014, 01, 13), 80, ActivityType.Series)
//             };

//             // when
//             var averageInterval =
//                 new Statistics(listOfActivities, _dateProvider).AverageIntervalBetweenActivities;

//             // then
//             Assert.That(averageInterval, Is.EqualTo(4));
//         }

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