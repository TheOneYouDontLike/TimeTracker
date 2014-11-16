namespace Tests
{
    using System;
    using Core;
    using NUnit.Framework;
    using Raven.Client;
    using Raven.Client.Embedded;

    [TestFixture]
    public class StoringActivitiesTests
    {
        private IDocumentStore _documentStore;

        [SetUp]
        public void Setup()
        {
            _documentStore = new EmbeddableDocumentStore
            {
                RunInMemory = true
            };
            _documentStore.Initialize();
        }

        [Test]
        public void Should_be_possible_to_add_and_get_activity()
        {
            // given
            var activityService = new ActivityService(_documentStore);
            var activity = new Activity(new DateTime(2014, 10, 12), 120, ActivityType.Movie);

            // when
            activityService.AddNew(activity);

            // then
            var activityFromStore = activityService.GetById(activity.Id);
            Assert.That(activityFromStore, Is.Not.Null);
            Assert.That(activityFromStore.Date, Is.EqualTo(new DateTime(2014, 10, 12)));
        }
    }

    public class ActivityService
    {
        private readonly IDocumentStore _documentStore;

        public ActivityService(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        public void AddNew(Activity activity)
        {
            using (var session = _documentStore.OpenSession())
            {
                session.Store(activity);
                session.SaveChanges();
            }
        }

        public Activity GetById(int id)
        {
            using (var session = _documentStore.OpenSession())
            {
                return session.Load<Activity>(id);
            }
        }
    }
}