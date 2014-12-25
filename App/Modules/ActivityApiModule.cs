namespace App.Modules
{
    using App.Domain;
    using App.Infrastructure;
    using Nancy;
    using Nancy.Extensions;
    using Newtonsoft.Json;

    public class ActivityApiModule : NancyModule
    {
        private readonly ActivityService _activityService;

        public ActivityApiModule(ActivityService activityService)
        {
            _activityService = activityService;

            JsonConvert.DefaultSettings += JsonSettings.GlobalJsonSerializerSettings;

            Get["/activities"] = _ =>
            {
                var activities = _activityService.GetAll();

                var serializedAcivities = JsonConvert.SerializeObject(activities);

                var response = (Response)serializedAcivities;
                PrepareOkResponseForGetMethod(response);

                return response;
            };

            Post["/activities"] = _ =>
            {
                var deserializedActivity = JsonConvert.DeserializeObject<Activity>(Request.Body.AsString());

                _activityService.AddNew(deserializedActivity);

                return HttpStatusCode.Created;
            };

            Get["/activities/{id}"] = _ =>
            {
                var activity = _activityService.GetById(_.id);
                var serializedAcivity = JsonConvert.SerializeObject(activity);

                var response = (Response)serializedAcivity;
                PrepareOkResponseForGetMethod(response);

                return response;
            };

            Put["/activities/changeName/{id}"] = _ =>
            {
                var newName = Request.Body.AsString();
                var deserializedObject = JsonConvert.DeserializeAnonymousType(newName, new { NewName = "" });
                _activityService.ChangeActivityName(_.id, deserializedObject.NewName);

                return HttpStatusCode.OK;
            };
        }

        private static void PrepareOkResponseForGetMethod(Response response)
        {
            response.ContentType = "application/json";
            response.StatusCode = HttpStatusCode.OK;
        }
    }
}