namespace Tests
{
    using System;
    using App;
    using App.Domain;
    using NUnit.Framework;

    [TestFixture]
    public class ActivityTests
    {
        [Test]
        public void Should_be_possible_to_create_new_activity()
        {
            new Activity("Interstellar", DateTime.Now, 120, ActivityType.Movie);
        }

        [Test]
        public void Should_be_possible_to_create_movie_watched_in_the_cinema()
        {
            // when
            Activity activity = new Activity("Interstellar", new DateTime(), 120, ActivityType.Movie)
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
                new Activity("Family Guy", new DateTime(), 120, ActivityType.Series)
                {
                    WatchedInCinema = true
                };
            });

            // then
            Assert.That(creatingNewActivity, Throws.TypeOf<ActivityException>());
        }

        [Test]
        public void Should_be_possible_to_change_the_name()
        {
            // given
            Activity activity = new Activity("Interstellar", new DateTime(), 120, ActivityType.Movie);

            // when
            activity.ChangeName("Dumb and dumber");

            // then
            Assert.That(activity.Name, Is.EqualTo("Dumb and dumber"));
        }

        [Test]
        public void Should_be_possible_to_change_the_date()
        {
            // given
            Activity activity = new Activity("Interstellar", new DateTime(), 120, ActivityType.Movie);
            var newDate = new DateTime(2014, 02, 02);

            // when
            activity.ChangeDate(newDate);

            // then
            Assert.That(activity.Date.ToString(), Is.EqualTo(newDate.ToString()));
        }

        [Test]
        public void Should_be_possible_to_change_the_duration()
        {
            // given
            Activity activity = new Activity("Interstellar", new DateTime(), 120, ActivityType.Movie);
            var newDuration = 160;

            // when
            activity.ChangeDuration(newDuration);

            // then
            Assert.That(activity.Duration, Is.EqualTo(newDuration));
        }

        [Test]
        public void Should_be_possible_to_change_the_type()
        {
            // given
            Activity activity = new Activity("Interstellar", new DateTime(), 120, ActivityType.Series);
            var newType = ActivityType.Movie;

            // when
            activity.ChangeType(newType);

            // then
            Assert.That(activity.ActivityType, Is.EqualTo(newType));
        }

        [Test]
        public void Should_be_possible_to_change_if_was_watched_in_cinema()
        {
            // given
            Activity activity = new Activity("Interstellar", new DateTime(), 120, ActivityType.Movie){
                WatchedInCinema = false
            };
            var wasWatchedInCinema = true;

            // when
            activity.SetAsWatchedInCinema(wasWatchedInCinema);

            // then
            Assert.That(activity.WatchedInCinema, Is.EqualTo(true));
        }
    }
}