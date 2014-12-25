namespace App.Infrastructure
{
    using System;
    using System.Collections.Generic;
    using System.Reflection;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;
    using Newtonsoft.Json.Serialization;

    public static class JsonSettings
    {
        public static Func<JsonSerializerSettings> GlobalJsonSerializerSettings
        {
            get
            {
                var jsonSettings = new Func<JsonSerializerSettings>(() => new JsonSerializerSettings()
                {
                    Converters = new List<JsonConverter> { new StringEnumConverter() },
                    ContractResolver = new SisoJsonDefaultContractResolver()
                });

                return jsonSettings;
            }
        }
    }

    public class SisoJsonDefaultContractResolver : DefaultContractResolver
    {
        protected override JsonProperty CreateProperty(
            MemberInfo member,
            MemberSerialization memberSerialization)
        {
            var prop = base.CreateProperty(member, memberSerialization);

            if (!prop.Writable)
            {
                var property = member as PropertyInfo;
                if (property != null)
                {
                    var hasPrivateSetter = property.GetSetMethod(true) != null;
                    prop.Writable = hasPrivateSetter;
                }
            }

            return prop;
        }
    }
}