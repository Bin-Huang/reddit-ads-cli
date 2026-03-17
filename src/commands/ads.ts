import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAdCommands(program: Command): void {
  program
    .command("ads <account-id>")
    .description("List ads for an ad account")
    .option("--ad-group-id <id>", "Filter by ad group ID")
    .option("--campaign-id <id>", "Filter by campaign ID")
    .option("--status <status>", "Filter by status (ACTIVE, PAUSED, etc.)")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {};
        if (opts.adGroupId) params.ad_group_id = opts.adGroupId;
        if (opts.campaignId) params.campaign_id = opts.campaignId;
        if (opts.status) params.status = opts.status;
        const data = await callApi(
          `/ad_accounts/${accountId}/ads`,
          { creds, params }
        );
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
