import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { ExecOptions } from '@actions/exec'

/**
 * Installs the specified version ot the oso cloud CLI on the runner.
 * Defaults to the latest version
 * @returns {Promise<string>} The output of 'oso-cloud version', which includes the version and SHA of the installed CLI.
 */
export async function installLocalBinary(): Promise<string> {
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

  // install the local binary
  await exec.exec(
    '/bin/bash',
    [
      '-c',
      'curl -L https://oso-local-development-binary.s3.amazonaws.com/latest/oso-local-development-binary-linux-x86_64.tar.gz'
    ],
    options
  )

  core.debug(`stdout from installation: \n${output}`)
  core.debug(`stderr from installation: \n${error}`)

  await exec.exec(
    'tar',
    ['-xvzf', 'oso-local-development-binary-linux-x86_64.tar.gz'],
    options
  )
  // clear the output and error for the next command
  output = ''
  error = ''

  await exec.exec('chmod', ['-0700', 'standalone'], options)
  // clear the output and error for the next command
  output = ''
  error = ''

  // get the version that was installed so it can be set in the action output
  await exec.exec('./standalone', ['--version'], options)

  core.debug(`stdout from version check: \n${output}`)
  core.debug(`stderr from version check: \n${error}`)

  // return the output of `oso-cloud version`
  return output
}
