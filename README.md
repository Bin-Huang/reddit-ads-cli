# reddit-ads-cli

Give AI agents direct access to Reddit Ads data. One command to query accounts, campaigns, ad groups, and pull performance reports -- no SDK, no docs to read, no tokens wasted on boilerplate.

**Works with:** OpenClaw, Claude Code, Cursor, Codex, and any agent that can run shell commands.

## Installation

```bash
npm install -g reddit-ads-cli
```

Or run directly with npx:

```bash
npx reddit-ads-cli --help
```

## How it works

Built on the official [Reddit Ads API v3](https://ads-api.reddit.com/docs/v3). Handles OAuth2 token exchange automatically. Every command outputs structured JSON to stdout, ready for agents to parse without extra processing.

The Reddit Ads API is open to all developers and does not require allowlisting or approval from Reddit.

Core endpoints covered:

- **[Ad Accounts](https://ads-api.reddit.com/docs/v3)** -- list and inspect ad accounts
- **[Campaigns](https://ads-api.reddit.com/docs/v3)** -- list campaigns under an account
- **[Ad Groups](https://ads-api.reddit.com/docs/v3)** -- list ad groups under an account
- **[Ads](https://ads-api.reddit.com/docs/v3)** -- list ads (promotions) under an account
- **[Reports](https://ads-api.reddit.com/docs/v3)** -- generate performance reports

## Setup

### Step 1: Create a Reddit developer application

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps) and sign in.
2. Click "create another app..." at the bottom.
3. Choose "script" or "web app" type depending on your use case.
4. Note your **Client ID** (under the app name) and **Client Secret**.

### Step 2: Get an OAuth2 access token

Exchange your client credentials for an access token:

```bash
curl -X POST https://www.reddit.com/api/v1/access_token \
  -u 'CLIENT_ID:CLIENT_SECRET' \
  -d 'grant_type=client_credentials&scope=adsread'
```

For user-level access (managing specific advertiser accounts), use the authorization code flow. See [Reddit OAuth2 docs](https://github.com/reddit-archive/reddit/wiki/OAuth2).

### Step 3: Place the credentials file

Choose one of these options:

```bash
# Option A: Default path (recommended)
mkdir -p ~/.config/reddit-ads-cli
cat > ~/.config/reddit-ads-cli/credentials.json << EOF
{
  "access_token": "YOUR_ACCESS_TOKEN",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "username": "your_reddit_username"
}
EOF

# Option B: Environment variable
export REDDIT_ADS_ACCESS_TOKEN=your_access_token

# Option C: Pass per command
reddit-ads-cli --credentials /path/to/credentials.json accounts
```

The `username` field is used to build the required User-Agent string (`cli:reddit-ads-cli:v0.1.0 (by /u/your_username)`). Reddit rate-limits requests without a proper User-Agent.

Credentials are resolved in this order:
1. `--credentials <path>` flag
2. `REDDIT_ADS_ACCESS_TOKEN` env var
3. `~/.config/reddit-ads-cli/credentials.json` (auto-detected)

### Step 4: Find your Ad Account ID

```bash
reddit-ads-cli accounts
```

## Usage

All commands output pretty-printed JSON by default. Use `--format compact` for compact single-line JSON.

### accounts

List all ad accounts accessible by the authenticated user.

```bash
reddit-ads-cli accounts
```

### account

Get details of a specific ad account.

```bash
reddit-ads-cli account t2_abc123
```

### campaigns

List campaigns for an ad account.

```bash
reddit-ads-cli campaigns t2_abc123
reddit-ads-cli campaigns t2_abc123 --status ACTIVE
```

Options:
- `--status <status>` -- filter by status (ACTIVE, PAUSED, etc.)

### adgroups

List ad groups for an ad account.

```bash
reddit-ads-cli adgroups t2_abc123
reddit-ads-cli adgroups t2_abc123 --campaign-id campaign_abc
```

Options:
- `--campaign-id <id>` -- filter by campaign ID
- `--status <status>` -- filter by status

### ads

List ads for an ad account.

```bash
reddit-ads-cli ads t2_abc123
reddit-ads-cli ads t2_abc123 --ad-group-id adgroup_abc
```

Options:
- `--ad-group-id <id>` -- filter by ad group ID
- `--campaign-id <id>` -- filter by campaign ID
- `--status <status>` -- filter by status

### report

Generate a performance report. Uses a POST request to the reporting endpoint.

```bash
# Campaign-level report
reddit-ads-cli report t2_abc123 \
  --start-date 2026-03-01 \
  --end-date 2026-03-15 \
  --level CAMPAIGN \
  --metrics impressions,clicks,spend,ecpm,ctr

# Ad group level with timezone
reddit-ads-cli report t2_abc123 \
  --start-date 2026-03-01 \
  --end-date 2026-03-15 \
  --level AD_GROUP \
  --metrics impressions,clicks,spend \
  --campaign-id campaign_abc \
  --timezone America/New_York
```

Options:
- `--start-date <date>` -- start date, YYYY-MM-DD (required)
- `--end-date <date>` -- end date, YYYY-MM-DD (required)
- `--level <level>` -- report level: ACCOUNT, CAMPAIGN, AD_GROUP, AD (default CAMPAIGN)
- `--metrics <metrics>` -- comma-separated metrics (default: impressions,clicks,spend)
- `--campaign-id <id>` -- filter by campaign ID
- `--ad-group-id <id>` -- filter by ad group ID
- `--timezone <tz>` -- timezone (e.g. America/New_York)

## Error output

Errors are written to stderr as JSON with an `error` field and a non-zero exit code:

```json
{"error": "No bearer token or a bad bearer token was provided"}
```

## API Reference

- Official docs: https://ads-api.reddit.com/docs/v3
- Authentication: https://github.com/reddit-archive/reddit/wiki/OAuth2

## Related

- [google-analytics-cli](https://github.com/Bin-Huang/google-analytics-cli) -- Google Analytics CLI for AI agents
- [google-search-console-cli](https://github.com/Bin-Huang/google-search-console-cli) -- Google Search Console CLI for AI agents
- [tiktok-ads-cli](https://github.com/Bin-Huang/tiktok-ads-cli) -- TikTok Ads CLI for AI agents
- [x-ads-cli](https://github.com/Bin-Huang/x-ads-cli) -- X Ads CLI for AI agents

## License

Apache-2.0
