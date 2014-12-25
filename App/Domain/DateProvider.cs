namespace App.Domain
{
    using System;

    public interface DateProvider
    {
        DateTime GetCurrentDate();
    }
}