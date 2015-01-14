namespace Tests
{
    using System;
    using System.Linq;
    using App;
    using App.Domain;
    using App.Infrastructure;
    using NUnit.Framework;
    using Raven.Client;
    using Raven.Client.Embedded;

    [TestFixture]
    public class ActivityServiceTests
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
    }
}