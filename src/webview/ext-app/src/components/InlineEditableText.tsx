// src/components/InlineEditableText.tsx
import React, { useState, KeyboardEvent, FocusEvent } from 'react';
import { Typography, TextField } from '@mui/material';

interface InlineEditableTextProps {
    value: string;
    onChange: (newVal: string) => void;
    variant_val?: 'h6' | 'subtitle1' | 'body1' | 'body2' | string;
    fontWeight?: number;
}

/**
 * InlineEditableText
 * - Shows text
 * - Switches to a TextField when clicked
 * - Saves changes on blur or Enter key
 */
const EditableText: React.FC<InlineEditableTextProps> = ({
    value,
    onChange,
    variant_val = 'body1',
    fontWeight,
}) => {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    // Switch from display to edit mode
    const handleEnterEditMode = () => {
        setTempValue(value);
        setEditing(true);
    };

    // Switch from edit mode to display mode
    const handleExitEditMode = (
        e?: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setEditing(false);
        onChange(tempValue);
    };

    // Handle text changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempValue(e.target.value);
    };

    // Save on Enter key
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            handleExitEditMode();
        }
    };

    if (editing) {
        // Show TextField
        return (
            <TextField
                autoFocus
                value={tempValue}
                onChange={handleChange}
                onBlur={handleExitEditMode}
                onKeyDown={handleKeyDown}
                size="small"
                variant="standard"
                fullWidth
            />
        );
    }

    // Show Typography (read-only)
    const variantType = variant_val || 'body1';
    if (variant_val == 'body1') {
        return (
            <Typography
                variant='body1'
                sx={{ fontWeight, cursor: 'pointer' }}
                onClick={handleEnterEditMode}
            >
                {value}
            </Typography>
        );
    }
    
    if (variant_val == 'body2') {
        return (
            <Typography
                variant='body2'
                sx={{ fontWeight, cursor: 'pointer' }}
                onClick={handleEnterEditMode}
            >
                {value}
            </Typography>
        );
    }
    
    if (variant_val == 'subtitle1') {
        return (
            <Typography
                variant='subtitle1'
                sx={{ fontWeight, cursor: 'pointer' }}
                onClick={handleEnterEditMode}
            >
                {value}
            </Typography>
        );
    }
    
    if (variant_val == 'h6') {
        return (
            <Typography
                variant='h6'
                sx={{ fontWeight, cursor: 'pointer' }}
                onClick={handleEnterEditMode}
            >
                {value}
            </Typography>
        );
    }

    return (
        <Typography
            variant='body1'
            sx={{ fontWeight, cursor: 'pointer' }}
            onClick={handleEnterEditMode}
        >
            {value}
        </Typography>
    );
};

export default EditableText;