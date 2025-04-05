import dotenv from "dotenv";
import { execSync, spawnSync } from "child_process";

dotenv.config();

async function startPostgresInstance() {
  const POSTGRES_CONTAINER_NAME = process.env.POSTGRES_CONTAINER_NAME;

  // Step 1: Check if Docker is responsive
  try {
    execSync("docker info", { stdio: "ignore" });
    console.log("Docker is running.");
  } catch {
    console.log("Docker is not available. Trying to start Colima...");
    try {
      execSync("colima start", { stdio: "inherit" });
      console.log("Colima started.");
    } catch (err) {
      console.error("Failed to start Colima. Exiting.");
      process.exit(1);
    }
  }

  // Step 2: Start container if not running
  const containerCheck = spawnSync("docker", [
    "ps",
    "--filter",
    `name=${POSTGRES_CONTAINER_NAME}`,
    "--format",
    "{{.Names}}",
  ]);

  if (!containerCheck.stdout.toString()) {
    console.log(`Container "${POSTGRES_CONTAINER_NAME}" is not running. Starting it...`);
    execSync(`docker start ${POSTGRES_CONTAINER_NAME}`, { stdio: "inherit" });
    console.log(`Container "${POSTGRES_CONTAINER_NAME}" started successfully.`);
  } else {
    console.log(`Container "${POSTGRES_CONTAINER_NAME}" is already running.`);
  }
}

export default startPostgresInstance;
