![Header Image](images/Langgraph_header.png)

# LangGraph Visualizer

LangGraph Visualizer is a Visual Studio Code (VS Code) extension that provides real-time visual representations of multi-agent LangGraph projects. It enables developers to intuitively understand and monitor the flow and interactions of agents within their projects.

> **Note:** After Installation just use command ```cmd+shift+l```To se the Visual representaion


## Features

- **Real-Time Visualization:** Automatically updates the graph as the langgraph.json file changes, reflecting the current state of your project.

- **Interactive Interface:** Allows users to explore agent nodes and their connections within the graph.

- **Seamless Integration:** Easily integrates into your VS Code workflow, enhancing productivity without disrupting your development process.


## Directory Structure

```bash
.
├── CHANGELOG.md
├── README.md
├── eslint.config.mjs
├── images
│   └── Langgraph_header.png
├── media
│   ├── main.js
│   └── node.css
├── package-lock.json
├── package.json
├── src
│   ├── extension.ts
│   ├── test
│   │   └── extension.test.ts
│   └── webview
│       └── ext-app
│           ├── README.md
│           ├── package-lock.json
│           ├── package.json
│           ├── postcss.config.js
│           ├── public
│           │   ├── favicon.ico
│           │   ├── index.html
│           │   ├── logo192.png
│           │   ├── logo512.png
│           │   ├── manifest.json
│           │   └── robots.txt
│           ├── src
│           │   ├── App.css
│           │   ├── App.test.tsx
│           │   ├── App.tsx
│           │   ├── components
│           │   │   ├── CustomCard.tsx
│           │   │   ├── Diagram.tsx
│           │   │   ├── Graph.tsx
│           │   │   ├── InlineEditableText.tsx
│           │   │   └── ResourceSidebar.tsx
│           │   ├── global.d.ts
│           │   ├── index.css
│           │   ├── index.tsx
│           │   ├── logo.svg
│           │   ├── react-app-env.d.ts
│           │   ├── reportWebVitals.ts
│           │   └── setupTests.ts
│           ├── tailwind.config.js
│           └── tsconfig.json
├── tailwind.config.js
├── tsconfig.json
└── vsc-extension-quickstart.md
```

## Example

![Extension in Action](images/action.gif)

----


> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
