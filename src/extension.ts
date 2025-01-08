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
				currentPanel = null;
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
        try {
            const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
            panel.webview.postMessage({ command: 'updateGraph', data: JSON.parse(jsonData) });
        } catch (error) {
            vscode.window.showErrorMessage('Error reading langgraph.json: ' + error);
        }
    } else {
        vscode.window.showErrorMessage('The langgraph.json file does not exist in the workspace!');
    }
}


function getWebviewContent(webview: vscode.Webview, extensionPath: string): string {
    const buildPath = path.join(extensionPath, 'build');
    const indexPath = path.join(buildPath, 'index.html');
    const baseUri = webview.asWebviewUri(vscode.Uri.file(buildPath));

    let indexHtml = fs.readFileSync(indexPath, 'utf8');

    // Resolve asset paths
    indexHtml = indexHtml.replace(/(href|src)="([^"]+)"/g, (_, attr, url) => {
        const assetUri = webview.asWebviewUri(vscode.Uri.file(path.join(buildPath, url)));
        return `${attr}="${assetUri}"`;
    });

    return indexHtml.replace('<base href="/" />', `<base href="${baseUri}/" />`);
}


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
