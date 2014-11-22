namespace Tests
{
    using System;
    using System.Collections.Generic;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public static class JsonSettings
    {
        public static Func<JsonSerializerSettings> EnumSerialization
        {
            get
            {
                var jsonSettings = new Func<JsonSerializerSettings>(() => new JsonSerializerSettings()
                {
                    Converters = new List<JsonConverter> {new StringEnumConverter()}
                });
                
                return jsonSettings;
            }
        }
    }
}