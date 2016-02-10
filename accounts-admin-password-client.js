Meteor.loginWithAdminPassword = function (selector, password, callback) {

	if (typeof selector === 'string') {
		if (selector.indexOf('@') === -1) {
			selector = {username: selector};
		} else {
			selector = {email: selector};
		}
	}

	var options = {
		user: selector,
		withAdminPassword: true,
		adminPassword: Accounts._hashPassword(password)
	};

	Accounts.callLoginMethod({
		methodArguments: [options],
		userCallback: function (error, result) {
			if (error) {
				callback && callback(error);
			} else {
				callback && callback();
			}
		}
	});
}