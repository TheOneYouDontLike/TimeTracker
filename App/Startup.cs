namespace App
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.InteropServices;
    using App.Domain;
    using App.Infrastructure;
    using Microsoft.Owin.Extensions;
    using Nancy;
    using Nancy.Conventions;
    using Nancy.TinyIoc;
    using Owin;
    using Raven.Client;
    using Raven.Client.Embedded;

    public class Startup : DefaultNancyBootstrapper
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseNancy();
            app.UseStageMarker(PipelineStage.MapHandler);
        }

        protected override IRootPathProvider RootPathProvider
        {
            get { return new SelfhostRootPathProvider(); }
        }

        protected override void ConfigureConventions(NancyConventions nancyConventions)
        {
            base.ConfigureConventions(nancyConventions);

            nancyConventions.StaticContentsConventions
                .AddDirectory("/vendor", "Web/node_modules/bootstrap/dist/css", new[] { "css", "map" });

            nancyConventions.StaticContentsConventions
                .AddDirectory("/", "Web", new[] {"js"});
            
        }

        protected override void ConfigureApplicationContainer(TinyIoCContainer container)
        {
            base.ConfigureApplicationContainer(container);

            container.Register<ActivityService, RavenDbActivityService>().AsSingleton();
            container.Register<DateProvider, BasicDateProvider>().AsSingleton();

            var embeddableDocumentStore = new EmbeddableDocumentStore();
            embeddableDocumentStore.Initialize();
            SeedWithSampleDataIfDbIsEmpty(embeddableDocumentStore);

            container.Register<IDocumentStore>(embeddableDocumentStore);
        }

        private void SeedWithSampleDataIfDbIsEmpty(IDocumentStore documentStore)
        {
            using (var session = documentStore.OpenSession())
            {
                if (session.Query<Activity>().Count() != 0)
                {
                    return;
                }

                foreach (var activity in SomeActivities())
                {
                    session.Store(activity);
                }
                session.SaveChanges();
            }
        }

        private static IEnumerable<Activity> SomeActivities()
        {
            return new List<Activity>
            {
                new Activity("Matrix", new DateTime(2008, 12, 12), 200, ActivityType.Movie),
                new Activity("Matrix II", new DateTime(2008, 12, 12), 200, ActivityType.Movie),
                new Activity("Kill Bill", new DateTime(2014, 09, 09), 150, ActivityType.Movie)
                {
                    WatchedInCinema = true
                },
                new Activity("Simpsons", new DateTime(2014, 09, 09), 120, ActivityType.Movie)
                {
                    WatchedInCinema = false
                },
                new Activity("Jurassic Park", new DateTime(2014, 09, 09), 120, ActivityType.Movie)
                {
                    WatchedInCinema = true
                }
            };
        }
    }
}