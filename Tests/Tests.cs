﻿namespace Tests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Moq;
    using NUnit.Framework;

    [TestFixture]
    public class Tests
    {
        private Mock<IDateProvider> _dateProvider;

        [SetUp]
        public void Setup()
        {
            _dateProvider = new Mock<IDateProvider>();
        }

        [Test]
        public void ShouldBePossibleToCreateNewItem()
        {
            new ActivityItem(DateTime.Now, 120, ActivityType.Movie);
        }

        [Test]
        public void ShouldBePossibleToCountAllActivitiesDuration()
        {
            // given
            var listOfActivities = new List<ActivityItem>
            {
                new ActivityItem(DateTime.Now, 100, ActivityType.Movie),
                new ActivityItem(DateTime.Now, 120, ActivityType.Movie),
                new ActivityItem(DateTime.Now, 80, ActivityType.Movie)
            };

            // when
            var duration = listOfActivities.Sum(activityItem => activityItem.Duration);

            // then
            Assert.That(duration, Is.EqualTo(300));
        }

        [Test]
        public void ShouldBePossibleToDetermineStatisticsTimeSpan()
        {
            // given
            var listOfActivities = new List<ActivityItem>
            {
                new ActivityItem(new DateTime(2014,01,01), 100, ActivityType.Movie),
                new ActivityItem(new DateTime(2014,05,01), 120, ActivityType.Movie),
                new ActivityItem(new DateTime(2014,10,01), 80, ActivityType.Movie)
            };

            _dateProvider.Setup(provider => provider.GetCurrentDate()).Returns(new DateTime(2014, 10, 21));

            // when
            var statiscticsTime = new Statisctics(listOfActivities, _dateProvider.Object).TimeSpan();

            // then
            const int expectedDays = 293;
            Assert.That(statiscticsTime, Is.EqualTo(expectedDays));
        }
    }

    public interface IDateProvider
    {
        DateTime GetCurrentDate();
    }

    public class Statisctics
    {
        private readonly List<ActivityItem> _listOfActivities;
        private readonly IDateProvider _dateProvider;

        public Statisctics(List<ActivityItem> listOfActivities, IDateProvider dateProvider)
        {
            _listOfActivities = listOfActivities;
            _dateProvider = dateProvider;
        }

        public int TimeSpan()
        {
            var smallestDate = _listOfActivities.Min(activity => activity.Date);
            var totalDays = _dateProvider.GetCurrentDate().Subtract(smallestDate).TotalDays;
            
            return Convert.ToInt32(Math.Floor(totalDays));
        }
    }

    public class ActivityItem
    {
        private readonly DateTime _date;
        private readonly int _duration;
        private readonly ActivityType _activityType;

        public ActivityItem(DateTime date, int duration, ActivityType activityType)
        {
            _date = date;
            _duration = duration;
            _activityType = activityType;
        }

        public int Duration
        {
            get { return _duration; }
        }

        public DateTime Date
        {
            get { return _date; }
        }
    }

    public enum ActivityType
    {
        Movie,
        Series
    }
}
