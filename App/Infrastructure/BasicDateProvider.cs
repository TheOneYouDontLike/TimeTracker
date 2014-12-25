namespace App.Infrastructure
{
    using System;
    using App.Domain;

    public class BasicDateProvider : DateProvider
    {
        public DateTime GetCurrentDate()
        {
            return DateTime.Now;
        }
    }
}