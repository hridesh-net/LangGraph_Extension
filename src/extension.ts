// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let currentPanel: vscode.WebviewPanel | null = null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Activating LangGraph Visualizer extension...');

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "graph" is now active!');
	console.log(context.extensionPath)

	let panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
		'langGraphVisualizer',
		'LangGraph Visualizer',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
		}
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('langGraphVisualizer.show', () => {
		if (currentPanel) {
			// If a panel already exists, reveal it instead of creating a new one
			currentPanel.reveal(vscode.ViewColumn.One);
		} else {
			// Create a new webview panel
			currentPanel = vscode.window.createWebviewPanel(
				'langGraphVisualizer',
				'LangGraph Visualizer',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'ext-app'))],
					retainContextWhenHidden: true, // Retain webview state when hidden
				}
			);

			const appPath = path.join(context.extensionPath, 'src', 'webview', 'ext-app');

			currentPanel.webview.html = getWebviewContent(panel.webview, appPath);

			// Load initial data
			sendGraphData(currentPanel);

			// Handle disposal
			currentPanel.onDidDispose(() => {
				currentPanel = null; // Reset the panel instance
			});
		}
	});


	const jsonFilePath = path.join(vscode.workspace.rootPath || '', 'langgraph.json');
	if (fs.existsSync(jsonFilePath)) {
		const fileWatcher = vscode.workspace.createFileSystemWatcher(jsonFilePath);

		fileWatcher.onDidChange(() => {
			if (currentPanel) {
				sendGraphData(currentPanel);
			}
		});

		fileWatcher.onDidDelete(() => {
			if (currentPanel) {
				vscode.window.showErrorMessage('The langgraph.json file was deleted!');
			}
		});

		context.subscriptions.push(fileWatcher);
	}

	context.subscriptions.push(disposable);


}

function sendGraphData(panel: vscode.WebviewPanel) {
	const jsonFilePath = path.join(vscode.workspace.rootPath || '', 'langgraph.json');
	if (fs.existsSync(jsonFilePath)) {
		const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
		panel.webview.postMessage({ command: 'updateGraph', data: JSON.parse(jsonData) });
	} else {
		vscode.window.showErrorMessage('The langgraph.json file does not exist in the workspace!');
	}
}

function getWebviewContent(webview: vscode.Webview, extensionPath: string): string {

	const buildPath = path.join(extensionPath, 'build')
	const indexPath = path.join(extensionPath, 'build', 'index.html')
	const indexUri = webview.asWebviewUri(vscode.Uri.file(indexPath));

    const baseUri = webview.asWebviewUri(vscode.Uri.file(buildPath));

	let indexHtml = fs.readFileSync(indexPath, 'utf8');

	indexHtml = indexHtml.replace(/(href|src)="([^"]+)"/g, (_, attr, url) => {
        // Resolve paths relative to the build directory
        const assetUri = webview.asWebviewUri(vscode.Uri.file(path.join(buildPath, url)));
		console.log('asset', assetUri)
        return `${attr}="${assetUri}"`;
    });

    return indexHtml;
    // const reactAppPath = path.join(extensionPath);

    // const reactAppUri = webview.asWebviewUri(vscode.Uri.file(reactAppPath));
	// console.log(reactAppPath)
	// console.log(reactAppUri)

    // return `
    // <!DOCTYPE html>
    // <html lang="en">
    //     <head>
    //         <meta charset="UTF-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <title>LangGraph Visualizer</title>
    //     </head>
    //     <body>
	// 	hello from graph
    //         <iframe
    //             src="${reactAppUri}"
    //             style="width: 100%; height: 100%; border: none;"
    //         ></iframe>
    //     </body>
    // </html>`;
}

// function getWebviewContent(webview: vscode.Webview, extensionPath: string): string {
// 	const scriptPathOnDisk = vscode.Uri.file(path.join(extensionPath, 'media', 'main.js'));
// 	const stylePathOnDisk = vscode.Uri.file(path.join(extensionPath, 'media', 'node.css'));
// 	const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
// 	const styleUri = webview.asWebviewUri(stylePathOnDisk);

// 	const nonce = getNonce();

// 	return `<!DOCTYPE html>
// 	<html lang="en">
// 	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
// 	<head>
// 	  <meta charset="UTF-8">
// 	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
// 	  <title>LangGraph Visualizer</title>
// 	  <link rel="stylesheet" type="text/css" href="${styleUri}">
// 	  <script nonce="${nonce}" src="${scriptUri}"></script>
// 	  <script nonce="${nonce}" src="https://d3js.org/d3.v7.min.js"></script>
// 	</head>
// 	<body>
// 	  <div id="graph"></div>
// 	</body>
// 	</html>`;
// }

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function loadLangGraphData(): any {
	// Replace with the actual path to your LangGraph data file
	const dataPath = path.join(vscode.workspace.rootPath || '', 'langgraph.json');
	if (fs.existsSync(dataPath)) {
		const data = fs.readFileSync(dataPath, 'utf8');
		return JSON.parse(data);
	} else {
		vscode.window.showErrorMessage('LangGraph data file not found.');
		return null;
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }
