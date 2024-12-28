const vscode = acquireVsCodeApi();

window.addEventListener('message', event => {
    const message = event.data;
    if (message.command === 'updateGraph') {
        renderGraph(message.data);
    }
    switch (message.command) {
        case 'loadData':
            if (message.data) {
                renderGraph(message.data);
            } else {
                vscode.postMessage({ command: 'alert', text: 'Failed to load LangGraph data.' });
            }
            break;
    }
});

function renderGraph(data) {
    // Clear any existing content
    d3.select('#graph').html('');

    // Set up dimensions
    const width = 800;
    const height = 600;

    // Create an SVG element
    const svg = d3.select('#graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Initialize simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2));

    // Add links
    const link = svg.append('g')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', d => Math.sqrt(d.value));

    // Add nodes
    const node = svg.append('g')
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', '#69b3a2')
        .call(drag(simulation));

    // Add labels
    const label = svg.append('g')
        .selectAll('text')
        .data(data.nodes)
        .enter()
        .append('text')
        .attr('dy', -3)
        .attr('dx', 12)
        .text(d => d.id);

    // Update positions on each tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        label
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    });

    // Drag functions
    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
}