frappe.pages['terminal'].on_page_load = function(wrapper) {
	let page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Terminal',
		single_column: true
	});
	page.set_indicator('BETA', 'purple');
	frappe.breadcrumbs.add("Setup");
	$(frappe.render_template("terminal")).appendTo(page.body.addClass("no-border"));

	let field = page.add_field({
		label: 'IP Address',
		fieldname: 'ipaddr',
		fieldtype: 'Data',
		value: '10.10.0.61'
	});

	let terminal;  // Reference to the Terminal instance

	page.set_primary_action('Connect SSH', function() {
		let ipAddress = field.get_value();
		if (!ipAddress) {
			frappe.msgprint(__('Please enter an IP address.'));
			return;
		}

		// Ensure the terminal is initialized before trying to connect
		if (!terminal) {
			if (window.initializeTerminal) { // Check if initializeTerminal is loaded
				window.initializeTerminal();
			} else {
				console.error('Terminal initialization function not found.');
			}
		}
	});

	// This should stay outside of any specific function to ensure it's called on page show
	frappe.require('xterm.bundle.js', () => {

	});
};

function executeSSHCommand(ipAddress, command) {
	frappe.call({
		method: 'sysadmin.sysadmin.page.terminal.terminal.run_ssh_command', // Ensure the path is correct
		args: {
			ip: ipAddress,
			username: 'frappe', // Adjust according to your auth method
			password: '$0ft%963$', // Adjust accordingly
			command: command
		},
		callback: function(response) {
			if (response.message && terminal) {
				terminal.writeln(response.message); // Display command output
				console.log(response.message);
			}
		}
	});
}
