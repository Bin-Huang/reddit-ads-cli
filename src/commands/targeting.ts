import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerTargetingCommands(program: Command): void {
  program
    .command("custom-audiences <account-id>")
    .description("List custom audiences for an ad account")
    .option("--limit <n>", "Results per page (default 25)", "25")
    .option("--offset <n>", "Start index (default 0)", "0")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          limit: opts.limit,
          offset: opts.offset,
        };
        const data = await callApi(`/ad_accounts/${accountId}/custom_audiences`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("pixels <account-id>")
    .description("List conversion pixels for an ad account")
    .action(async (accountId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi(`/ad_accounts/${accountId}/pixels`, { creds });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("pixel-events <account-id> <pixel-id>")
    .description("List events for a conversion pixel")
    .action(async (accountId: string, pixelId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi(`/ad_accounts/${accountId}/pixels/${pixelId}/events`, { creds });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("subreddits")
    .description("Search for subreddits available for targeting")
    .requiredOption("--query <q>", "Search query")
    .option("--limit <n>", "Results per page (default 25)", "25")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          query: opts.query,
          limit: opts.limit,
        };
        const data = await callApi("/targeting/subreddits", { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("interests")
    .description("List available interest targeting categories")
    .action(async () => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi("/targeting/interests", { creds });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("geos")
    .description("List available geographic targeting options")
    .option("--query <q>", "Search query")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {};
        if (opts.query) params.query = opts.query;
        const data = await callApi("/targeting/geos", { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
