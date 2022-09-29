import * as vscode from 'vscode';
import { minify } from 'uglify-php'

const tinkerify = async (input: string): Promise<string> => {
	input = await minify(input)

	// Escape dollar signs.
	input = input.replaceAll("$", '\\$')

	// Escape double quotes.
	input = input.replaceAll("\"", "\\\"")

	return `tinker --execute="${input}"`
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let selectionCommand = vscode.commands.registerCommand('tinkerify.selection', async () => {
		const editor = vscode.window.activeTextEditor;

		if (! editor) {
			vscode.window.showInformationMessage('No active editor!');
		} else {
			vscode.env.clipboard.writeText(
				await tinkerify(editor.document.getText(editor.selection))
			)

			vscode.window.showInformationMessage('Command copied to clipboard!')
		}
	});

	let selectionWithDumpCommand = vscode.commands.registerCommand('tinkerify.selectionWithDump', async () => {
		const editor = vscode.window.activeTextEditor;

		if (! editor) {
			vscode.window.showInformationMessage('No active editor!');
		} else {
			vscode.env.clipboard.writeText(
				await tinkerify(`dump(${editor.document.getText(editor.selection)});`)
			)

			vscode.window.showInformationMessage('Command copied to clipboard!')
		}
	});

	context.subscriptions.push(selectionCommand, selectionWithDumpCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
