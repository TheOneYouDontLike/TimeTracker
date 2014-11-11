namespace Core
{
    using System;

    public class Activity
    {
        public DateTime Date { get; private set; }
        public int Duration { get; private set; }
        public ActivityType ActivityType { get; private set; }
        private bool _watchedInCinema;

        public bool WatchedInCinema
        {
            get { return _watchedInCinema; }
            set
            {
                if (value && ActivityType == ActivityType.Series)
                {
                    throw new ActivityException("Series cannot be watched in the cinema.");
                }
                _watchedInCinema = value;
            }
        }

        public Activity(DateTime date, int duration, ActivityType activityType)
        {
            Date = date;
            Duration = duration;
            ActivityType = activityType;
        }
    }
}