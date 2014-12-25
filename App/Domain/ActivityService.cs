namespace App.Domain
{
    using System.Collections.Generic;

    public interface ActivityService
    {
        void AddNew(Activity activity);
        Activity GetById(int id);
        List<Activity> GetAll();
        void ChangeActivityName(int id, string newName);
    }
}