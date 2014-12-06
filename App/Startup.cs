namespace App
{
    using App.Infrastructure;
    using Nancy.TinyIoc;
    using Owin;
    using Raven.Client;
    using Raven.Client.Embedded;

    public class Startup : Nancy.DefaultNancyBootstrapper
    {
        public void Configuration(IAppBuilder app)
        {
            var container = TinyIoCContainer.Current;
            container.Register<IActivityService, ActivityService>().AsSingleton();
            container.Register<IDocumentStore>(new EmbeddableDocumentStore()
            {
                RunInMemory = true
            });
            app.UseNancy();   
        }       
    }
}