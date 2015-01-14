namespace App.Infrastructure
{
    using System.Collections.Generic;
    using System.Linq;
    using App.Domain;
    using Raven.Client;
    using System;    

    public class RavenDbActivityService : ActivityService
    {
        private readonly IDocumentStore _documentStore;

        public RavenDbActivityService(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        public void AddNew(Activity activity)
        {
            using (var session = _documentStore.OpenSession())
            {
                session.Store(activity);
                session.SaveChanges();
            }
        }

        public Activity GetById(int id)
        {
            using (var session = _documentStore.OpenSession())
            {
                return session.Load<Activity>(id);
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
                activityToUpdate.ChangeName(newName);
                documentSession.SaveChanges();
            }
        }

        public void ChangeActivityDate(int id, DateTime newDate)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var activityToUpdate = documentSession.Load<Activity>(id);
                activityToUpdate.ChangeDate(newDate);
                documentSession.SaveChanges();
            }
        }
    }
}