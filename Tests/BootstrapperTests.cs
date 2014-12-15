namespace Tests
{
    using System;
    using App;
    using Nancy;
    using Nancy.Testing;
    using NUnit.Framework;

    [TestFixture]
    public class BootstrapperTests
    {
        private Browser _browser;

        [TestFixtureSetUp]
        public void SetupFixure()
        {
            // given
            var startupBootstrapper = new Startup();
            _browser = new Browser(startupBootstrapper);
        }

        [Test]
        public void Should_return_javascript_files_from_application_root()
        {
            // when
            var browserResponse = _browser.Get("/bundle.js", with => with.HttpRequest());

            // then
            Assert.That(browserResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        }
        
        [Test]
        public void Should_return_css_files_from_child_folders_relative_to_application_root()
        {
            // when
            var browserResponse = _browser.Get("/vendor/bootstrap.css", with => with.HttpRequest());

            // then
            Assert.That(browserResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        }
    }
}