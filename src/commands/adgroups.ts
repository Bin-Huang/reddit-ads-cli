import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAdgroupCommands(program: Command): void {
  program
    .command("adgroups <account-id>")
    .description("List ad groups for an ad account")
    .option("--campaign-id <id>", "Filter by campaign ID")
    .option("--status <status>", "Filter by status (ACTIVE, PAUSED, etc.)")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {};
        if (opts.campaignId) params.campaign_id = opts.campaignId;
        if (opts.status) params.status = opts.status;
        const data = await callApi(
          `/accounts/${accountId}/ad_groups`,
          { creds, params }
        );
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
