namespace App
{
    using System;
    using Microsoft.Owin.Hosting;

    public class Program
    {
        static void Main(string[] args)
        {
            const string url = "http://+:8080";

            using (WebApp.Start<Startup>(url))
            {
                Console.WriteLine("Running on {0}", url);
                Console.WriteLine("Press enter to exit");

                System.Diagnostics.Process.Start("http://localhost:8080");

                Console.ReadLine();
            }
        }
    }
}