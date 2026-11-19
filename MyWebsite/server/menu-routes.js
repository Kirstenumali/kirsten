const express = require('express');
const path = require('path');

module.exports = function mountMenu(app) {
  const root = path.resolve(__dirname, '../..');
  app.get('/', (req, res) => res.sendFile(path.join(root, 'Menu/index.html')));
  for (const folder of ['Menu', 'BugBountyCompany', 'ContentCreator', 'Jobs', 'MyWebsite']) {
    app.use('/' + folder, express.static(path.join(root, folder)));
  }
  // Preserve the absolute links used by the existing tools after their move.
  const groups = {
    BugBountyCompany: ['aiaskhack', 'bankdetails', 'bigbountyapis', 'bigbountyrooms', 'bounty-shared', 'easybugs', 'myaccount', 'newhireintroduction', 'resigning', 'team', 'users', 'waitlist', 'waitlistadmin'],
    ContentCreator: ['contentcreatorbuilder'],
    Jobs: ['bigcompanies', 'bigcompaniesuae', 'biggersalary', 'internationalcompanies', 'jobleads', 'jobapplierindeed', 'spainjob'],
    'Jobs/jobapplierindeed': ['jobapplier', 'cybersecurityjobs', 'freelance', 'internationeuropejobs'],
    'Jobs/jobleads': ['leadcybersecurity']
  };
  for (const [group, folders] of Object.entries(groups)) {
    for (const folder of folders) app.use('/' + folder, express.static(path.join(root, group, folder)));
  }
  app.use('/salary', express.static(path.join(root, 'BugBountyCompany/bankdetails')));
};
