/* global Package Npm */

Package.describe({
  name: 'f7:email-resend',
  summary: 'Resend email support',
  version: '0.0.1',
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
