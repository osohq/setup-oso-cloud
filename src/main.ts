import * as core from '@actions/core'
import { installCli } from './install-cli'
import { installLocalBinary } from './install-local-binary'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const validInstallInputValues: Set<string> = new Set(['yes', 'no'])
    const shouldInstallCli: string = core.getInput('install-cli')
    const shouldInstallLocalBinary: string = core.getInput(
      'install-local-binary'
    )

    // Validate inputs
    if (!validInstallInputValues.has(shouldInstallCli)) {
      throw new Error(
        `Invalid value for install-cli: ${shouldInstallCli}. Please specify either "yes" or "no".`
      )
    }
    if (!validInstallInputValues.has(shouldInstallLocalBinary)) {
      throw new Error(
        `Invalid value for install-local-binary: ${shouldInstallLocalBinary}. Please specify either "yes" or "no".`
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
    if (shouldInstallLocalBinary === 'yes') {
      core.debug('Installing Oso Cloud local binary')
      const localBinaryInfo = await installLocalBinary()
      core.setOutput('local-binary-version', localBinaryInfo.split(':')[1])
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
