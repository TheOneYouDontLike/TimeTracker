namespace App
{
    using System.Runtime.InteropServices.ComTypes;
    using App.Infrastructure;
    using Nancy;
    using Nancy.Bootstrapper;
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