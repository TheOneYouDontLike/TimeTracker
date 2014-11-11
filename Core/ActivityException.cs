namespace Core
{
    using System;

    public class ActivityException : Exception
    {
        public ActivityException(string message) : base(message) { }
    }
}