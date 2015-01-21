namespace App.Modules
{
    using System.Globalization;
    using App.Domain;
    using App.Infrastructure;
    using App.Infrastructure.Exceptions;
    using Nancy;
    using Nancy.Extensions;
    using Newtonsoft.Json;
    using System;

    public class ActivityApiModule : NancyModule
    {
        private readonly ActivityService _activityService;
        private readonly DateProvider _basicDateProvider;

        public ActivityApiModule(ActivityService activityService, DateProvider basicDateProvider)
        {
            _activityService = activityService;
            _basicDateProvider = basicDateProvider;

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

                var activityId = _activityService.AddNew(deserializedActivity);
                var responseWithActivityId = (Response) activityId.ToString(CultureInfo.InvariantCulture);
                responseWithActivityId.StatusCode = HttpStatusCode.Created;

                return responseWithActivityId;
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

                try
                {
                    switch (deserializedObject.ActivityProperty)
                    {
                        case "Name":
                            _activityService.ChangeActivityName(_.id, deserializedObject.ActivityValue);
                            break;
                        case "Date":
                            _activityService.ChangeActivityDate(_.id,
                                Convert.ToDateTime(deserializedObject.ActivityValue));
                            break;
                        case "Duration":
                            _activityService.ChangeActivityDuration(_.id,
                                Convert.ToInt32(deserializedObject.ActivityValue));
                            break;
                        case "ActivityType":
                            _activityService.ChangeActivityType(_.id,
                                (ActivityType) Enum.Parse(typeof (ActivityType), deserializedObject.ActivityValue));
                            break;
                        case "WatchedInCinema":
                            _activityService.SetAsWatchedInCinema(_.id, Boolean.Parse(deserializedObject.ActivityValue));
                            break;
                        default:
                            return PrepareBadRequestResponse("Invalid update request");
                    }
                }
                catch (Exception exception)
                {
                    return PrepareBadRequestResponse(string.Format("Invalid update request, probably sth with js but it is possible that you are trying to sabotage this defenseless app. \n Additional info: {0}", exception.Message));
                }

                return HttpStatusCode.OK;
            };

            Get["/activities/statistics"] = _ =>
            {
                var activities = _activityService.GetAll();

                var statistics = new Statistics(activities, _basicDateProvider);

                var serializedStatistics = JsonConvert.SerializeObject(statistics);

                var response = (Response)serializedStatistics;
                PrepareOkResponseForGetMethod(response);

                return response;
            };

            Delete["/activities/{id}"] = _ =>
            {
                try
                {
                    _activityService.Delete(_.id);
                }
                catch (ActivityDoesNotExist exception)
                {
                    var response = (Response) exception.Message;
                    response.StatusCode = HttpStatusCode.NotFound;

                    return response;
                }

                return HttpStatusCode.OK;
            };
        }

        private static dynamic PrepareBadRequestResponse(string message)
        {
            var response = (Response)message;
            response.StatusCode = HttpStatusCode.BadRequest;

            return response;
        }

        private static void PrepareOkResponseForGetMethod(Response response)
        {
            response.ContentType = "application/json";
            response.StatusCode = HttpStatusCode.OK;
        }
    }
}