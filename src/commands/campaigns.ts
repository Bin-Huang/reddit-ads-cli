import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCampaignCommands(program: Command): void {
  program
    .command("campaigns <account-id>")
    .description("List campaigns for an ad account")
    .option("--status <status>", "Filter by status (ACTIVE, PAUSED, etc.)")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {};
        if (opts.status) params.status = opts.status;
        const data = await callApi(
          `/ad_accounts/${accountId}/campaigns`,
          { creds, params }
        );
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
