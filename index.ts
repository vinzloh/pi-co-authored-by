import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { isToolCallEventType, VERSION } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("tool_call", async (event, ctx) => {
    if (!isToolCallEventType("bash", event)) return;

    const cmd = event.input.command;
    if (!isGitCommit(cmd)) return;

    const modelName = ctx.model ? (`${ctx.model.provider}/${ctx.model.id}`) : "unknown";
    event.input.command = appendFooter(cmd, modelName, VERSION);
  });
}

function isGitCommit(cmd: string): boolean {
  const normalized = cmd.replace(/\\\n/g, " ");
  return /\bgit\s+commit\b/.test(normalized) && /\s-[^\s]*m\b/.test(normalized);
}

function appendFooter(cmd: string, modelName: string, piVersion: string): string {
  return `${cmd.trimEnd()} -m "" -m $'${`Co-Authored-By: pi@${piVersion} + ${modelName} `}'`;
}
