namespace Tests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Core;
    using CsQuery.ExtensionMethods;
    using CsQuery.Utility;
    using Nancy;
    using Nancy.Testing;
    using NUnit.Framework;
    using Raven.Client.Embedded;
    using Newtonsoft.Json;
    using Browser = Nancy.Testing.Browser;

    [TestFixture]
    public class ModulesTests
    {
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
                context => context.Accept("application/json"));
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
        }
    }
}