namespace Tests
{
    using System;
    using System.Collections.Generic;
    using Core;
    using Moq;
    using NUnit.Framework;

    [TestFixture]
    public class StatisticsTests
    {
        private Mock<IDateProvider> _dateProvider;

        [SetUp]
        public void Setup()
        {
            _dateProvider = new Mock<IDateProvider>();
        }

        [Test]
        public void ShouldCountActivitiesTotalDuration()
        {
            // given
            var listOfActivities = new List<Activity>
            {
                new Activity(DateTime.Now, 100, ActivityType.Movie),
                new Activity(DateTime.Now, 120, ActivityType.Movie),
                new Activity(DateTime.Now, 80, ActivityType.Series)
            };

            // when
            var duration = new Statistics(listOfActivities, _dateProvider.Object).TotalDurationOfActivities();

            // then
            Assert.That(duration, Is.EqualTo(300));
        }

        [Test]
        public void ShouldDetermineStatisticsTimeSpan()
        {
            // given
            var listOfActivities = new List<Activity>
            {
                new Activity(new DateTime(2014,01,01), 100, ActivityType.Movie),
                new Activity(new DateTime(2014,05,01), 120, ActivityType.Movie),
                new Activity(new DateTime(2014,10,01), 80, ActivityType.Movie)
            };

            _dateProvider.Setup(provider => provider.GetCurrentDate()).Returns(new DateTime(2014, 10, 21));

            // when
            var statiscticsTime = new Statistics(listOfActivities, _dateProvider.Object).TotalTimeSpan();

            // then
            const int expectedDays = 293;
            Assert.That(statiscticsTime, Is.EqualTo(expectedDays));
        }

        [Test]
        public void ShouldCalculateMoviesTotalDuration()
        {
            // given
            var listOfActivities = new List<Activity>
            {
                new Activity(new DateTime(2014,01,01), 100, ActivityType.Movie),
                new Activity(new DateTime(2014,05,01), 120, ActivityType.Movie),
                new Activity(new DateTime(2014,10,01), 80, ActivityType.Series)
            };

            // when
            var totalDurationOfMovies = new Statistics(listOfActivities, _dateProvider.Object).TotalDurationOfActivities(ActivityType.Movie);

            // then
            Assert.That(totalDurationOfMovies, Is.EqualTo(220));
        }

        [Test]
        public void ShouldCalculateSeriesTotalDuration()
        {
            // given
            var listOfActivities = new List<Activity>
            {
                new Activity(new DateTime(2014,01,01), 100, ActivityType.Movie),
                new Activity(new DateTime(2014,05,01), 120, ActivityType.Movie),
                new Activity(new DateTime(2014,10,01), 80, ActivityType.Series),
                new Activity(new DateTime(2014,10,01), 80, ActivityType.Series)
            };

            // when
            var totalDurationOfMovies = new Statistics(listOfActivities, _dateProvider.Object).TotalDurationOfActivities(ActivityType.Series);

            // then
            Assert.That(totalDurationOfMovies, Is.EqualTo(160));
        }

        [Test]
        public void ShouldCalculateAverageIntervalBetweenActivities()
        {
            // given
            var listOfActivities = new List<Activity>
            {
                new Activity(new DateTime(2014,01,01), 100, ActivityType.Movie),
                new Activity(new DateTime(2014,01,04), 120, ActivityType.Movie),
                new Activity(new DateTime(2014,01,08), 80, ActivityType.Series),
                new Activity(new DateTime(2014,01,13), 80, ActivityType.Series)
            };

            // when
            var averageInterval =
                new Statistics(listOfActivities, _dateProvider.Object).AverageIntervalBetweenActivities;

            // then
            Assert.That(averageInterval, Is.EqualTo(4));
        }

        [Test]
        public void ShouldCalculateTotalNumberOfWatchedActivity()
        {
            // given
            var listOfActivities = new List<Activity>
            {
                new Activity(new DateTime(2014,01,01), 100, ActivityType.Movie),
                new Activity(new DateTime(2014,01,04), 120, ActivityType.Movie),
                new Activity(new DateTime(2014,01,04), 120, ActivityType.Series)
            };

            // when
            var statistics = new Statistics(listOfActivities, _dateProvider.Object);

            var totalNumberOfWatchedMovies = statistics.TotalNumberOfMovies;
            var totalNumberOfWatchedSeries = statistics.TotalNumberOfSeries;

            // then
            Assert.That(totalNumberOfWatchedMovies, Is.EqualTo(2));
            Assert.That(totalNumberOfWatchedSeries, Is.EqualTo(1));
        }

        [Test]
        public void ShouldCalculateAverageIntervalBetweenVisitsInTheCinema()
        {
            // given
            var activities = new List<Activity>
            {
                new Activity(new DateTime(2014,01,01), 100, ActivityType.Movie){ WatchedInCinema = true },
                new Activity(new DateTime(2014,01,04), 120, ActivityType.Movie){ WatchedInCinema = true },
                new Activity(new DateTime(2014,01,08), 120, ActivityType.Movie){ WatchedInCinema = true },
                new Activity(new DateTime(2014,01,20), 120, ActivityType.Movie)
            };

            // when
            var averageIntervalBetweenCinemaVisits = new Statistics(activities, _dateProvider.Object).AverageIntervalBetweenCinemaVisits;

            // then
            Assert.That(averageIntervalBetweenCinemaVisits, Is.EqualTo(3.5));
        }
    }
}
