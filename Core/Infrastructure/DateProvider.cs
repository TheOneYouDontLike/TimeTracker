namespace App.Infrastructure
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