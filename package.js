/* global Package Npm */

Package.describe({
  name: 'f7labs:email-resend',
  summary: 'Resend Email Client',
  version: '0.0.3',
  git: 'https://github.com/fredmaiaarantes/email-resend',
  documentation: 'README.md',
});

Npm.depends({
  resend: '0.15.3',
});

Package.onUse(api => {
  api.versionsFrom('2.4');

  api.use(['email'], ['server']);

  api.use('ecmascript');
  api.use('quave:settings@1.0.0');

  api.mainModule('server.js', 'server');
});
