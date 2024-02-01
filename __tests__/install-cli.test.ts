/**
 * Unit tests for the install-cli function, src/install-cli.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as installCli from '../src/install-cli'
import * as exec from '@actions/exec'
import { expect } from '@jest/globals'

// Mock the exec functions so we don't actually download and install things during tests
const execMock: jest.SpyInstance = jest.spyOn(exec, 'exec').mockImplementation()
// Mock the install functions so we don't actually download and install things during tests
const installCliMock: jest.SpyInstance = jest.spyOn(installCli, 'installCli')

describe('install-cli.ts', () => {
  it('calls exec to install the CLI', async () => {
    await installCli.installCli()

    expect(installCliMock).toHaveReturned()
    expect(execMock).toHaveBeenCalledTimes(2)
  })
})
