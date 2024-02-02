import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { ExecOptions } from '@actions/exec'

/**
 * Installs the specified version ot the oso cloud CLI on the runner.
 * Defaults to the latest version
 * @param version The version of the CLI to install.
 * @returns {Promise<string>} The version of the CLI that was installed.
 */
export async function installCli(): Promise<string> {
  let output = ''
  let error = ''

  const options: ExecOptions = {}

  options.listeners = {
    stdout: (data: Buffer) => {
      output += data.toString()
    },
    stderr: (data: Buffer) => {
      error += data.toString()
    }
  }

  // install the CLI using the install script hosted at cloud.osohq.com
  await exec.exec(
    '/bin/bash',
    ['-c', 'curl -L https://cloud.osohq.com/install.sh | /bin/bash'],
    options
  )

  core.debug(`stdout from installation: \n${output}`)
  core.debug(`stderr from installation: \n${error}`)

  // clear the output and error for the next command
  output = ''
  error = ''

  // get the version that was installed so it can be set in the action output
  await exec.exec('oso-cloud', ['version'], options)

  core.debug(`stdout from version check: \n${output}`)
  core.debug(`stderr from version check: \n${error}`)

  return output.split(' ')[3]
}
