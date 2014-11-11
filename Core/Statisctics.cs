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
            return _listOfActivities.Where(activity => activity.ActivityType == activityType).Sum(activity => activity.Duration);
        }

        public double AverageIntervalBetweenActivities()
        {
            var totalDays = 0.0;
            var sortedListOfActivities = _listOfActivities.OrderBy(activity => activity.Date).ToList();

            for (var i = 0; i < sortedListOfActivities.Count - 1; i++)
            {
                var nextActivityDate = sortedListOfActivities[i + 1].Date;
                var previousActivityDate = sortedListOfActivities[i].Date;

                totalDays += nextActivityDate.Subtract(previousActivityDate).TotalDays;
            }

            var numberOfIntervals = sortedListOfActivities.Count - 1;

            return totalDays / numberOfIntervals;
        }

        public int TotalNumberOfMovies()
        {
            return _listOfActivities.Count(activity => activity.ActivityType == ActivityType.Movie);
        }

        public int TotalNumberOfSeries()
        {
            return _listOfActivities.Count(activity => activity.ActivityType == ActivityType.Series);
        }
    }
}