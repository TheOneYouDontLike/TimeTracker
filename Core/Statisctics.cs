namespace Core
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class Statisctics
    {
        private readonly List<Activity> _listOfActivities;
        private readonly IDateProvider _dateProvider;

        public Statisctics(List<Activity> listOfActivities, IDateProvider dateProvider)
        {
            _listOfActivities = listOfActivities;
            _dateProvider = dateProvider;
        }

        public int TimeSpan()
        {
            var smallestDate = _listOfActivities.Min(activity => activity.Date);
            var totalDays = _dateProvider.GetCurrentDate().Subtract(smallestDate).TotalDays;

            return Convert.ToInt32(Math.Floor(totalDays));
        }

        public int TotalDurationOfActivities()
        {
            return _listOfActivities.Sum(activity => activity.Duration);
        }

        public int TotalDurationOfActivities(ActivityType activityType)
        {
            return _listOfActivities.Where(activity => activity.Type == activityType).Sum(activity => activity.Duration);
        }
    }
}