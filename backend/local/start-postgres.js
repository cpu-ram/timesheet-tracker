import dotenv from "dotenv";
import { execSync, spawnSync } from "child_process";

dotenv.config();

async function startPostgresInstance() {
  const COLIMA_STATUS_CMD = "colima status";
  const START_COLIMA_CMD = "colima start";
  const POSTGRES_CONTAINER_NAME = process.env.POSTGRES_CONTAINER_NAME;

  try {
    console.log("Checking if Colima is running...");
    execSync(COLIMA_STATUS_CMD, { stdio: "ignore" });
    console.log("Colima is already running.");
  } catch {
    console.log("Colima is not running. Starting it...");
    execSync(START_COLIMA_CMD, { stdio: "inherit" });
    console.log("Colima started successfully.");
  }

  console.log(`Checking if container "${POSTGRES_CONTAINER_NAME}" is running...`);
  const containerCheck = spawnSync("docker", ["ps", "--filter", `name=${POSTGRES_CONTAINER_NAME}`, "--format", "{{.Names}}"]);

  if (!containerCheck.stdout.toString()) {
    console.log(`Container "${POSTGRES_CONTAINER_NAME}" is not running. Starting it...`);
    execSync(`docker start ${POSTGRES_CONTAINER_NAME}`, { stdio: "inherit" });
    console.log(`Container "${POSTGRES_CONTAINER_NAME}" started successfully.`);
  } else {
    console.log(`Container "${POSTGRES_CONTAINER_NAME}" is already running.`);
  }
}

export default startPostgresInstance;
