# CIMB

##### Deployment flow and type of commits

---

<b>`master`</b>: This branch as the latest production code. When ever we are releasing should provide a tag using `git tag <tag_name> HEAD (for the last commit)` (ex. release - 4.1).

<b>`deploy-prod`</b>: This branch contains production ready code. `master` branch will be merged to this when we are deploying.

<b>`deploy-dev`</b>: This branch contains deployment code for the development environment. When any new features are done, then the code is merged to this branch for first round of testing.

<b>`deploy-uat`</b>: This branch contains uat code. The code will be merged to this branch for the second round of testing.

<b>`<version_name>`</b>: This branch is created for a new version(sprint).

<b>`feature/<feature_name>`</b>: For any new features, this branch is made from branch `<version_name>`, and will merged to the same.

<br>
<b>Commit messages followed,</b>

- feat: Any new feature
- bug/fix `(<cimb id>)`: A bug fix with jira ticket id
- style: Related to stylings
