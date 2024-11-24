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

function PublisherPage() {
  const [publishers, setPublishers] = useState([]);
  const [formData, setFormData] = useState({ name: '', establishmentYear: '', address: '' });
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublishers();
  },[]);

  const alertNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const fetchPublishers = async () => {
    try {
      const response = await api.get('/publishers');
      setPublishers(response.data);
    } catch (error) {
      alertNotification("Yayıncılar yüklenirken bir hata oluştu.", "error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      selectedPublisher &&
      formData.name === selectedPublisher.name &&
      formData.establishmentYear === selectedPublisher.establishmentYear &&
      formData.address !== selectedPublisher.address
    ) {
      alertNotification(
        "Güncelleme işleminde sadece yayıncı adı ve kuruluş yılı güncellenebilir.",
        "error"
      );
      return;
    }

    try {
      if (selectedPublisher) {
        await api.put(`/publishers/${selectedPublisher.id}`, formData);
      } else {
        await api.post('/publishers', formData);
      }
      fetchPublishers();
      setSelectedPublisher(null);
      setFormData({ name: '', establishmentYear: '', address: '' });
      alertNotification("İşlem başarıyla gerçekleştirildi!", "success");
    } catch (error) {
      alertNotification("İşlem sırasında bir hata oluştu.", "error");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/publishers/${deleteId}`);
      fetchPublishers();
      alertNotification("Yayıncı başarıyla silindi!", "success");
    } catch (error) {
      alertNotification("Silme işlemi sırasında bir hata oluştu.", "error");
    }
    setDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleEdit = (row) => {
    setSelectedPublisher(row);
    setFormData({
      name: row.name,
      establishmentYear: row.establishmentYear,
      address: row.address,
    });
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'establishmentYear', headerName: 'Year', width: 100 },
    { field: 'address', headerName: 'Address', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
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
        Yayıncılar
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
            Yayıncı Ekle / Güncelle
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'grid', gap: 2 }}
          >
            <TextField
              label="Yayıncı Adı"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Kuruluş Yılı"
              value={formData.establishmentYear}
              onChange={(e) =>
                setFormData({ ...formData, establishmentYear: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Adres"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                {selectedPublisher ? 'Güncelle' : 'Ekle'}
              </Button>
              {selectedPublisher && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setSelectedPublisher(null);
                    setFormData({ name: '', establishmentYear: '', address: '' });
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
        Yayıncı Listesi:
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={publishers} columns={columns} pageSize={5} />
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
        <DialogTitle>Yayıncı Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu yayımcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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

export default PublisherPage;
