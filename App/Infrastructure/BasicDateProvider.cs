namespace App.Infrastructure
{
    using System;

    public class BasicDateProvider : IDateProvider
    {
        public DateTime GetCurrentDate()
        {
            return DateTime.Now;
        }
    }
}