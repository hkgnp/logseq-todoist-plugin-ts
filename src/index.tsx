import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import { getAllLabels, getAllProjects } from './features/helpers'
import { retrieveTasks } from './features/retrieve'
import { sendTask } from './features/send'
import { SendTask } from './features/send/components/SendTask'
import { callSettings } from './settings'
import { PluginSettings } from './settings/types'
import handleListeners from './utils/handleListeners'

const main = async () => {
  console.log('logseq-todoist-plugin loaded')
  handleListeners()

  const { apiToken } = logseq.settings! as Partial<PluginSettings>

  if (!apiToken || apiToken === '') {
    // Check if it's a new install
    await logseq.UI.showMsg(
      'Please key in your API key before using the plugin',
      'error',
    )
  }
  const projects = await getAllProjects()
  const labels = await getAllLabels()
  callSettings(projects, labels)

  // RETRIEVE TASKS
  logseq.Editor.registerSlashCommand('Todoist: Retrieve Tasks', async (e) => {
    await retrieveTasks(e.uuid)
  })
  logseq.Editor.registerSlashCommand(
    "Todoist: Retrieve Today's Tasks",
    async (e) => {
      await retrieveTasks(e.uuid, 'today')
    },
  )
  logseq.Editor.registerSlashCommand(
    'Todoist: Retrieve Custom Filter',
    async (e) => {
      const content = await logseq.Editor.getEditingBlockContent()
      await retrieveTasks(e.uuid, content)
    },
  )

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  // SEND TASKS
  logseq.Editor.registerSlashCommand('Todoist: Send Task', async (e) => {
    const content = await logseq.Editor.getEditingBlockContent()
    if (content.length === 0) {
      logseq.UI.showMsg('Unable to send empty task', 'error')
      return
    }

    // If default project set, don't show popup
    if (logseq.settings!.sendDefaultProject !== '--- ---') {
      await sendTask({
        task: content,
        project: logseq.settings!.sendDefaultProject as string,
        uuid: e.uuid,
      })
    } else {
      // If no default project set, show popup
      const msgKey = await logseq.UI.showMsg(
        'Getting projects and labels',
        'success',
      )
      const allProjects = await getAllProjects()
      const allLabels = await getAllLabels()
      logseq.UI.closeMsg(msgKey)

      root.render(
        <SendTask
          content={content}
          projects={allProjects}
          labels={allLabels}
          uuid={e.uuid}
        />,
      )
      logseq.showMainUI()
    }
  })
}

logseq.ready(main).catch(console.error)
