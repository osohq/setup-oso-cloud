/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import * as installCli from '../src/install-cli'

// Mock the install functions so we don't actually download and install things during tests
const installCliMock: jest.SpyInstance = jest
  .spyOn(installCli, 'installCli')
  .mockImplementation()
// Mock the action's main function
const runMock: jest.SpyInstance = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let debugMock: jest.SpyInstance
let errorMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance
let setOutputMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('sets the versions to install', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'install-cli':
          return 'yes'
        case 'install-local-binary':
          return 'yes'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()
    expect(installCliMock).toHaveBeenCalled()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Installing Oso Cloud CLI')
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      'Installing Oso Cloud local binary'
    )
    expect(errorMock).not.toHaveBeenCalled()
    expect(setOutputMock).toHaveBeenCalledTimes(1)
  })

  it('sets a failed status on an invalid install-cli input', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'install-cli':
          return 'maybe'
        case 'install-local-binary':
          return 'yes'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'Invalid value for install-cli: maybe. Please specify either "yes" or "no".'
    )
    expect(errorMock).not.toHaveBeenCalled()
    expect(setOutputMock).not.toHaveBeenCalledTimes(1)
  })

  it('sets a failed status on an invalid install-local-binary input', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'install-cli':
          return 'yes'
        case 'install-local-binary':
          return 'maybe'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'Invalid value for install-local-binary: maybe. Please specify either "yes" or "no".'
    )
    expect(errorMock).not.toHaveBeenCalled()
    expect(setOutputMock).not.toHaveBeenCalledTimes(1)
  })
})
