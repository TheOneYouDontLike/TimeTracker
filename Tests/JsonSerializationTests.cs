namespace Tests
{
    using System;
    using System.Collections.Generic;
    using App;
    using Newtonsoft.Json;
    using NUnit.Framework;

    [TestFixture]
    public class JsonSerializationTests
    {
        [Test]
        public void Should_serialize_activity_type_as_string()
        {
            // given
            JsonConvert.DefaultSettings += JsonSettings.EnumSerialization;

            // when
            var jsonString = JsonConvert.SerializeObject(ActivityType.Movie);

            // then
            Assert.That(jsonString, Is.EqualTo("\"Movie\""));
        }

        [Test]
        public void Should_deserialize_activity_json()
        {
            // given
            var activity = new Activity("Vertigo", new DateTime(2014, 02, 02), 100, ActivityType.Movie);
            JsonConvert.DefaultSettings += JsonSettings.EnumSerialization;

            // when
            var jsonString = JsonConvert.SerializeObject(activity);
            var deserializedActivity = JsonConvert.DeserializeObject<Activity>(jsonString);
            Console.WriteLine(jsonString);

            // then
            Assert.That(deserializedActivity.Name, Is.EqualTo("Vertigo"));
            Assert.That(deserializedActivity.ActivityType, Is.EqualTo(ActivityType.Movie));
        }

        [Test]
        public void Should_deserialize_activity_list_json()
        {
            // given
            var activity = new Activity("Vertigo", new DateTime(2014, 02, 02), 100, ActivityType.Movie);
            var activity2 = new Activity("Vertigo", new DateTime(2014, 02, 02), 100, ActivityType.Movie);

            var activities = new List<Activity>
            {
                activity,
                activity2
            };

            JsonConvert.DefaultSettings += JsonSettings.EnumSerialization;

            // when
            var jsonString = JsonConvert.SerializeObject(activities);
            var deserializedActivities = JsonConvert.DeserializeObject<List<Activity>>(jsonString);
            Console.WriteLine(jsonString);

            // then
            Assert.That(deserializedActivities[0].Name, Is.EqualTo("Vertigo"));
            Assert.That(deserializedActivities[0].ActivityType, Is.EqualTo(ActivityType.Movie));
        }
    }
}