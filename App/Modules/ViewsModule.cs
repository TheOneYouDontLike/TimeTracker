namespace App.Modules
{
    using Nancy;

    public class ViewsModule : NancyModule
    {
        public ViewsModule()
        {
            Get["/"] = _ =>
            {
                return View["Web/index.html"];
            };
        }
    }
}