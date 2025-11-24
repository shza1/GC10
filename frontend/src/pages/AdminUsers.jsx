import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8080';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/users/getUsers`, {
          headers: {
            'Accept': 'application/json',
          }
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (isMounted) setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        if (isMounted) setError(e.message || 'Unknown error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Admin: Users
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Paper elevation={1}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</TableCell>
                    <TableCell>{u.updated_at ? new Date(u.updated_at).toLocaleString() : ''}</TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
