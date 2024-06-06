console.log("From Bundle");

import { Terminal } from '@xterm/xterm';

// Ensure Terminal is globally accessible
window.Terminal = Terminal;

// Assuming this is within xterm.bundle.js or a similar script where Terminal is defined
window.initializeTerminal = function() {
    var terminal = new Terminal();
    terminal.open(document.getElementById('terminal-container'));
    terminal.writeln('SSH Terminal Ready...');

    let currentCommand = '';
    terminal.onKey(({ key, domEvent }) => {
        if (domEvent.keyCode === 13) { // Enter key
            terminal.writeln(""); // Move to a new line
            if (currentCommand.trim()) {
                // Replace this with the actual function to send the command
                executeSSHCommand(field.get_value(), currentCommand);
            }
            currentCommand = ''; // Reset command after sending
        } else if (domEvent.keyCode === 8) { // Backspace key
            currentCommand = currentCommand.slice(0, -1); // Remove last character
        } else {
            currentCommand += key; // Append pressed key to current command
            terminal.write(key); // Echo pressed key to terminal
        }
    });
};
