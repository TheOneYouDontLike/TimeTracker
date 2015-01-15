namespace App.Domain
{
    using System.Collections.Generic;
    using System;

    public interface ActivityService
    {
        void AddNew(Activity activity);
        Activity GetById(int id);
        List<Activity> GetAll();
        void ChangeActivityName(int id, string newName);
        void ChangeActivityDate(int id, DateTime newDate);
        void ChangeActivityDuration(int id, int duration);
    }
}