const ftp = require("basic-ftp");
const fs = require("fs");
var config = {
  host: "xxxxxx", // give your FTP host name
  user: "xxxxxxx", // give your FTP username
  password: "xxxxxx", // give your FTP password
  port: 21, // change this to 22 or anything else only if you are using SFTP or something else
  localRoot: __dirname + "/build",
  remoteRoot: "/",
  include: ["*", ".htaccess"],
  exclude: ["images/**"],
  deleteRemote: false,
};

// Define your FTP server settings
const ftpConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  secure: false, // Set to true if your FTP server requires secure connection (e.g., FTPS)
};

// Local path to your React app's build directory
const localBuildPath = "./build";

// Remote path on the FTP server where you want to deploy the app
const remoteDeployPath = "/";

async function deploy() {
  const client = new ftp.Client();

  try {
    // Connect to the FTP server
    await client.access(ftpConfig);

    // Get the total size of files in the local build directory
    const totalSize = await getTotalSize(localBuildPath);

    // Initialize the transferred bytes counter
    let transferredBytes = 0;

    // Upload all files from the local build directory to the remote directory
    await client.uploadFromDir(localBuildPath, remoteDeployPath, {
      baseDir: localBuildPath,
      overwrite: true,
      step: (info) => {
        // Calculate the percentage progress
        transferredBytes += info.bytes;
        const percentage = ((transferredBytes / totalSize) * 100).toFixed(2);

        // Log both percentage and file-specific progress

      },
    });

    // console.log("Deployment successful!");
  } catch (err) {
    console.error("Error deploying the app:", err);
  } finally {
    // Close the FTP connection
    client.close();
  }
}

// Function to calculate the total size of files in a directory
async function getTotalSize(dir) {
  const fileStats = await fs.promises.stat(dir);
  if (fileStats.isFile()) {
    return fileStats.size;
  } else if (fileStats.isDirectory()) {
    const files = await fs.promises.readdir(dir);
    let totalSize = 0;
    for (const file of files) {
      totalSize += await getTotalSize(`${dir}/${file}`);
    }
    return totalSize;
  }
  return 0;
}

deploy().then(() => "");
