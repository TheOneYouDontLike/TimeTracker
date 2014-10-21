namespace Tests
{
    using System;
    using Core.Infrastructure;
    using NUnit.Framework;

    [TestFixture]
    public class DateProviderTests
    {
        [Test]
        public void ShouldReturnCurrentDate()
        {
            // given
            var dateProvider = new DateProvider();

            // when
            var currentDate = dateProvider.GetCurrentDate();

            // then
            Assert.That(currentDate, Is.EqualTo(DateTime.Now));
        }
    }
}