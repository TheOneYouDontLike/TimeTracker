namespace Tests
{
    using System;
    using System.Collections.Generic;
    using System.Runtime.InteropServices;
    using System.Runtime.Remoting.Messaging;
    using Core;
    using Nancy;
    using Nancy.Responses.Negotiation;
    using Nancy.Testing;
    using NUnit.Framework;
    using Raven.Client.Embedded;

    [TestFixture]
    public class ModulesTests
    {
        [Test]
        public void ShouldReturnAllActivities()
        {
            // given
            var embeddableDocumentStore = new EmbeddableDocumentStore();
            embeddableDocumentStore.Initialize();

            var activityService = new ActivityService(embeddableDocumentStore);
            activityService.AddNew(new Activity("Matrix", new DateTime(2008, 12, 12), 200, ActivityType.Movie));
            activityService.AddNew(new Activity("Matrix II", new DateTime(2008, 12, 12), 200, ActivityType.Movie));
            
            var browser = new Browser(
                with => with.Module(new ActivityApiModule(activityService)), 
                context => context.Accept("application/json"));

            // when
            var browserResponse = browser.Get("/activities");

            // then
            Assert.That(browserResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            
            var list = browserResponse.Body.DeserializeJson<List<Activity>>();
            Assert.That(list[0].Name, Is.EqualTo("Matrix"));
            Assert.That(list[1].Name, Is.EqualTo("Matrix II"));
        }
    }

    public class ActivityApiModule : NancyModule
    {
        private readonly ActivityService _activityService;

        public ActivityApiModule(ActivityService activityService)
        {
            _activityService = activityService;
            Get["/activities"] = _ =>
            {

                var activities = _activityService.GetAll();

                return Negotiate
                    .WithContentType("application/json")
                    .WithStatusCode(HttpStatusCode.OK)
                    .WithModel(activities);
            };
        }
    }
}