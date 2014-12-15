namespace App
{
    using App.Domain;
    using App.Infrastructure;
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
        }

        protected override IRootPathProvider RootPathProvider
        {
            get { return new SelfhostRootPathProvider(); }
        }

        protected override void ConfigureConventions(NancyConventions nancyConventions)
        {
            nancyConventions.StaticContentsConventions.Add(
                StaticContentConventionBuilder.AddDirectory("/", "Web/", new[] { "js" }));
            base.ConfigureConventions(nancyConventions);
        }

        protected override void ConfigureApplicationContainer(TinyIoCContainer container)
        {
            base.ConfigureApplicationContainer(container);

            container.Register<IActivityService, ActivityService>().AsSingleton();

            var embeddableDocumentStore = new EmbeddableDocumentStore
            {
                RunInMemory = true
            };

            embeddableDocumentStore.Initialize();

            container.Register<IDocumentStore>(embeddableDocumentStore);
        }
    }
}