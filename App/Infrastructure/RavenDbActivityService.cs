namespace App.Infrastructure
{
    using System.Collections.Generic;
    using System.Linq;
    using App.Domain;
    using App.Infrastructure.Exceptions;
    using Raven.Client;
    using System;    

    public class RavenDbActivityService : ActivityService
    {
        private readonly IDocumentStore _documentStore;

        public RavenDbActivityService(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        public int AddNew(Activity activity)
        {
            using (var session = _documentStore.OpenSession())
            {
                session.Store(activity);
                session.SaveChanges();
            }

            return activity.Id;
        }

        public Activity GetById(int id)
        {
            using (var session = _documentStore.OpenSession())
            {
                var activity = session.Load<Activity>(id);
                CheckIfDoesExist(activity);

                return activity;
            }
        }

        public List<Activity> GetAll()
        {
            using (var session = _documentStore.OpenSession())
            {
                return session.Query<Activity>().ToList();
            }
        }

        public void ChangeActivityName(int id, string newName)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var activityToUpdate = documentSession.Load<Activity>(id);
                CheckIfDoesExist(activityToUpdate);
                
                activityToUpdate.ChangeName(newName);
                documentSession.SaveChanges();
            }
        }

        public void ChangeActivityDate(int id, DateTime newDate)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var activityToUpdate = documentSession.Load<Activity>(id);
                CheckIfDoesExist(activityToUpdate);

                activityToUpdate.ChangeDate(newDate);
                documentSession.SaveChanges();
            }
        }

        public void ChangeActivityDuration(int id, int newDuration)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var activityToUpdate = documentSession.Load<Activity>(id);
                CheckIfDoesExist(activityToUpdate);

                activityToUpdate.ChangeDuration(newDuration);
                documentSession.SaveChanges();
            }
        }

        public void ChangeActivityType(int id, ActivityType newType)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var activityToUpdate = documentSession.Load<Activity>(id);
                CheckIfDoesExist(activityToUpdate);

                activityToUpdate.ChangeType(newType);
                documentSession.SaveChanges();
            }
        }

        public void SetAsWatchedInCinema(int id, bool wasWatchedInCinema)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var activityToUpdate = documentSession.Load<Activity>(id);
                CheckIfDoesExist(activityToUpdate);

                activityToUpdate.SetAsWatchedInCinema(wasWatchedInCinema);
                documentSession.SaveChanges();
            }
        }

        public void Delete(int activityId)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var activity = documentSession.Load<Activity>(activityId);
                CheckIfDoesExist(activity);

                documentSession.Delete<Activity>(activityId);
                documentSession.SaveChanges();
            }
        }

        private static void CheckIfDoesExist(Activity activityToUpdate)
        {
            if (activityToUpdate == null)
            {
                throw new ActivityDoesNotExist();
            }
        }
    }
}