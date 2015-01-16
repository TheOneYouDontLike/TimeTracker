namespace App.Modules
{
    using App.Domain;
    using App.Infrastructure;
    using Nancy;
    using Nancy.Extensions;
    using Newtonsoft.Json;
    using System;

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
                Activity deserializedActivity;
                try
                {
                    deserializedActivity = JsonConvert.DeserializeObject<Activity>(Request.Body.AsString());
                }
                catch(JsonSerializationException exception)
                {
                    var response = (Response)exception.InnerException.Message;
                    response.StatusCode = HttpStatusCode.BadRequest;

                    return response;
                }

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

            Put["/activities/updateActivity/{id}"] = _ =>
            {
                var newName = Request.Body.AsString();
                var deserializedObject = JsonConvert.DeserializeAnonymousType(newName, new { ActivityId = 0, ActivityProperty = "", ActivityValue = "" });

                switch (deserializedObject.ActivityProperty)
                {
                    case "Name": _activityService.ChangeActivityName(_.id, deserializedObject.ActivityValue); break;
                    case "Date": _activityService.ChangeActivityDate(_.id, Convert.ToDateTime(deserializedObject.ActivityValue)); break;
                    case "Duration": _activityService.ChangeActivityDuration(_.id, Convert.ToInt32(deserializedObject.ActivityValue)); break;
                    case "ActivityType": _activityService.ChangeActivityType(_.id, (ActivityType)Enum.Parse(typeof(ActivityType), deserializedObject.ActivityValue)); break;
                    case "WatchedInCinema": _activityService.SetAsWatchedInCinema(_.id, Boolean.Parse(deserializedObject.ActivityValue)); break;
                }

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