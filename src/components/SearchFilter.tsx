// src/components/SearchFilter.tsx

import React from 'react';
import {
  Paper,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

interface SearchFilterProps {
  filters: {
    search: string;
    role: string;
    specialty: string;
    experience: string;
  };
  onFilterChange: (name: string, value: string) => void;
  onClearFilters: () => void;
}

const SearchFilter = ({ filters, onFilterChange, onClearFilters }: SearchFilterProps) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Search Crewmates"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={filters.role}
              label="Role"
              onChange={(e) => onFilterChange('role', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Engineer">Engineer</MenuItem>
              <MenuItem value="Designer">Designer</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Specialty</InputLabel>
            <Select
              value={filters.specialty}
              label="Specialty"
              onChange={(e) => onFilterChange('specialty', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Frontend">Frontend</MenuItem>
              <MenuItem value="Backend">Backend</MenuItem>
              <MenuItem value="Full Stack">Full Stack</MenuItem>
              <MenuItem value="UI/UX">UI/UX</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Experience</InputLabel>
            <Select
              value={filters.experience}
              label="Experience"
              onChange={(e) => onFilterChange('experience', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Junior">Junior</MenuItem>
              <MenuItem value="Mid-Level">Mid-Level</MenuItem>
              <MenuItem value="Senior">Senior</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={1}>
          <Tooltip title="Clear Filters">
            <IconButton onClick={onClearFilters} color="primary">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchFilter;