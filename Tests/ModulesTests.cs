namespace Tests
{
    using Nancy;
    using NUnit.Framework;

    [TestFixture]
    public class ModulesTests
    {
        [Test]
        public void ShouldCreateHomeNancyModule()
        {
            var module = new HomeModule();
        }
    }

    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            
        } 
    }
}