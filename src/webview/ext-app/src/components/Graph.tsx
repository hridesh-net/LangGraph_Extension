import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface NodeDatum extends d3.SimulationNodeDatum {
    id: string;
    group: number;
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
    source: string | NodeDatum;
    target: string | NodeDatum;
    value: number;
}

interface GraphData {
    nodes: NodeDatum[];
    links: LinkDatum[];
}

const graphData: GraphData = {
    nodes: [
        { id: "Node1", group: 1 },
        { id: "Node2", group: 1 },
        { id: "Node3", group: 3 },
        { id: "Node4", group: 2 },
        { id: "Node5", group: 3 },
        { id: "Node6", group: 3 },
    ],
    links: [
        { source: "Node1", target: "Node2", value: 1 },
        { source: "Node1", target: "Node3", value: 2 },
        { source: "Node2", target: "Node4", value: 1 },
        { source: "Node3", target: "Node4", value: 3 },
        { source: "Node4", target: "Node5", value: 1 },
        { source: "Node6", target: "Node1", value: 1 },
        { source: "Node6", target: "Node2", value: 1 },
    ],
}; // your data

const Graph: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [selectedNode, setSelectedNode] = useState<NodeDatum | null>(null);

    useEffect(() => {
        // Instead of fixed sizes, let's do 100%:
        const svg = d3.select(svgRef.current)
            .attr("width", "100%")
            .attr("height", "100%");

        svg.selectAll("*").remove();

        // We can measure the actual rendered size if needed:
        // (Or just pick defaults.)
        const container = svgRef.current?.getBoundingClientRect();
        const width = container ? container.width : 800;
        const height = container ? container.height : 600;

        const simulation = d3.forceSimulation<NodeDatum>(graphData.nodes)
            .force("link", d3.forceLink<NodeDatum, LinkDatum>(graphData.links)
                .id(d => d.id)
                .distance(120))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.selectAll<SVGLineElement, LinkDatum>("line")
            .data(graphData.links)
            .enter()
            .append("line")
            .attr("stroke", "#999")
            .attr("stroke-width", 2);

        const node = svg.selectAll<SVGForeignObjectElement, NodeDatum>("foreignObject")
            .data(graphData.nodes)
            .enter()
            .append("foreignObject")
            .attr("width", 140)
            .attr("height", 60)
            .call(d3.drag<SVGForeignObjectElement, NodeDatum>()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                })
            );

        node.append("xhtml:div")
            .attr("class",
                "bg-white border border-gray-300 rounded shadow-md p-2 cursor-move text-center"
            )
            .on("click", (event, d) => {
                if (event.defaultPrevented) return;
                setSelectedNode(d);
            })
            .html(d => `
        <div class="font-bold text-gray-700">${d.id}</div>
        <div class="text-xs text-gray-500">Group: ${d.group}</div>
      `);

        simulation.on("tick", () => {
            link
                .attr("x1", d => typeof d.source === "object" ? d.source.x ?? 0 : 0)
                .attr("y1", d => typeof d.source === "object" ? d.source.y ?? 0 : 0)
                .attr("x2", d => typeof d.target === "object" ? d.target.x ?? 0 : 0)
                .attr("y2", d => typeof d.target === "object" ? d.target.y ?? 0 : 0);

            node
                .attr("x", d => (d.x ?? 0) - 70)
                .attr("y", d => (d.y ?? 0) - 30);
        });

    }, []);

    // Simple overlay to rename node
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedNode) return;
        selectedNode.id = e.target.value;
        setSelectedNode({ ...selectedNode });
    };

    return (
        <div className="relative w-full h-full">
            <svg ref={svgRef} className="overflow-visible" />

            {selectedNode && (
                <div className="absolute top-4 right-4 w-64 p-4 bg-white border rounded shadow-md">
                    <div className="font-bold mb-2">Edit Node</div>
                    <input
                        className="w-full border border-gray-300 rounded p-1 mb-2"
                        type="text"
                        value={selectedNode.id}
                        onChange={handleNameChange}
                    />
                    <button
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => setSelectedNode(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default Graph;