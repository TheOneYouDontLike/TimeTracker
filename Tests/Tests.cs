namespace Tests
{
    using System;
    using NUnit.Framework;

    [TestFixture]
    public class Tests
    {
        [Test]
        public void ShouldBePossibleToCreateNewItem()
        {
            new ActivityItem(DateTime.Now, 120, ActivityType.Movie);
        }
    }

    public class ActivityItem
    {
        private readonly DateTime _date;
        private readonly int _lenght;
        private readonly ActivityType _activityType;

        public ActivityItem(DateTime date, int lenght, ActivityType activityType)
        {
            _date = date;
            _lenght = lenght;
            _activityType = activityType;
        }
    }

    public enum ActivityType
    {
        Movie,
        Series
    }
}
