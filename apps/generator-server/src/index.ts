import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createNodeWebSocket } from "@hono/node-ws";
import util from "node:util";
import { spawn, exec } from "node:child_process";
import postgres from "postgres";

const execAsync = util.promisify(exec);

const sql = postgres(process.env.PG_URL);

type Result<T> = { data: T; success: true } | { success: false; error: string };

type ProjectSchema = {
  business_name: string;
  business_logo: string;
  id: string;
  domain: string;
  user_id: string;
  need_publish: boolean;
  build_pid: string;
  build_last_step: number;
  build_total_step: number;
  env: {
    NEXT_PUBLIC_UMAMI_ID?: string | undefined;
  };
};

type Body = {
  userId: string;
};

type MessageData = {
  userId: string;
  projectId: string;
};

async function getProject(projectId: string, userId: string) {
  const [project] = await sql<[ProjectSchema?]>`
      SELECT
            id,
            domain,
            user_id,
            business_name,
            business_logo,
            env,
            build_pid,
            build_last_step,
            build_total_step
      FROM project
      WHERE 
          id = ${projectId}
          AND user_id = ${userId}
      `;

  return project;
}

async function setProjectBuildPID(projectId: string, pid: number | null) {
  await sql`UPDATE project SET build_pid = ${pid !== null ? String(pid) : ""} WHERE id = ${projectId}`;
}

async function setProjectBuildStep(
  projectId: string,
  lastStep: number,
  totalStep: number,
) {
  await sql`UPDATE project SET build_last_step = ${lastStep}, build_total_step = ${totalStep} WHERE id = ${projectId}`;
}

async function killPID(pid: number | null) {
  if (pid === null) {
    return;
  }

  await execAsync(`kill -9 ${pid}`);
}

async function buildAndRun(
  projectId: string,
  subDomain: string,
  domain: string,
  projectEnv: ProjectSchema["env"],
): Promise<number> {
  const totalBuildStep = 22;
  const totalInspectStep = 1;
  const totalRemoveStep = 1;
  const totalRunStep = 1;

  const totalSteps =
    totalBuildStep + totalInspectStep + totalRemoveStep + totalRunStep;
  let lastStep = 0;

  const buildExitCode = await new Promise<number | null>((resolve) => {
    const dockerBuild = spawn(
      "docker",
      [
        "build",
        "--no-cache",
        "-t",
        `${subDomain}:latest`,
        "--build-arg",
        `APP_NAME=${process.env.PROJECT_APP_NAME}`,
        "--build-arg",
        `PG_URL=${process.env.PG_URL}`,
        "--build-arg",
        `NEXT_PUBLIC_DASHBOARD_URL=${process.env.PROJECT_NEXT_PUBLIC_DASHBOARD_URL}`,
        "--build-arg",
        `NEXT_PUBLIC_UMAMI_ID=${projectEnv.NEXT_PUBLIC_UMAMI_ID}`,
        "--build-arg",
        `PROJECT_ID=${projectId}`,
        "-f",
        "Dockerfile.export",
        ".",
      ],
      {
        cwd: process.env.PROJECT_PATH,
      },
    );

    const buildPID = dockerBuild.pid || null;
    const catchFn = () => {
      killPID(buildPID).finally(() => {
        resolve(1);
      });
    };

    setProjectBuildPID(projectId, buildPID).catch(catchFn);

    dockerBuild.stdout.on("data", (data) => {
      console.log(`dockerBuild:stdout: ${data}`);
    });

    dockerBuild.stderr.on("data", (data) => {
      const stepLine = `${data}`;

      if (stepLine.startsWith("#")) {
        const buildStep = Number(stepLine.split(" ")[0]?.replace("#", ""));
        if (buildStep > lastStep) {
          lastStep = buildStep;
          setProjectBuildStep(projectId, lastStep, totalSteps).catch(catchFn);
        }
      }

      console.error(`dockerBuild:stderr: ${stepLine}`);
    });

    dockerBuild.on("close", (code) => {
      console.log(`dockerBuild:child process exited with code ${code}`);
      resolve(code);
    });
  });

  if (buildExitCode !== 0) {
    return 1;
  }

  const projectLabel = "hooore.project";
  const { stdout, stderr } = await execAsync(
    `docker inspect --format='{{index .Config.Labels "${projectLabel}"}}' ${subDomain} 2>/dev/null || echo "false"`,
  );

  try {
    await setProjectBuildStep(projectId, ++lastStep, totalSteps);
  } catch {
    return 1;
  }

  if (stderr) {
    return 1;
  }

  const isDeploymentExist = stdout.trim() === "true";
  console.log(`dockerInspect:stdout: ${stdout}`);
  console.error(`dockerInspect:stderr: ${stderr}`);

  if (isDeploymentExist) {
    const { stdout, stderr } = await execAsync(
      `docker stop ${subDomain} && docker rm ${subDomain}`,
    );
    console.log(`dockerStopRm:stdout: ${stdout}`);
    console.error(`dockerStopRm:stderr: ${stderr}`);
  }

  try {
    await setProjectBuildStep(projectId, ++lastStep, totalSteps);
  } catch {
    return 1;
  }

  const runExitCode = await new Promise<number | null>((resolve) => {
    const dockerRun = spawn("docker", [
      "run",
      "-d",
      "--restart=unless-stopped",
      `--network=${process.env.PROJECT_DOCKER_NETWORK}`,
      "-l",
      "traefik.enable=true",
      "-l",
      `traefik.docker.network=${process.env.PROJECT_DOCKER_NETWORK}`,
      "-l",
      `traefik.http.routers.${subDomain}.rule=Host(\`${domain}\`)`,
      "-l",
      `traefik.http.routers.${subDomain}.entrypoints=${process.env.PROJECT_HTTP_ENTRYPOINTS}`,
      "-l",
      `traefik.http.routers.${subDomain}.tls.certresolver=${process.env.PROJECT_TLS_CERTRESOLVER}`,
      "-l",
      `traefik.http.services.${subDomain}.loadbalancer.server.port=${process.env.PROJECT_PORT}`,
      "-l",
      `${projectLabel}=true`,
      "--name",
      subDomain,
      `${subDomain}:latest`,
    ]);

    dockerRun.stdout.on("data", (data) => {
      console.log(`dockerRun:stdout: ${data}`);
    });

    dockerRun.stderr.on("data", (data) => {
      console.error(`dockerRun:stderr: ${data}`);
    });

    dockerRun.on("close", (code) => {
      console.log(`dockerRun:child process exited with code ${code}`);
      resolve(code);
    });
  });

  try {
    await setProjectBuildStep(projectId, ++lastStep, totalSteps);
  } catch {
    return 1;
  }

  if (runExitCode !== 0) {
    return 1;
  }

  return 0;
}

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.use(cors());

app.post("/api/publish/:projectId", async (c) => {
  if (
    c.req.header("Authorization")?.replace("Bearer ", "") !==
    process.env.GENERATOR_SERVER_TOKEN
  ) {
    return new Response(JSON.stringify({ message: "Unauthenticated." }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const projectId = c.req.param("projectId");
  const requestBody = await c.req.json<Body>();
  const project = await getProject(projectId, requestBody.userId);

  if (!project) {
    return new Response(JSON.stringify({ message: "Not found." }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const SUB_DOMAIN = project.domain.replace(
    `.${process.env.MAIN_HOST_DOMAIN}`,
    "",
  );

  if (project.build_pid !== "") {
    await killPID(Number(project.build_pid));
  }

  buildAndRun(project.id, SUB_DOMAIN, project.domain, project.env).then(
    (res) => {
      if (res === 0) {
        setProjectBuildPID(project.id, null);
      }
    },
  );

  return new Response(JSON.stringify({ message: "Success." }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});

app.get(
  "/ws",
  upgradeWebSocket(async () => {
    let intervalId: NodeJS.Timeout;
    let projectId: string;
    let userId: string;
    return {
      onOpen: (_, ws) => {
        intervalId = setInterval(() => {
          if (!projectId || !userId) {
            return;
          }
          getProject(projectId, userId)
            .then((project) => {
              if (!project) {
                return;
              }

              const data: Result<
                Pick<ProjectSchema, "build_last_step" | "build_total_step">
              > = {
                success: true,
                data: {
                  build_last_step: project.build_last_step,
                  build_total_step: project.build_total_step,
                },
              };

              ws.send(JSON.stringify(data));
            })
            .catch((reason) => {
              const data: Result<string> = {
                success: false,
                error: `${reason}`,
              };

              ws.send(JSON.stringify(data));
            });
        }, 1000);
      },
      onMessage: (event) => {
        const messageData = JSON.parse(event.data.toString()) as MessageData;
        projectId = messageData.projectId;
        userId = messageData.userId;
      },
      onClose: () => {
        clearInterval(intervalId);
      },
    };
  }),
);

const port = Number(process.env.PORT);
console.log(`Server is running on port ${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

injectWebSocket(server);
