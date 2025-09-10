import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', rollNumber: '', contactNumber: '', bloodGroup: '', email: '', address: '' });
  const [editId, setEditId] = useState(null);
  const [adminDialog, setAdminDialog] = useState({ open: false, action: '', studentId: null });
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/api/students');
    setStudents(res.data);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleOpen = (student = null) => {
    if (student) {
      setForm(student);
      setEditId(student._id);
    } else {
      setForm({ name: '', rollNumber: '', contactNumber: '', bloodGroup: '', email: '', address: '' });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editId) {
      // Prompt for admin password before update
      setAdminDialog({ open: true, action: 'update', studentId: editId });
    } else {
      await axios.post('http://localhost:5000/api/students', form);
      fetchStudents();
      handleClose();
    }
  };

  const handleDelete = (id) => {
    // Prompt for admin password before delete
    setAdminDialog({ open: true, action: 'delete', studentId: id });
  };

  const handleAdminAction = async () => {
    if (adminDialog.action === 'update') {
      await axios.put(`http://localhost:5000/api/students/${adminDialog.studentId}`, { ...form, adminPassword });
    } else if (adminDialog.action === 'delete') {
      await axios.delete(`http://localhost:5000/api/students/${adminDialog.studentId}`, { data: { adminPassword } });
    }
    setAdminDialog({ open: false, action: '', studentId: null });
    setAdminPassword('');
    fetchStudents();
    handleClose();
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#a3abb0ff', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          VCTM STUDENTS DIRECTORY
        </Typography>
        <TextField label="Search by Name" variant="outlined" fullWidth margin="normal" value={search} onChange={handleSearch} sx={{ background: '#fff', borderRadius: 2 }} />
        <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2, fontWeight: 'bold' }}>Add Student</Button>
        <Paper elevation={2} sx={{ borderRadius: 2, p: 2, background: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', background: '#e3f2fd' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', background: '#e3f2fd' }}>Roll Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', background: '#e3f2fd' }}>Contact Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', background: '#e3f2fd' }}>Blood Group</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', background: '#e3f2fd' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', background: '#e3f2fd' }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', background: '#e3f2fd' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map(student => (
                <TableRow key={student._id} sx={{ background: '#fafafa' }}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.contactNumber}</TableCell>
                  <TableCell>{student.bloodGroup}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.address}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" color="primary" onClick={() => handleOpen(student)} sx={{ mr: 1 }}>Edit</Button>
                    <Button size="small" color="error" variant="contained" onClick={() => handleDelete(student._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ background: '#e3f2fd', color: '#1976d2', fontWeight: 'bold' }}>{editId ? 'Edit Student' : 'Add Student'}</DialogTitle>
          <DialogContent sx={{ background: '#fff' }}>
            <TextField margin="dense" label="Name" name="name" fullWidth value={form.name} onChange={handleChange} sx={{ background: '#f5f5f5', borderRadius: 2 }} />
            <TextField margin="dense" label="Roll Number" name="rollNumber" fullWidth value={form.rollNumber} onChange={handleChange} sx={{ background: '#f5f5f5', borderRadius: 2 }} />
            <TextField margin="dense" label="Contact Number" name="contactNumber" fullWidth value={form.contactNumber} onChange={handleChange} sx={{ background: '#f5f5f5', borderRadius: 2 }} />
            <TextField margin="dense" label="Blood Group" name="bloodGroup" fullWidth value={form.bloodGroup} onChange={handleChange} sx={{ background: '#f5f5f5', borderRadius: 2 }} />
            <TextField margin="dense" label="Email" name="email" fullWidth value={form.email} onChange={handleChange} sx={{ background: '#f5f5f5', borderRadius: 2 }} />
            <TextField margin="dense" label="Address" name="address" fullWidth value={form.address} onChange={handleChange} sx={{ background: '#f5f5f5', borderRadius: 2 }} />
          </DialogContent>
          <DialogActions sx={{ background: '#fff' }}>
            <Button onClick={handleClose} sx={{ fontWeight: 'bold', color: '#1976d2' }}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">{editId ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
        {/* Admin password dialog for update/delete */}
        <Dialog open={adminDialog.open} onClose={() => setAdminDialog({ open: false, action: '', studentId: null })}>
          <DialogTitle sx={{ background: '#e3f2fd', color: '#1976d2', fontWeight: 'bold' }}>Admin Authentication</DialogTitle>
          <DialogContent sx={{ background: '#fff' }}>
            <Typography gutterBottom>Enter admin password to {adminDialog.action} student details:</Typography>
            <TextField margin="dense" label="Admin Password" type="password" fullWidth value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
          </DialogContent>
          <DialogActions sx={{ background: '#fff' }}>
            <Button onClick={() => setAdminDialog({ open: false, action: '', studentId: null })} sx={{ fontWeight: 'bold', color: '#1976d2' }}>Cancel</Button>
            <Button onClick={handleAdminAction} variant="contained" color="primary">Confirm</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default App;
