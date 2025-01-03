import React, { useCallback, useState, useEffect } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    Node,
    Edge,
    Connection,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomCard from './CustomCard';

const nodeTypes = { customCard: CustomCard };

interface DiagramProps {
    initialData: { nodes: Node[]; edges: Edge[] };
}

const Diagram: React.FC<DiagramProps> = ({ initialData }) => {
    const [nodes, setNodes] = useState<Node[]>(initialData.nodes || []);
    const [edges, setEdges] = useState<Edge[]>(initialData.edges || []);

    useEffect(() => {
        setNodes(initialData.nodes || []);
        setEdges(initialData.edges || []);
    }, [initialData]);

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        []
    );

    const handleNodeUpdate = (id: string, updates: any) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, ...updates } } : node
            )
        );
    };

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    return (
        <ReactFlowProvider>
            <div style={{ width: '100%', height: '100vh' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onConnect={onConnect}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    colorMode="dark"
                    style={{
                        background: '#1e293b',
                    }}
                >
                    <Controls />
                    <Background variant={BackgroundVariant.Dots} color="#334155" gap={16} size={1} />
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
};

export default Diagram;