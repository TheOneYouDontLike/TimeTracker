namespace Core
{
    using System;

    public class ActivityItem
    {
        private readonly DateTime _date;
        private readonly int _duration;
        private readonly ActivityType _activityType;

        public ActivityItem(DateTime date, int duration, ActivityType activityType)
        {
            _date = date;
            _duration = duration;
            _activityType = activityType;
        }

        public int Duration
        {
            get { return _duration; }
        }

        public DateTime Date
        {
            get { return _date; }
        }
    }
}