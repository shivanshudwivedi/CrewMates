import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Pagination,
  Box,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Crewmate {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 6;

const CrewmateManager = () => {
  // State for crewmates and loading
  const [crewmates, setCrewmates] = useState<Crewmate[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Engineer',
    specialty: 'Frontend',
    experience: 'Junior'
  });

  // UI state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState(0);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    specialty: '',
    experience: ''
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Fetch crewmates on component mount
  useEffect(() => {
    fetchCrewmates();
  }, []);

  const fetchCrewmates = async () => {
    try {
      const { data, error } = await supabase
        .from('crewmates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCrewmates(data || []);
    } catch (error) {
      console.error('Error fetching crewmates:', error);
      showSnackbar('Error fetching crewmates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('crewmates')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        showSnackbar('Crewmate updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('crewmates')
          .insert([formData]);

        if (error) throw error;
        showSnackbar('Crewmate added successfully', 'success');
      }

      resetForm();
      await fetchCrewmates();
    } catch (error) {
      console.error('Error saving crewmate:', error);
      showSnackbar('Error saving crewmate', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const { error } = await supabase
        .from('crewmates')
        .delete()
        .eq('id', deletingId);

      if (error) throw error;
      showSnackbar('Crewmate deleted successfully', 'success');
      await fetchCrewmates();
    } catch (error) {
      console.error('Error deleting crewmate:', error);
      showSnackbar('Error deleting crewmate', 'error');
    } finally {
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const startEdit = (crewmate: Crewmate) => {
    setFormData({
      name: crewmate.name,
      role: crewmate.role,
      specialty: crewmate.specialty,
      experience: crewmate.experience
    });
    setEditingId(crewmate.id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'Engineer',
      specialty: 'Frontend',
      experience: 'Junior'
    });
    setEditingId(null);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      specialty: '',
      experience: ''
    });
    setPage(1);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(crewmates, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = 'crewmates.json';
    link.href = url;
    link.click();
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (Array.isArray(data)) {
        setLoading(true);
        for (const crewmate of data) {
          await supabase
            .from('crewmates')
            .insert([{
              name: crewmate.name,
              role: crewmate.role,
              specialty: crewmate.specialty,
              experience: crewmate.experience
            }]);
        }
        await fetchCrewmates();
        showSnackbar('Data imported successfully', 'success');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      showSnackbar('Error importing data', 'error');
    }
  };
  // Filter and paginate crewmates
  const filteredCrewmates = crewmates.filter(crewmate => {
    return (
      crewmate.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.role === '' || crewmate.role === filters.role) &&
      (filters.specialty === '' || crewmate.specialty === filters.specialty) &&
      (filters.experience === '' || crewmate.experience === filters.experience)
    );
  });

  const paginatedCrewmates = filteredCrewmates.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading && crewmates.length === 0) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Crewmate Manager
        </Typography>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          centered
        >
          <Tab label="Crewmates" />
          <Tab label="Statistics" />
        </Tabs>
      </Paper>

      {tabValue === 0 ? (
        <>
          {/* Add/Edit Form */}
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {editingId ? 'Update Crewmate' : 'Add New Crewmate'}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Crewmate Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={formData.role}
                      label="Role"
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <MenuItem value="Engineer">Engineer</MenuItem>
                      <MenuItem value="Designer">Designer</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Specialty</InputLabel>
                    <Select
                      value={formData.specialty}
                      label="Specialty"
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    >
                      <MenuItem value="Frontend">Frontend</MenuItem>
                      <MenuItem value="Backend">Backend</MenuItem>
                      <MenuItem value="Full Stack">Full Stack</MenuItem>
                      <MenuItem value="UI/UX">UI/UX</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Experience</InputLabel>
                    <Select
                      value={formData.experience}
                      label="Experience"
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    >
                      <MenuItem value="Junior">Junior</MenuItem>
                      <MenuItem value="Mid-Level">Mid-Level</MenuItem>
                      <MenuItem value="Senior">Senior</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={editingId ? <EditIcon /> : <AddIcon />}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : editingId ? (
                      'Update Crewmate'
                    ) : (
                      'Add Crewmate'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {/* Search and Filters */}
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Search Crewmates"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={filters.role}
                    label="Role"
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Engineer">Engineer</MenuItem>
                    <MenuItem value="Designer">Designer</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Specialty</InputLabel>
                  <Select
                    value={filters.specialty}
                    label="Specialty"
                    onChange={(e) => handleFilterChange('specialty', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Frontend">Frontend</MenuItem>
                    <MenuItem value="Backend">Backend</MenuItem>
                    <MenuItem value="Full Stack">Full Stack</MenuItem>
                    <MenuItem value="UI/UX">UI/UX</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Experience</InputLabel>
                  <Select
                    value={filters.experience}
                    label="Experience"
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Junior">Junior</MenuItem>
                    <MenuItem value="Mid-Level">Mid-Level</MenuItem>
                    <MenuItem value="Senior">Senior</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Export/Import Buttons */}
          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={exportData}
            >
              Export Data
            </Button>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
            >
              Import Data
              <input
                type="file"
                hidden
                accept=".json"
                onChange={importData}
              />
            </Button>
          </Stack>

          {/* Crewmates Grid */}
          <Grid container spacing={3}>
            {paginatedCrewmates.map((crewmate) => (
              <Grid item xs={12} sm={6} md={4} key={crewmate.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      {crewmate.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Role:</strong> {crewmate.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Specialty:</strong> {crewmate.specialty}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Experience:</strong> {crewmate.experience}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => startEdit(crewmate)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => confirmDelete(crewmate.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {filteredCrewmates.length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(filteredCrewmates.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        // Statistics Tab
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Team Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Crewmates
                  </Typography>
                  <Typography variant="h4">
                    {crewmates.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Roles Distribution
                  </Typography>
                  {Object.entries(
                    crewmates.reduce((acc, curr) => {
                      acc[curr.role] = (acc[curr.role] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([role, count]) => (
                    <Typography key={role} variant="body2">
                      {role}: {count}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Experience Levels
                  </Typography>
                  {Object.entries(
                    crewmates.reduce((acc, curr) => {
                      acc[curr.experience] = (acc[curr.experience] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([exp, count]) => (
                    <Typography key={exp} variant="body2">
                      {exp}: {count}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Crewmate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this crewmate? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CrewmateManager;