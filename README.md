# Install Oso Cloud Tools

Installs the
[Oso Cloud CLI](https://www.osohq.com/docs/reference/client-apis/cli)
on a GitHub actions runner.

The CLI is required for the following Oso Cloud GitHub actions:

- validate-polar-syntax (a wrapper for `oso-cloud validate`)
- run-polar-tests (a wrapper for `oso-cloud test`)
- deploy-polar-code (a wrapper for `oso-cloud policy`)

See the documentation for each action for additional information about that action.

Inputs: none
Outputs:

- cli-version: The version number of the CLI that was installed
- cli-sha: The SHA of the CLI that was installed

Currently, the action always installs the latest version of the CLI.
A future revision will bundle a specific version with each release,
so that previous versions of the CLI can be deployed if desired.
