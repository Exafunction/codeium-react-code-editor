import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();
if (process.env.CODEIUM_ENV === "monorepo") {
  execSync(
    "pnpm buf generate ../../.. --path ../../language_server_pb/language_server.proto --include-imports"
  );
} else {
  execSync("pnpm buf generate");
}
