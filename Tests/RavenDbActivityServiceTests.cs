namespace Tests
{
    using System;
    using System.Linq;
    using App.Domain;
    using App.Infrastructure;
    using App.Infrastructure.Exceptions;
    using NUnit.Framework;
    using Raven.Client;
    using Raven.Client.Embedded;

    [TestFixture]
    public class RavenDbActivityServiceTests
    {
        private IDocumentStore _documentStore;
        private RavenDbActivityService _activityService;

        [SetUp]
        public void Setup()
        {
            _documentStore = new EmbeddableDocumentStore
            {
                RunInMemory = true
            };
            _documentStore.Initialize();
            _activityService = new RavenDbActivityService(_documentStore);
        }

        [Test]
        public void Should_be_possible_to_add_and_get_activity()
        {
            // given
            var activity = new Activity("Interstellar", new DateTime(2014, 10, 12), 120, ActivityType.Movie);

            // when
            _activityService.AddNew(activity);

            // then
            var activityFromStore = _activityService.GetById(activity.Id);

            Assert.That(activityFromStore, Is.Not.Null);
            Assert.That(activityFromStore.Id, Is.EqualTo(1));
            Assert.That(activityFromStore.Name, Is.EqualTo("Interstellar"));
        }

        [Test]
        public void Should_not_get_and_throw_exception_when_an_activity_does_not_exist()
        {
            // given
            // there is no such activity in db

            // when
            TestDelegate gettingNonExistingActivity = () => _activityService.GetById(666);

            // then
            Assert.Throws<ActivityDoesNotExist>(gettingNonExistingActivity);
        }

        [Test]
        public void Should_return_new_activity_id_after_storing_in_db()
        {
            // given
            var activity = new Activity("Interstellar", new DateTime(2014, 10, 12), 120, ActivityType.Movie);

            // when
            var newActivityId = _activityService.AddNew(activity);

            // then
            Assert.That(newActivityId, Is.GreaterThan(0));
        }

        [Test]
        public void Should_return_all_activities()
        {
            // given
            var firstActivity = new Activity("Interstellar", new DateTime(2014, 10, 12), 120, ActivityType.Movie);
            var secondActivity = new Activity("The Prestige", new DateTime(2014, 10, 12), 120, ActivityType.Movie);

            // when
            _activityService.AddNew(firstActivity);
            _activityService.AddNew(secondActivity);

            var activities = _activityService.GetAll();

            // then
            Assert.That(activities.Count, Is.EqualTo(2));
            Assert.That(activities.Any(activity => activity.Name == "Interstellar"));
            Assert.That(activities.Any(activity => activity.Name == "The Prestige"));            
        }

        [Test]
        public void Should_update_activity_name()
        {
            // given
            var activity = new Activity("Dumb and dumber", new DateTime(2013, 01, 01), 120, ActivityType.Movie);
            _activityService.AddNew(activity);

            // when
            _activityService.ChangeActivityName(activity.Id, "Dumb and dumber II");

            var updatedActivity = _activityService.GetById(activity.Id);

            // then
            Assert.That(updatedActivity.Name, Is.EqualTo("Dumb and dumber II"));
        }

        [Test]
        public void Should_not_update_name_and_throw_exception_when_activity_does_not_exist()
        {
            // given
            // there is no such activity in db

            // when
            TestDelegate updatingNonExistingActivity = () => _activityService.ChangeActivityName(1, "Spectre");

            // then
            Assert.Throws<ActivityDoesNotExist>(updatingNonExistingActivity);
        }

        [Test]
        public void Should_update_activity_date()
        {
            // given
            var activity = new Activity("Dumb and dumber", new DateTime(2013, 01, 01), 120, ActivityType.Movie);
            _activityService.AddNew(activity);
            var newDate = new DateTime(2014, 01, 01);

            // when
            _activityService.ChangeActivityDate(activity.Id, newDate);

            var updatedActivity = _activityService.GetById(activity.Id);

            // then
            Assert.That(updatedActivity.Date.ToString(), Is.EqualTo(newDate.ToString()));
        }

        [Test]
        public void Should_not_update_date_and_throw_exception_when_activity_does_not_exist()
        {
            // given
            // there is no such activity in db

            // when
            TestDelegate updatingNonExistingActivity = () => _activityService.ChangeActivityDate(1, DateTime.Now);

            // then
            Assert.Throws<ActivityDoesNotExist>(updatingNonExistingActivity);
        }

        [Test]
        public void Should_update_activity_duration()
        {
            // given
            var activity = new Activity("Dumb and dumber", new DateTime(2013, 01, 01), 120, ActivityType.Movie);
            _activityService.AddNew(activity);
            var newDuration = 160;

            // when
            _activityService.ChangeActivityDuration(activity.Id, newDuration);

            var updatedActivity = _activityService.GetById(activity.Id);

            // then
            Assert.That(updatedActivity.Duration, Is.EqualTo(newDuration));
        }

        [Test]
        public void Should_not_update_duration_and_throw_exception_when_activity_does_not_exist()
        {
            // given
            // there is no such activity in db

            // when
            TestDelegate updatingNonExistingActivity = () => _activityService.ChangeActivityDuration(1, 500);

            // then
            Assert.Throws<ActivityDoesNotExist>(updatingNonExistingActivity);
        }

        [Test]
        public void Should_update_activity_type()
        {
            // given
            var activity = new Activity("Simpsons", new DateTime(2013, 01, 01), 120, ActivityType.Movie);
            _activityService.AddNew(activity);
            var newType = ActivityType.Series;

            // when
            _activityService.ChangeActivityType(activity.Id, newType);

            var updatedActivity = _activityService.GetById(activity.Id);

            // then
            Assert.That(updatedActivity.ActivityType, Is.EqualTo(newType));
        }

        [Test]
        public void Should_not_update_type_and_throw_exception_when_activity_does_not_exist()
        {
            // given
            // there is no such activity in db

            // when
            TestDelegate updatingNonExistingActivity = () => _activityService.ChangeActivityType(1, ActivityType.Series);

            // then
            Assert.Throws<ActivityDoesNotExist>(updatingNonExistingActivity);
        }

        [Test]
        public void Should_set_as_watched_in_cinema()
        {
            // given
            var activity = new Activity("Simpsons", new DateTime(2013, 01, 01), 120, ActivityType.Movie)
            {
                WatchedInCinema = false
            };
            _activityService.AddNew(activity);
            const bool wasWatchedInCinema = true;

            // when
            _activityService.SetAsWatchedInCinema(activity.Id, wasWatchedInCinema);

            var updatedActivity = _activityService.GetById(activity.Id);

            // then
            Assert.That(updatedActivity.WatchedInCinema, Is.EqualTo(wasWatchedInCinema));
        }

        [Test]
        public void Should_not_update_watched_in_cinema_and_throw_exception_when_activity_does_not_exist()
        {
            // given
            // there is no such activity in db

            // when
            TestDelegate updatingNonExistingActivity = () => _activityService.SetAsWatchedInCinema(1, false);

            // then
            Assert.Throws<ActivityDoesNotExist>(updatingNonExistingActivity);
        }

        [Test]
        public void Should_delete_activity_if_it_does_exist()
        {
            // given
            var activity = new Activity("Simpsons", new DateTime(2013, 01, 01), 120, ActivityType.Movie)
            {
                WatchedInCinema = false
            };
            _activityService.AddNew(activity);

            // when
            _activityService.Delete(1);

            // then
            Assert.That(_activityService.GetAll().Count, Is.EqualTo(0));
        }

        [Test]
        public void Should_not_delete_and_throw_exeption_when_activity_does_not_exist()
        {
            // given
            // there is no such activity in db

            // when
            TestDelegate deletingNonExistingActivity = () => _activityService.Delete(666);

            // then
            Assert.Throws<ActivityDoesNotExist>(deletingNonExistingActivity);
        }
    }
}