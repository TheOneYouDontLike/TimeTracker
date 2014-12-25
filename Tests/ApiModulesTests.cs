namespace Tests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using App;
    using App.Infrastructure;
    using App.Modules;
    using Nancy;
    using Nancy.Testing;
    using NUnit.Framework;
    using Raven.Client.Embedded;
    using Newtonsoft.Json;
    using Browser = Nancy.Testing.Browser;

    [TestFixture]
    public class ApiModulesTests
    {
        private const string ApplicationJson = "application/json";
        private Browser _browser;
        private RavenDbActivityService _activityService;
        private EmbeddableDocumentStore _embeddableDocumentStore;

        [SetUp]
        public void Setup()
        {
            _embeddableDocumentStore = new EmbeddableDocumentStore { RunInMemory = true };
            _embeddableDocumentStore.Initialize();

            _activityService = new RavenDbActivityService(_embeddableDocumentStore);

            _browser = new Browser(
                with => with.Module(new ActivityApiModule(_activityService)),
                context => context.Accept(ApplicationJson));

            JsonConvert.DefaultSettings += JsonSettings.GlobalJsonSerializerSettings;
        }

        [Test]
        public void Should_return_all_activities()
        {
            // given
            _activityService.AddNew(
                new Activity("Matrix", new DateTime(2008, 12, 12), 200, ActivityType.Movie));
            _activityService.AddNew(
                new Activity("Matrix II", new DateTime(2008, 12, 12), 200, ActivityType.Movie));

            // when
            var response = _browser.Get("/activities");

            // then
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));

            var list = JsonConvert.DeserializeObject<List<Activity>>(response.Body.AsString());

            Assert.That(list[0].Name, Is.EqualTo("Matrix"));
            Assert.That(list[0].Duration, Is.EqualTo(200));
            Assert.That(list[0].ActivityType, Is.EqualTo(ActivityType.Movie));
            Assert.That(list[1].Name, Is.EqualTo("Matrix II"));
        }

        [Test]
        public void Should_add_activity()
        {
            // given
            var activity = new Activity("Kill Bill", new DateTime(2014, 09, 09), 150, ActivityType.Movie)
            {
                WatchedInCinema = true
            };

            // when
            var serializedActivity = JsonConvert.SerializeObject(activity);

            var postResponse = _browser.Post("/activities", with =>
            {
                with.HttpsRequest();
                with.Body(serializedActivity, ApplicationJson);
            });

            var response = _browser.Get("/activities");
            var list = JsonConvert.DeserializeObject<List<Activity>>(response.Body.AsString());

            // then
            Assert.That(postResponse.StatusCode, Is.EqualTo(HttpStatusCode.Created));

            Assert.That(list.Any(a => a.Name == "Kill Bill"));
        }

        [Test]
        public void Should_return_single_activity()
        {
            // given
            var activity = new Activity("Kill Bill II", new DateTime(2014, 09, 09), 150, ActivityType.Movie)
            {
                WatchedInCinema = true
            };

            var serializedActivity = JsonConvert.SerializeObject(activity);

            _browser.Post("/activities", with =>
            {
                with.HttpsRequest();
                with.Body(serializedActivity, ApplicationJson);
            });

            // when
            var response = _browser.Get("/activities/1");

            var asString = response.Body.AsString();
            var deserializedActivity = JsonConvert.DeserializeObject<Activity>(asString);

            // then
            Assert.That(deserializedActivity.Name, Is.EqualTo("Kill Bill II"));
            Assert.That(deserializedActivity.Id, Is.EqualTo(1));
            Assert.That(deserializedActivity.WatchedInCinema, Is.True);
            Assert.That(deserializedActivity.ActivityType, Is.EqualTo(ActivityType.Movie));
        }

        [Test]
        public void Should_update_activity_name()
        {
            // given
            var activity = new Activity("Jurassic Park", new DateTime(2014, 09, 09), 120, ActivityType.Movie)
            {
                WatchedInCinema = true
            };

            _activityService.AddNew(activity);

            // when
            var serializedName = JsonConvert.SerializeObject(new { NewName = "Jurassic Park II" });

            _browser.Put("/activities/changeName/" + activity.Id, with =>
            {
                with.HttpRequest();
                with.Body(serializedName, ApplicationJson);
            });

            var response = _browser.Get("/activities/" + activity.Id);
            var deserializedActivity = JsonConvert.DeserializeObject<Activity>(response.Body.AsString());

            // then
            Assert.That(deserializedActivity.Name, Is.EqualTo("Jurassic Park II"));
        }

        [Test]
        public void Should_return_activity_with_type_as_type_name_not_number()
        {
            // should be:
            // { 
            //  ...
            //  "ActivityType": "Movie"
            //  ...
            // }
            // not:
            // { 
            //  ...
            //  "ActivityType": 0
            //  ...
            // }

            // given
            _activityService.AddNew(
                new Activity("Matrix", new DateTime(2008, 12, 12), 200, ActivityType.Movie));

            // when
            var response = _browser.Get("/activities");

            // then
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            var asString = response.Body.AsString();

            Assert.That(asString, Contains.Substring("Movie"));
        }
    }
}