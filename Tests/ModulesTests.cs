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
            var module = new ActivityApiModule();
        }
    }

    public class ActivityApiModule : NancyModule
    {
    }
}