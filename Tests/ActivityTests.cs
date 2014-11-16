namespace Tests
{
    using System;
    using Core;
    using NUnit.Framework;

    [TestFixture]
    public class ActivityTests
    {
        [Test]
        public void Should_be_possible_to_create_new_activity()
        {
            new Activity(DateTime.Now, 120, ActivityType.Movie);
        }

        [Test]
        public void Should_be_possible_to_create_movie_watched_in_the_cinema()
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
        public void Should_not_be_possible_to_create_series_watched_in_the_cinema()
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