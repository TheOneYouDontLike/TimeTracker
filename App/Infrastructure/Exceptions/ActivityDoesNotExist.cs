namespace App.Infrastructure.Exceptions
{
    using System;

    public class ActivityDoesNotExist : Exception
    {
        public ActivityDoesNotExist() : base("Activity does not exist."){}
    }
}