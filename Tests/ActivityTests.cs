namespace Tests
{
    using System;
    using Core;
    using NUnit.Framework;

    [TestFixture]
    public class ActivityTests
    {
        [Test]
        public void ShouldBePossibleToCreateNewActivity()
        {
            new Activity(DateTime.Now, 120, ActivityType.Movie);
        }

        [Test]
        public void ShouldBePossibleToAddMovieWatchedInTheCinema()
        {
            // when
            Activity activity = new Activity(new DateTime(), 120, ActivityType.Movie)
            {
                WatchedInCinema = true
            };

            // then
            Assert.That(activity.WatchedInCinema, Is.True);
        }

        [Test]
        public void ShouldNotBePossibleToAddSeriesWatchedInTheCinema()
        {
            // when
            var creatingNewActivity = new TestDelegate(() =>
            {
                new Activity(new DateTime(), 120, ActivityType.Series)
                {
                    WatchedInCinema = true
                };
            });

            // then
            Assert.That(creatingNewActivity, Throws.TypeOf<ActivityException>());
        }
    }
}