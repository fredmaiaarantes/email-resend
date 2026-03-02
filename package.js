/* global Package Npm */

Package.describe({
  name: 'fredericomaia:email-resend',
  summary: 'Resend Email Client',
  version: '0.0.1',
  git: 'https://github.com/fredmaiaarantes/email-resend',
  documentation: 'README.md',
});

Npm.depends({
  resend: '6.9.3',
});

Package.onUse(api => {
  api.versionsFrom(['2.4', '3.0']);

  api.use(['email'], ['server']);

  api.use('ecmascript');

  api.mainModule('server.js', 'server');
});
