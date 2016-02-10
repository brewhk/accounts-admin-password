`accounts-admin-password` allows you to login with an admin's password. You can refresh the page and your session will not be lost.

`accounts-admin-password` relies on the [`alanning:roles`](https://github.com/alanning/meteor-roles) package, and it requires you to create users with the role `admin`.

This is different from the [`gwendall:impersonate`](https://github.com/gwendall/meteor-impersonate) package, which will reverse back to the admin user whenever a user refreshes.

### Mechanism

##### `Meteor.loginWithAdminPassword`

`accounts-admin-password` creates a new client-side method `Meteor.loginWithAdminPassword` which is the same as [`Meteor.loginWithPassword`](https://github.com/meteor/meteor/blob/master/packages/accounts-password/password_client.js#L23). The only difference is we're passing in an additional option - `withAdminPassword` - and the `password` property is renamed `adminPassword`. This prevents the [password login handler](https://github.com/meteor/meteor/blob/5931bcdae362e1026ceb8a08e5a4b053ce5340b7/packages/accounts-password/password_server.js#L244) from process the request, and leaves it for our own login handler to pick up the request.

> The password is hashed with [`Accounts._hashPassword`](https://github.com/meteor/meteor/blob/dc3cd6eb92f2bdd1bb44000cdd6abd1e5d0285b1/packages/accounts-password/password_client.js#L65-L70) before being sent over the wire.

##### Login Handler

First, the options is checked for validity. The validators are copied from the [`accounts-password`](https://github.com/meteor/meteor/blob/5931bcdae362e1026ceb8a08e5a4b053ce5340b7/packages/accounts-password/password_server.js#L208-L228) package.

Next, we check for our `withAdminPassword` flag inside the `options` object. If this is set to `true` then we know we should handle it.

We then use [`Roles.getUsersInRole`](https://github.com/alanning/meteor-roles/blob/master/roles/roles_common.js#L418-L483) from the [`alanning:roles`](https://github.com/alanning/meteor-roles) package [``](https://github.com/meteor/meteor/blob/5931bcdae362e1026ceb8a08e5a4b053ce5340b7/packages/accounts-password/password_server.js#L61-L73) to get all the users that are admins. We then use a `for` loop to check whether the password belongs to any of the admins.

If it does, then we get the user and add a login token to the user's resume using [`Accounts._generateStampedLoginToken`](https://github.com/meteor/meteor/blob/0f98ea22fcc3f10cfd36aba66e531bf22c70f96e/packages/accounts-base/accounts_server.js#L1057-L1062) and [`Accounts._insertLoginToken`](https://github.com/meteor/meteor/blob/0f98ea22fcc3f10cfd36aba66e531bf22c70f96e/packages/accounts-base/accounts_server.js#L830-L836)

The token is returned alongside the user's `id` and the user is logged in.