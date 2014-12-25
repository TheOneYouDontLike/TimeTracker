namespace App
{
    using App.Domain;
    using App.Infrastructure;
    using Microsoft.Owin.Extensions;
    using Nancy;
    using Nancy.Conventions;
    using Nancy.TinyIoc;
    using Owin;
    using Raven.Abstractions.Extensions;
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

            container.Register<IActivityService, RavenDbActivityService>().AsSingleton();

            var embeddableDocumentStore = new EmbeddableDocumentStore
            {
                RunInMemory = true
            };

            embeddableDocumentStore.Initialize();

            container.Register<IDocumentStore>(embeddableDocumentStore);
        }
    }
}