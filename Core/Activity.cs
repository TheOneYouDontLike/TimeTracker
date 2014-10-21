namespace Core
{
    using System;

    public class Activity
    {
        private readonly DateTime _date;
        private readonly int _duration;
        private readonly ActivityType _activityType;

        public Activity(DateTime date, int duration, ActivityType activityType)
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

        public ActivityType Type
        {
            get { return _activityType; }
        }
    }
}