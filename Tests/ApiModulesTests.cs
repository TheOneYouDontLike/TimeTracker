namespace Tests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using App.Domain;
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
        public void Should_not_deserialize_activity_if_there_was_parsing_error()
        {
            // given
            var notValidActivity = 
                @"{'Name': 'Name',
                'Date': '2014-02-02',
                'Duration': 134,
                'ActivityType': 'Series',
                'WatchedInCinema': true}";
            
            // when

            var deserializingActivity = new TestDelegate(() =>
            {
                JsonConvert.DeserializeObject<Activity>(notValidActivity);
            });

            // then
            var exception = Assert.Throws<JsonSerializationException>(deserializingActivity);
            Assert.That(exception.InnerException.Message, Is.EqualTo("Series cannot be watched in the cinema."));
        }

        [Test]
        public void Should_not_add_activity_if_there_was_parsing_error()
        {
            // given
            var notValidActivity = 
                @"{'Name': 'Name',
                'Date': '2014-02-02',
                'Duration': 134,
                'ActivityType': 'Series',
                'WatchedInCinema': true}";

            // when
            var response = _browser.Post("/activities", with => 
            {
                with.HttpsRequest();
                with.Body(notValidActivity, ApplicationJson);
            });

            // then
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body.AsString(), Is.EqualTo("Series cannot be watched in the cinema."));
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
            var serializedName = JsonConvert.SerializeObject(new {
            activityId = activity.Id,
            activityProperty = "Name",
            activityValue = "Jurassic Park II"});

            _browser.Put("/activities/updateActivity/" + activity.Id, with =>
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
        public void Should_update_activity_date()
        {
            // given
            var activity = new Activity("Jurassic Park", new DateTime(2014, 09, 09), 120, ActivityType.Movie)
            {
                WatchedInCinema = true
            };

            _activityService.AddNew(activity);

            // when
            var serializedDate = JsonConvert.SerializeObject(new {
            activityId = activity.Id,
            activityProperty = "Date",
            activityValue = "2014-03-31"});

            _browser.Put("/activities/updateActivity/" + activity.Id, with =>
            {
                with.HttpRequest();
                with.Body(serializedDate, ApplicationJson);
            });

            var response = _browser.Get("/activities/" + activity.Id);
            var deserializedActivity = JsonConvert.DeserializeObject<Activity>(response.Body.AsString());

            // then
            var newDate = Convert.ToDateTime("2014-03-31").ToString();
            Assert.That(deserializedActivity.Date.ToString(), Is.EqualTo(newDate));
        }

        [Test]
        public void Should_update_activity_duration()
        {
            // given
            var activity = new Activity("Jurassic Park", new DateTime(2014, 09, 09), 120, ActivityType.Movie)
            {
                WatchedInCinema = true
            };

            _activityService.AddNew(activity);

            // when
            var serializedDuration = JsonConvert.SerializeObject(new {
            activityId = activity.Id,
            activityProperty = "Duration",
            activityValue = 200});

            _browser.Put("/activities/updateActivity/" + activity.Id, with =>
            {
                with.HttpRequest();
                with.Body(serializedDuration, ApplicationJson);
            });

            var response = _browser.Get("/activities/" + activity.Id);
            var deserializedActivity = JsonConvert.DeserializeObject<Activity>(response.Body.AsString());

            // then
            var newDuration = 200;
            Assert.That(deserializedActivity.Duration, Is.EqualTo(newDuration));
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