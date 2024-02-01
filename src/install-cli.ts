import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { ExecOptions } from '@actions/exec'

/**
 * Installs the specified version ot the oso cloud CLI on the runner.
 * Defaults to the latest version
 * @param version The version of the CLI to install.
 * @returns {Promise<string>} The version of the CLI that was installed.
 */
export async function installCli(version = 'latest'): Promise<string> {
  let installOutput = ''
  let installError = ''
  let versionOutput = ''
  let versionError = ''

  const installOptions: ExecOptions = {}
  const versionOptions: ExecOptions = {}

  versionOptions.listeners = {
    stdout: (data: Buffer) => {
      versionOutput += data.toString()
    },
    stderr: (data: Buffer) => {
      versionError += data.toString()
    }
  }

  installOptions.listeners = {
    stdout: (data: Buffer) => {
      installOutput += data.toString()
    },
    stderr: (data: Buffer) => {
      installError += data.toString()
    }
  }

  await exec.exec(
    '/bin/bash',
    ['-c', 'curl -L https://cloud.osohq.com/install.sh | /bin/bash'],
    installOptions
  )
  await exec.exec('oso-cloud', ['version'], versionOptions)

  return new Promise(resolve => {
    core.debug(`requested version: ${version}`)
    core.debug(`install stdout: \n${installOutput}`)
    core.debug(`install stderr: \n${installError}`)
    core.debug(`version stdout: \n${versionOutput}`)
    core.debug(`version stderr: \n${versionError}`)

    core.setOutput('version', versionOutput)

    resolve(versionOutput)
  })
}
