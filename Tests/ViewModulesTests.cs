namespace Tests
{
    using App;
    using App.Infrastructure;
    using App.Modules;
    using Nancy;
    using Nancy.Testing;
    using NUnit.Framework;

    [TestFixture]
    public class ViewModulesTests
    {
        [Test]
        public void Should_return_index_view()
        {
            // given
            var browser = new Browser(with =>
            {
                with.Module(new ViewsModule());
                //with.RootPathProvider<SelfhostRootPathProvider>();
            });

            // when
            var browserResponse = browser.Get("/");

            // then
            Assert.That(browserResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            browserResponse.Body["#main-container"].ShouldExist();
        }
    }
}