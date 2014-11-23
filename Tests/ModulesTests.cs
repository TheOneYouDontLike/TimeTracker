namespace Tests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Cryptography;
    using Core;
    using FakeItEasy;
    using Nancy;
    using Nancy.Extensions;
    using Nancy.Testing;
    using NUnit.Framework;
    using Raven.Client.Embedded;
    using Newtonsoft.Json;
    using Browser = Nancy.Testing.Browser;

    [TestFixture]
    public class ModulesTests
    {
        private const string ApplicationJson = "application/json";
        private Browser _browser;
        private ActivityService _activityService;
        private EmbeddableDocumentStore _embeddableDocumentStore;

        [SetUp]
        public void Setup()
        {
            _embeddableDocumentStore = new EmbeddableDocumentStore { RunInMemory = true };
            _embeddableDocumentStore.Initialize();

            _activityService = new ActivityService(_embeddableDocumentStore);

            _browser = new Browser(
                with => with.Module(new ActivityApiModule(_activityService)),
                context => context.Accept(ApplicationJson));

            JsonConvert.DefaultSettings += JsonSettings.EnumSerialization;
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

            Console.WriteLine(response.Body.AsString());
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

            var serializedActivity = JsonConvert.SerializeObject(activity);

            // when
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
            //TODO: check Id deserialization and WatchedInCinemaProperty
            var deserializedActivity = JsonConvert.DeserializeObject<Activity>(asString);

            // then
            Assert.That(deserializedActivity.Name, Is.EqualTo("Kill Bill II"));
            Assert.That(deserializedActivity.Id, Is.EqualTo(1));
        }
    }

    public class ActivityApiModule : NancyModule
    {
        private readonly ActivityService _activityService;

        public ActivityApiModule(ActivityService activityService)
        {
            _activityService = activityService;

            JsonConvert.DefaultSettings += JsonSettings.EnumSerialization;

            Get["/activities"] = _ =>
            {
                var activities = _activityService.GetAll();

                var serializedAcivities = JsonConvert.SerializeObject(activities);

                var response = (Response)serializedAcivities;
                response.StatusCode = HttpStatusCode.OK;

                return response;
            };

            Post["/activities"] = _ =>
            {
                var deserializedActivity = JsonConvert.DeserializeObject<Activity>(Request.Body.AsString());

                _activityService.AddNew(deserializedActivity);

                return HttpStatusCode.Created;
            };

            Get["/activities/{id}"] = _ =>
            {
                var id = _.id;
                var activity = _activityService.GetById(id);
                var serializedAcivity = JsonConvert.SerializeObject(activity);

                var response = (Response)serializedAcivity;

                return response;
            };
        }
    }
}