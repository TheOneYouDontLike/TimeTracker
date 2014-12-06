namespace App
{
    using System;

    public class Activity
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
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

        public Activity(string name, DateTime date, int duration, ActivityType activityType)
        {
            Name = name;
            Date = date;
            Duration = duration;
            ActivityType = activityType;
        }

        private Activity() { }

        public void ChangeName(string newName)
        {
            Name = newName;
        }
    }
}