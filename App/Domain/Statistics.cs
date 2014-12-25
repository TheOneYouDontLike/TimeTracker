namespace App
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class Statistics
    {
        private readonly List<Activity> _listOfActivities;
        private readonly DateProvider _dateProvider;

        public Statistics(List<Activity> listOfActivities, DateProvider dateProvider)
        {
            _listOfActivities = listOfActivities;
            _dateProvider = dateProvider;
        }

        public int TotalTimeSpan()
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

        public int TotalNumberOfMovies
        {
            get { return _listOfActivities.Count(activity => activity.ActivityType == ActivityType.Movie); }
        }

        public int TotalNumberOfSeries
        {
            get { return _listOfActivities.Count(activity => activity.ActivityType == ActivityType.Series); }
        }

        public double AverageIntervalBetweenActivities
        {
            get
            {
                var sortedListOfActivities = _listOfActivities.OrderBy(activity => activity.Date).ToList();

                return CalculateAverageIntervalBetweenSortedActivities(sortedListOfActivities);
            }
        }

        public double AverageIntervalBetweenCinemaVisits
        {
            get
            {
                var sortedListOfActivities = _listOfActivities
                    .Where(activity => activity.WatchedInCinema)
                    .OrderBy(activity => activity.Date).ToList();

                return CalculateAverageIntervalBetweenSortedActivities(sortedListOfActivities);
            }
        }

        private static double CalculateAverageIntervalBetweenSortedActivities(List<Activity> sortedListOfActivities)
        {
            var totalDays = 0.0;

            for (var i = 0; i < sortedListOfActivities.Count - 1; i++)
            {
                var nextActivityDate = sortedListOfActivities[i + 1].Date;
                var previousActivityDate = sortedListOfActivities[i].Date;

                totalDays += nextActivityDate.Subtract(previousActivityDate).TotalDays;
            }

            var numberOfIntervals = sortedListOfActivities.Count - 1;

            return totalDays / numberOfIntervals;
        }
    }
}