import * as core from "@actions/core";

async function run(): Promise<void> {
  try {
    // Get which version number should be changed
    
    // Get the initiator user    
    
    // Find library file

    // Update the version number (set patch to 0 if minor is bumped, etc)

    // Set which user should commit

    // Commit
    
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();

