namespace App.Modules
{
    using System.Runtime.InteropServices;
    using App.Infrastructure;
    using Nancy;
    using Nancy.Extensions;

    public class ViewsModule : NancyModule
    {
        public ViewsModule()
        {
            Get["/"] = _ =>
            {
                return View["index.html"];
            };
        }
    }
}