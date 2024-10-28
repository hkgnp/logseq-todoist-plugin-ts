import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import { getAllLabels, getAllProjects } from './features/helpers'
import { retrieveTasks } from './features/retrieve'
import { insertTasksIntoGraph } from './features/retrieve/insert-tasks-into-graph'
import { sendTask } from './features/send'
import { SendTask } from './features/send/components/SendTask'
import handleListeners from './handleListeners'
import { callSettings } from './settings'

const main = async () => {
  console.log('logseq-todoist-plugin loaded')
  handleListeners()

  if (logseq.settings!.apiToken === '') {
    // Check if it's a new install
    await logseq.UI.showMsg(
      'Please key in your API key before using the plugin',
      'error',
    )
  }
  const projects = await getAllProjects()
  const labels = await getAllLabels()
  callSettings(projects, labels)

  // const templates = await logseq.App.getCurrentGraphTemplates()
  // console.log('Templates', templates)

  // RETRIEVE TASKS
  logseq.Editor.registerSlashCommand('Todoist: Retrieve Tasks', async (e) => {
    const tasks = await retrieveTasks('default')
    if (tasks.length > 0) await insertTasksIntoGraph(tasks, e.uuid)
  })

  logseq.Editor.registerSlashCommand(
    "Todoist: Retrieve Today's Tasks",
    async (e) => {
      const tasks = await retrieveTasks('today')
      if (tasks.length > 0) await insertTasksIntoGraph(tasks, e.uuid)
    },
  )

  logseq.Editor.registerSlashCommand(
    'Todoist: Retrieve Custom Filter',
    async (e) => {
      const content = await logseq.Editor.getEditingBlockContent()
      if (content.length === 0) {
        logseq.UI.showMsg('Cannot retrieve with empty filter', 'error')
        return
      }
      const tasks = await retrieveTasks('custom', content)
      if (tasks.length > 0) {
        await logseq.Editor.updateBlock(e.uuid, '') // Clear block first since it contains the filter
        await insertTasksIntoGraph(tasks, e.uuid)
      }
    },
  )

  // SEND TASKS
  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  logseq.Editor.registerSlashCommand(
    'Todoist: Send Task (manual)',
    async (e) => {
      const content = await logseq.Editor.getEditingBlockContent()
      if (content.length === 0) {
        logseq.UI.showMsg('Unable to send empty task', 'error')
        return
      }
      const msgKey = await logseq.UI.showMsg(
        'Getting projects and labels',
        'success',
      )
      const allProjects = await getAllProjects()
      const allLabels = await getAllLabels()
      logseq.UI.closeMsg(msgKey)

      root.render(
        <SendTask
          key={e.uuid}
          content={content}
          projects={allProjects}
          labels={allLabels}
          uuid={e.uuid}
        />,
      )
      logseq.showMainUI()
    },
  )

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
        label: [logseq.settings!.sendDefaultLabel as string],
        due: logseq.settings!.sendDefaultDeadline ? 'today' : '',
        priority: '1',
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
          key={e.uuid}
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
