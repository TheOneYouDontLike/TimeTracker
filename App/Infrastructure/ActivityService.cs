namespace App.Infrastructure
{
    using System.Collections.Generic;
    using System.Linq;
    using Raven.Client;
    using Raven.Client.Linq;

    public interface IActivityService
    {
        void AddNew(Activity activity);
        Activity GetById(int id);
        List<Activity> GetAll();
        void ChangeActivityName(int id, string newName);
    }

    public class ActivityService : IActivityService
    {
        private readonly IDocumentStore _documentStore;

        public ActivityService(IDocumentStore documentStore)
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
            _documentStore.Initialize();
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
    }
}