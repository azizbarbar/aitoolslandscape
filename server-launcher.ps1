param([ValidateSet('start', 'stop')][string]$Action = 'start')
$ErrorActionPreference = 'Stop'
try {
    $nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
    $nodePath = if ($nodeCommand) { $nodeCommand.Source } else { $null }
    if (-not $nodePath) {
        $candidate = Join-Path $env:ProgramFiles 'nodejs\node.exe'
        if (Test-Path -LiteralPath $candidate) { $nodePath = $candidate }
    }
    if (-not $nodePath -and $Action -eq 'start') {
        if (-not (Get-Command winget.exe -ErrorAction SilentlyContinue)) {
            throw 'Node.js is required. Install Node.js LTS from https://nodejs.org and run start-server.bat again.'
        }
        Write-Host 'Installing Node.js LTS, the only dependency...'
        & winget.exe install --id OpenJS.NodeJS.LTS --exact --source winget --accept-package-agreements --accept-source-agreements
        if ($LASTEXITCODE -ne 0) { throw 'Node.js installation did not complete. Install Node.js LTS from https://nodejs.org, then retry.' }
        $candidate = Join-Path $env:ProgramFiles 'nodejs\node.exe'
        if (-not (Test-Path -LiteralPath $candidate)) { throw 'Open a new terminal after installation and run start-server.bat again.' }
        $nodePath = $candidate
    }
    if (-not $nodePath) { throw 'Node.js could not be found; no server was stopped.' }
    & $nodePath (Join-Path $PSScriptRoot 'server.cjs') $Action
    if ($LASTEXITCODE -ne 0) { throw 'Server command failed. See the message above.' }
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
