"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const github = tslib_1.__importStar(require("@actions/github"));
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const constants_1 = require("./constants");
const octokit = github.getOctokit(constants_1.GITHUB_TOKEN);
const ANCHOR_NUMBER = 5;
const md = path_1.default.resolve(__dirname, '../README.md');
const addIssueInfo = (issue) => {
    const time = dayjs_1.default(issue.created_at).format('YYYY-MM-DD');
    fs_1.default.appendFileSync(md, `[${issue.title}](${issue.html_url})--${time}\n\n`);
};
const getAllIssue = async () => {
    console.log(constants_1.GITHUB_REPOSITORY_OWNER, constants_1.GITHUB_REPOSITORY);
    const res = await octokit.issues.listForRepo({
        owner: constants_1.GITHUB_REPOSITORY_OWNER,
        repo: constants_1.GITHUB_REPOSITORY.replace(`${constants_1.GITHUB_REPOSITORY_OWNER}/`, ''),
    });
    return res.data;
};
const addRecentMd = (issues) => {
    fs_1.default.appendFileSync(md, '## 最近更新\n');
    issues.forEach((issue) => {
        addIssueInfo(issue);
    });
};
const addLabelMd = (allIssues) => {
    const labelMapIssue = {};
    allIssues.forEach((issue) => {
        issue.labels.forEach((label) => {
            if (!labelMapIssue[label.name]) {
                labelMapIssue[label.name] = [];
            }
            labelMapIssue[label.name].push(issue);
        });
    });
    for (const labelName in labelMapIssue) {
        fs_1.default.appendFileSync(md, `## ${labelName}\n`);
        let i = 0;
        labelMapIssue[labelName].forEach((issue, index) => {
            if (index === ANCHOR_NUMBER) {
                fs_1.default.appendFileSync(md, '<details><summary>显示更多</summary>\n\n');
                i++;
            }
            addIssueInfo(issue);
        });
        if (i > 0) {
            fs_1.default.appendFileSync(md, '</details>\n\n');
        }
    }
};
async function init() {
    fs_1.default.writeFileSync(md, constants_1.HEAD);
    const allIssue = await getAllIssue();
    addRecentMd(allIssue.slice(0, 10));
    addLabelMd(allIssue);
}
init();
//# sourceMappingURL=index.js.map