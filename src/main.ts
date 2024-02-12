import * as core from '@actions/core'
import { installCli } from './install-cli'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const validInstallInputValues: Set<string> = new Set(['yes', 'no'])
    const shouldInstallCli: string = core.getInput('install-cli')

    // Validate inputs
    if (!validInstallInputValues.has(shouldInstallCli)) {
      throw new Error(
        `Invalid value for install-cli: ${shouldInstallCli}. Please specify either "yes" or "no".`
      )
    }

    if (shouldInstallCli === 'yes') {
      // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
      core.debug('Installing Oso Cloud CLI')
      const cliInfo = await installCli()
      //TODO: Get installed version back
      core.setOutput('cli-version', cliInfo.split(' ')[1])
      core.setOutput('cli-sha', cliInfo.split(' ')[3])
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
