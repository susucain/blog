import fs from 'fs'
import path from 'path'
import * as github from '@actions/github'
import dayJs from 'dayjs'
import { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_REPOSITORY_OWNER, HEAD } from './constants'

const octokit = github.getOctokit(GITHUB_TOKEN!)

const ANCHOR_NUMBER = 5
const md = path.resolve(__dirname, '../README.md')

const addIssueInfo = (issue) => {
  const time = dayJs(issue.created_at).format('YYYY-MM-DD')
  fs.appendFileSync(md, `[${issue.title}](${issue.html_url})--${time}\n\n`)
}

const getAllIssue = async () => {
  const res = await octokit.issues.listForRepo({
    owner: GITHUB_REPOSITORY_OWNER!,
    repo: GITHUB_REPOSITORY!,
  })

  return res.data
}

const addRecentMd = (issues) => {
  fs.appendFileSync(md, '## 最近更新\n')
  issues.forEach((issue) => {
    addIssueInfo(issue)
  })
}

const addLabelMd = (allIssues) => {
  const labelMapIssue = {}

  allIssues.forEach((issue) => {
    issue.labels.forEach((label) => {
      if (!labelMapIssue[label.name]) {
        labelMapIssue[label.name] = []
      }
      labelMapIssue[label.name].push(issue)
    })
  })

  for (const labelName in labelMapIssue) {
    fs.appendFileSync(md, `## ${labelName}\n`)
    let i = 0
    labelMapIssue[labelName].forEach((issue, index) => {
      if (index === ANCHOR_NUMBER) {
        fs.appendFileSync(md, '<details><summary>显示更多</summary>\n\n')
        i++
      }
      addIssueInfo(issue)
    })

    if (i > 0) {
      fs.appendFileSync(md, '</details>\n\n')
    }
  }
}

async function init() {
  fs.writeFileSync(md, HEAD)
  const allIssue = await getAllIssue()
  addRecentMd(allIssue.slice(0, 10))
  addLabelMd(allIssue)
}

init()
