const CLOUDFLARE_GRAPHQL_URL = 'https://api.cloudflare.com/client/v4/graphql';
const DEFAULT_LOOKBACK_DAYS = 180;

interface AssetsBinding {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetsBinding;
  CF_API_TOKEN?: string;
  CF_ZONE_ID?: string;
  VISITOR_LOOKBACK_DAYS?: string;
}

interface GraphQLResponse {
  data?: {
    viewer?: {
      zones?: Array<{
        series?: Array<{ sum?: { visits?: number | string } }>;
      }>;
    };
  };
  errors?: Array<{ message?: string }>;
}

const VISITOR_QUERY = `
  query TotalVisitors($zoneTag: string, $start: Time, $end: Time) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        series: httpRequestsAdaptiveGroups(
          limit: 1000
          filter: {
            datetime_geq: $start
            datetime_lt: $end
            requestSource: "eyeball"
          }
        ) {
          sum {
            visits
          }
        }
      }
    }
  }
`;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

async function getVisitorTotal(env: Env) {
  if (!env.CF_API_TOKEN || !env.CF_ZONE_ID) {
    return json({ error: 'Cloudflare analytics secrets are not configured.' }, 503);
  }

  const end = new Date();
  const lookbackDays = Number(env.VISITOR_LOOKBACK_DAYS) || DEFAULT_LOOKBACK_DAYS;
  const start = new Date(end.getTime() - lookbackDays * 24 * 60 * 60 * 1000);
  const response = await fetch(CLOUDFLARE_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${env.CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: VISITOR_QUERY,
      variables: {
        zoneTag: env.CF_ZONE_ID,
        start: start.toISOString(),
        end: end.toISOString(),
      },
    }),
  });

  const payload = await response.json() as GraphQLResponse;
  if (!response.ok || payload.errors?.length) {
    const message = payload.errors?.map((error) => error.message).filter(Boolean).join('; ') || 'Cloudflare analytics request failed.';
    return json({ error: message }, response.status >= 400 ? response.status : 502);
  }

  const series = payload.data?.viewer?.zones?.[0]?.series ?? [];
  const visitors = series.reduce((total, group) => {
    const value = typeof group.sum?.visits === 'number' ? group.sum.visits : Number(group.sum?.visits);
    return total + (Number.isFinite(value) ? value : 0);
  }, 0);

  return json({ visitors, source: 'cloudflare', start: start.toISOString(), end: end.toISOString() });
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/visitors') {
      if (request.method !== 'GET') return json({ error: 'Method not allowed.' }, 405);
      try {
        return await getVisitorTotal(env);
      } catch {
        return json({ error: 'Cloudflare analytics request failed.' }, 502);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
