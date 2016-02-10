var NonEmptyString = Match.Where(function (x) {
	check(x, String);
	return x.length > 0;
});

var userQueryValidator = Match.Where(function (user) {
	check(user, {
		id: Match.Optional(NonEmptyString),
		username: Match.Optional(NonEmptyString),
		email: Match.Optional(NonEmptyString)
	});
	if (_.keys(user).length !== 1)
		throw new Match.Error("User property must have exactly one field");
	return true;
});

var passwordValidator = Match.OneOf(
	String,
	{ digest: String, algorithm: String }
);

Accounts.registerLoginHandler("adminPassword", function(options) {
	check(options, {
		user: userQueryValidator,
		withAdminPassword: Boolean,
		adminPassword: passwordValidator
	});

	// Only handle requests with options.withAdminPassword set to true
	if(options.withAdminPassword !== true) {
		return undefined;
	}

	// Get all the admin users
	let adminUsers = Roles.getUsersInRole('admin').fetch();

	// This variable tells us whether the password matches an admin's
	// We will check back on this later
	let adminValidated = false;

	// Checks if the password belongs to an admin
	for (let i = 0; i < adminUsers.length; i++) {
		let adminValidation = Accounts._checkPassword(adminUsers[i], options.adminPassword);

		// if the password does match the admin's (there are no errors)
		// Set adminValidated to true
		if (!adminValidation.error) {
			adminValidated = true;
			break;
		}

		// Otherwise continue with the loop
	}

	// If the password does not match any admins, throw error
	if (adminValidated !== true) {
		throw new Meteor.Error(400, "Password is incorrect");
	}
	
	// If the password matches, get the user
	let user = Accounts._findUserByQuery(options.user);

	// Generate a loginToken
	let stampedLoginToken = Accounts._generateStampedLoginToken();

	// Add a loginToken to the user's resume
	Accounts._insertLoginToken(user._id, stampedLoginToken);

	// Return the token alongside the user's id
	return {
		userId: user._id,
		token: stampedLoginToken.token,
		tokenExpires: Accounts._tokenExpiration(stampedLoginToken.when)
	}
});