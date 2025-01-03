import React from 'react';
import { Card, CardContent, Box } from '@mui/material';
import { Handle, Position } from '@xyflow/react';

const handleStyle = {
    width: 10,
    height: 10,
    background: '#00bcd4',
    borderRadius: '50%',
    zIndex: 10,
};

interface CustomCardProps {
    id: string;
    data: {
        title: string;
        subtitle: string;
        description: string;
        onUpdate?: (id: string, updates: Partial<{ title: string; subtitle: string; description: string }>) => void;
    };
    selected?: boolean;
}

const CustomCard: React.FC<CustomCardProps> = ({ id, data, selected }) => {
    const handleChange = (field: keyof typeof data) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        data.onUpdate?.(id, { [field]: event.target.value });
    };

    return (
        <div style={{ position: 'relative', minWidth: 240, minHeight: 150 }}>
            {/* Top Handles */}
            <Handle
                id="top-source"
                type="source"
                position={Position.Top}
                style={{ ...handleStyle, top: '-10px', left: '50%', transform: 'translateX(-50%)' }}
            />
            <Handle
                id="top-target"
                type="target"
                position={Position.Top}
                style={{ ...handleStyle, top: '-10px', left: '50%', transform: 'translateX(-50%)' }}
            />
            <Handle
                id="bottom-source"
                type="source"
                position={Position.Bottom}
                style={{ ...handleStyle, bottom: '-10px', left: '50%', transform: 'translateX(-50%)' }}
            />
            <Handle
                id="bottom-target"
                type="target"
                position={Position.Bottom}
                style={{ ...handleStyle, bottom: '-10px', left: '50%', transform: 'translateX(-50%)' }}
            />
            <Handle
                id="left-source"
                type="source"
                position={Position.Left}
                style={{ ...handleStyle, left: '-10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <Handle
                id="left-target"
                type="target"
                position={Position.Left}
                style={{ ...handleStyle, left: '-10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <Handle
                id="right-source"
                type="source"
                position={Position.Right}
                style={{ ...handleStyle, right: '-10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <Handle
                id="right-target"
                type="target"
                position={Position.Right}
                style={{ ...handleStyle, right: '-10px', top: '50%', transform: 'translateY(-50%)' }}
            />

            {/* Card Content */}
            <Card
                variant="outlined"
                sx={{
                    backgroundColor: '#2d3748',
                    color: '#e2e8f0',
                    border: selected ? '2px solid #63b3ed' : '1px solid #4a5568',
                    borderRadius: 10,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
                    width: '100%',
                    height: '100%',
                    padding: 2,
                    cursor: 'pointer',
                }}
            >
                <CardContent>
                    {/* Editable Title */}
                    <Box mb={2}>
                        <label htmlFor={`title-${id}`}>
                            <input
                                id={`title-${id}`}
                                value={data.title}
                                onChange={handleChange('title')}
                                placeholder="Title"
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid #4a5568',
                                    color: '#e2e8f0',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    outline: 'none',
                                }}
                            />
                        </label>
                    </Box>

                    {/* Editable Subtitle */}
                    <Box mb={2}>
                        <label htmlFor={`subtitle-${id}`}>
                            <input
                                id={`subtitle-${id}`}
                                value={data.subtitle}
                                onChange={handleChange('subtitle')}
                                placeholder="Subtitle"
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid #4a5568',
                                    color: '#a0aec0',
                                    fontSize: '0.9rem',
                                    fontStyle: 'italic',
                                    outline: 'none',
                                }}
                            />
                        </label>
                    </Box>

                    {/* Editable Description */}
                    <Box>
                        <label htmlFor={`description-${id}`}>
                            <textarea
                                id={`description-${id}`}
                                value={data.description}
                                onChange={handleChange('description')}
                                placeholder="Description"
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: '1px solid #4a5568',
                                    borderRadius: 5,
                                    color: '#e2e8f0',
                                    fontSize: '0.85rem',
                                    padding: 5,
                                    outline: 'none',
                                    resize: 'none',
                                }}
                                rows={3}
                            />
                        </label>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomCard;