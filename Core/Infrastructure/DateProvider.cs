namespace Core.Infrastructure
{
    using System;

    public class DateProvider : IDateProvider
    {
        public DateTime GetCurrentDate()
        {
            return DateTime.Now;
        }
    }
}