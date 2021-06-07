﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Graph;
using Microsoft.Identity.Client;

namespace TabActivityFeed
{
    public class SimpleGraphClient
    {
        public static GraphServiceClient GetGraphClient(string accessToken)
        {
            var graphClient = new GraphServiceClient(new DelegateAuthenticationProvider((requestMessage) =>
            {
                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);

                requestMessage.Headers.Add("Prefer", "outlook.timezone=\"" + TimeZoneInfo.Local.Id + "\"");

                return Task.CompletedTask;
            }));

            return graphClient;
        }
    }
}
