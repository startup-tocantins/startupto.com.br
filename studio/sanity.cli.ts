import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'megra9kk',
    dataset: 'production'
  },
  studioHost: 'startupto',
  deployment: {
    appId: 'mztosjcltzz77huegxdwf7mo',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
