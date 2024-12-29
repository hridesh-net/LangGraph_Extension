const vscode = acquireVsCodeApi();

window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.command === 'updateGraph') {
        renderGraph(message.data);
    }
    if (message.command === 'loadData') {
        if (message.data) {
            renderGraph(message.data);
        } else {
            vscode.postMessage({ command: 'alert', text: 'Failed to load LangGraph data.' });
        }
    }
});

function renderGraph(data) {
    // Clear existing content
    d3.select('#graph').html('');

    // Set up dimensions
    const width = 1200;
    const height = 800;

    // Create an SVG element with zoomable group
    const svg = d3.select('#graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const zoomGroup = svg.append('g'); // Group for zooming

    const zoom = d3.zoom()
        .scaleExtent([0.5, 5]) // Allow zoom levels from 0.5x to 5x
        .on('zoom', (event) => {
            zoomGroup.attr('transform', event.transform); // Apply zoom and pan
        });

    svg.call(zoom); // Enable zoom behavior on the SVG

    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id((d) => d.id).distance(200))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2));

    // Add lines for the links
    const link = zoomGroup.selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 2);

    // Each node is an SVG <foreignObject> container for an HTML "card"
    const node = zoomGroup.selectAll('.node')
        .data(data.nodes)
        .enter()
        .append('foreignObject')
        .attr('class', 'node')
        .attr('width', 150)
        .attr('height', 60)
        .call(
            d3.drag()
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragEnded)
        );

    // Add an HTML <div> inside the <foreignObject>
    node.append('xhtml:div')
        .attr('class', 'node-card')
        .html((d) => `
            <div class="card-content">
                <input type="text" class="node-input" value="${d.id}" />
                <p>Group: ${d.group}</p>
            </div>
        `);

    // Attach event listeners for editing the node name
    d3.selectAll('.node-input').on('change', function (event, d) {
        const newValue = this.value.trim();
        if (newValue !== '') {
            d.id = newValue; // Update the data
        }
    });

    // On each tick, update positions of links and nodes
    simulation.on('tick', () => {
        link
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y);

        node
            .attr('x', (d) => d.x - 75) // Center card horizontally
            .attr('y', (d) => d.y - 30); // Center card vertically
    });

    // Drag functions
    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}