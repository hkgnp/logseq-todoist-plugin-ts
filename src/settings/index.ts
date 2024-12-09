import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

export const callSettings = async (projects: string[], labels: string[]) => {
  const settings: SettingSchemaDesc[] = [
    {
      key: 'apiToken',
      type: 'string',
      default: '',
      title: 'API Token',
      description:
        'Please enter your API token and restart Logseq. You can retrieve your API token from your Todoist developer dashboard.',
    },
    {
      key: '',
      type: 'heading',
      default: '',
      title: 'Sending Tasks',
      description: '',
    },
    {
      key: 'sendDefaultProject',
      type: 'enum',
      default: '--- ---',
      enumChoices: projects,
      enumPicker: 'select',
      title: 'Default Project',
      description:
        'Default project to send tasks to. If this is set, tasks will be sent automatically without the popup.',
    },
    {
      key: 'sendDefaultLabel',
      type: 'enum',
      default: '--- ---',
      enumChoices: labels,
      enumPicker: 'select',
      title: 'Default Label',
      description: 'Default label to label tasks.',
    },
    {
      key: 'sendDefaultDeadline',
      type: 'boolean',
      default: true,
      title: 'Default Deadline',
      description: 'If set to true, default deadline will be set to today.',
    },
    {
      key: 'sendAppendUri',
      type: 'boolean',
      default: true,
      title: 'Append Logseq URI',
      description:
        'If set to true, all tasks sent to Todoist will have the Logseq URI appended.',
    },
    {
      key: '',
      type: 'heading',
      default: '',
      title: 'Retrieving Tasks',
      description: '',
    },
    {
      key: 'retrieveDefaultProject',
      type: 'enum',
      default: '--- ---',
      enumChoices: projects,
      enumPicker: 'select',
      title: 'Default Project',
      description: 'Default project to retrieve tasks from',
    },
    {
      key: 'projectNameAsParentBlk',
      type: 'boolean',
      default: false,
      title: 'Set Project Name as Parent Block',
      description:
        'If true, tasks will be added under a parent block with their project name.',
    },
    {
      key: 'retrieveAppendTodo',
      type: 'boolean',
      default: true,
      title: 'Append TODO',
      description:
        'If set to true, all retrieved tasks will have a TODO appended.',
    },
    {
      key: 'retrieveAppendTodoistId',
      type: 'boolean',
      default: true,
      title: 'Append Todoist ID',
      description:
        'If set to true, all retrieved tasks will have their todoistId appended.',
    },
    {
      key: 'retrieveAppendUrl',
      type: 'boolean',
      default: false,
      title: 'Append URL',
      description:
        'If set to true, all retrieved tasks will have a Todoist URL appended.',
    },
    {
      key: 'retrieveClearTasks',
      type: 'boolean',
      default: false,
      title: 'Clear Tasks from Todoist',
      description:
        'If set to true, retrieved tasks will be deleted in Todoist.',
    },
    {
      key: 'retrieveAppendCreationDateTime',
      type: 'boolean',
      default: false,
      title: 'Append Creation Date and Time',
      description:
        'If set to true, all retrieved tasks will have their creation date and time appended.',
    },
    {
      key: 'retrieveAppendLabels',
      type: 'boolean',
      default: false,
      title: 'Append task labels',
      description:
        'If set to true, all retrieved tasks will have their tags appended.',
    },
  ]

  logseq.useSettingsSchema(settings)
}
