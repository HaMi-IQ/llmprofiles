module.exports = async function createSchemaIssue(context, github) {
  const profiles = context.payload.outputs.profiles.split(' ');
  const changeSummary = context.payload.outputs.changeSummary;
  
  const title = `Schema Changes Detected - ${profiles.join(', ')}`;
  const body = `## Schema Changes Detected

The following profiles have schema changes that may require attention:

${profiles.map(p => `- **${p}**: Schema validation rules updated`).join('\n')}

### Change Summary
${changeSummary}

### Action Required
Please review these schema changes to ensure:
- Backward compatibility is maintained
- Validation rules are appropriate
- Documentation is updated accordingly

### Related Commits
- Commit: ${context.sha}
- Author: ${context.actor}
- Branch: ${context.ref}

---
*This issue was automatically created by the Profile Change Detection workflow*`;

  await github.rest.issues.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: title,
    body: body,
    labels: ['schema-change', 'automated', 'needs-review']
  });
};
