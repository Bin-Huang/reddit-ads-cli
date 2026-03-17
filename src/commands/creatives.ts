import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCreativeCommands(program: Command): void {
  program
    .command("creatives <account-id>")
    .description("List ad creatives for an ad account")
    .option("--limit <n>", "Results per page (default 25)", "25")
    .option("--offset <n>", "Start index (default 0)", "0")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          limit: opts.limit,
          offset: opts.offset,
        };
        const data = await callApi(`/accounts/${accountId}/creatives`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("creative <account-id> <creative-id>")
    .description("Get a specific ad creative")
    .action(async (accountId: string, creativeId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi(`/accounts/${accountId}/creatives/${creativeId}`, { creds });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
