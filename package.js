Package.describe({
  name: 'brewhk:accounts-admin-password',
  version: '0.0.1',
  summary: 'Allows administrators to login as any user',
  git: 'https://github.com/brewhk/accounts-admin-password.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['ecmascript', 'accounts-password', 'check']);
  api.use('alanning:roles@1.2.14', ['server']);
  api.addFiles('accounts-admin-password-server.js', ['server']);
  api.addFiles('accounts-admin-password-client.js', ['client']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('brewhk:accounts-admin-password');
  api.addFiles('accounts-admin-password-tests.js');
});
