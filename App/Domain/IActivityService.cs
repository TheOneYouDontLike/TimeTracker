namespace App.Domain
{
    using System.Collections.Generic;

    public interface IActivityService
    {
        void AddNew(Activity activity);
        Activity GetById(int id);
        List<Activity> GetAll();
        void ChangeActivityName(int id, string newName);
    }
}