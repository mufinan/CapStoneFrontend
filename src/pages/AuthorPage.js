import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Notification from '../components/Notification';

function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState({ name: '', birthDate: '', country: '' });
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthors();
  },[]);

  // Bildirim mesajı gösterme
  const alertNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Tüm yazarları getir
  const fetchAuthors = async () => {
    try {
      const response = await api.get('/authors'); // Endpoint: GET /authors
      setAuthors(response.data);
    } catch (error) {
      alertNotification('Yazarlar yüklenirken bir hata oluştu.', 'error');
    }
  };

  // Yazar ekleme veya güncelleme
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Normal ekleme veya güncelleme işlemi
    try {
      if (selectedAuthor) {
        // Güncelleme işlemi
        await api.put(`/authors/${selectedAuthor.id}`, formData); // Endpoint: PUT /authors/{id}
        alertNotification('Yazar başarıyla güncellendi!', 'success');
      } else {
        // Yeni yazar ekleme işlemi
        await api.post('/authors', formData); // Endpoint: POST /authors
        alertNotification('Yazar başarıyla eklendi!', 'success');
      }
      fetchAuthors();
      setSelectedAuthor(null);
      setFormData({ name: '', birthDate: '', country: '' });
    } catch (error) {
      alertNotification('İşlem sırasında bir hata oluştu. Lütfen tekrar deneyiniz.', 'error');
    }
  };

  // Silme işlemi
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/authors/${deleteId}`); // Endpoint: DELETE /authors/{id}
      fetchAuthors();
      alertNotification('Yazar başarıyla silindi!', 'success');
    } catch (error) {
      alertNotification('Silme işlemi sırasında bir hata oluştu.', 'error');
    }
    setDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleEdit = (row) => {
    setSelectedAuthor(row);
    setFormData({
      name: row.name,
      birthDate: row.birthDate,
      country: row.country,
    });
  };

  const columns = [
    { field: 'name', headerName: 'Yazar Adı', width: 200 },
    { field: 'birthDate', headerName: 'Doğum Tarihi', width: 150 },
    { field: 'country', headerName: 'Ülke', width: 150 },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ marginRight: 1 }}
          >
            Düzenle
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            Sil
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 2,
        textAlign: 'center',
        backgroundColor: '#f9f5e7',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ marginTop: 4, color: '#333' }}>
        Yazarlar
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate('/')}
        sx={{ marginBottom: 2 }}
      >
        Ana Sayfa
      </Button>
      <Card
        sx={{
          marginBottom: 4,
          padding: 2,
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Yazar Ekle / Güncelle
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'grid', gap: 2 }}
          >
            <TextField
              label="Yazar Adı"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Doğum Tarihi"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Ülke"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              fullWidth
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                {selectedAuthor ? 'Güncelle' : 'Ekle'}
              </Button>
              {selectedAuthor && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setSelectedAuthor(null);
                    setFormData({ name: '', birthDate: '', country: '' });
                  }}
                >
                  İptal
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', marginBottom: 2 }}>
        Yazar Listesi:
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={authors} columns={columns} pageSize={5} />
      </div>
      <Notification
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
        severity={notification.severity}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
      >
        <DialogTitle>Yazar Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu yazarı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="secondary">
            İptal
          </Button>
          <Button onClick={confirmDelete} color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AuthorsPage;
