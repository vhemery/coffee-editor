const path = require('path')
const os = require('os')

const { app } = require('electron');

// set the default workspace location
console.log(`root-dir=${path.resolve(__dirname, '..', 'SuperBrewer3000')}`)
app.commandLine.appendSwitch(`root-dir=${path.resolve(__dirname, '..', 'SuperBrewer3000')}`)

// Use a set of builtin plugins in our application.
process.env.THEIA_DEFAULT_PLUGINS = `local-dir:${path.resolve(__dirname, '.', 'plugins')}`

// Lookup inside the user's home folder for more plugins, and accept user-defined paths.
process.env.THEIA_PLUGINS = [
    process.env.THEIA_PLUGINS, `local-dir:${path.resolve(os.homedir(), '.theia', 'plugins')}`,
].filter(Boolean).join(',')

// Handover to the auto-generated electron application handler.
require('./src-gen/frontend/electron-main.js')