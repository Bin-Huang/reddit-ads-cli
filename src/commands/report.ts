import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerReportCommands(program: Command): void {
  program
    .command("report <account-id>")
    .description("Generate a performance report")
    .requiredOption("--start-date <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end-date <date>", "End date (YYYY-MM-DD)")
    .option("--level <level>", "Report level: ACCOUNT, CAMPAIGN, AD_GROUP, AD (default CAMPAIGN)", "CAMPAIGN")
    .option("--metrics <metrics>", "Metrics (comma-separated, e.g. impressions,clicks,spend,ecpm,ctr)", "impressions,clicks,spend")
    .option("--campaign-id <id>", "Filter by campaign ID")
    .option("--ad-group-id <id>", "Filter by ad group ID")
    .option("--timezone <tz>", "Timezone (e.g. America/New_York)")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const body: Record<string, unknown> = {
          start_date: opts.startDate,
          end_date: opts.endDate,
          level: opts.level,
          metrics: opts.metrics.split(",").map((s: string) => s.trim()),
        };
        if (opts.campaignId) body.campaign_id = opts.campaignId;
        if (opts.adGroupId) body.ad_group_id = opts.adGroupId;
        if (opts.timezone) body.timezone = opts.timezone;
        const data = await callApi(
          `/accounts/${accountId}/reports`,
          { creds, method: "POST", body }
        );
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
