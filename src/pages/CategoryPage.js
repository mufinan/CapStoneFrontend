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

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  },[]);

  // Bildirim mesajı gösterme
  const alertNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Tüm kategorileri getir
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories'); // Endpoint: GET /categories
      setCategories(response.data);
    } catch (error) {
      alertNotification('Kategoriler yüklenirken bir hata oluştu.', 'error');
    }
  };

  // Kategori ekleme veya güncelleme
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Kullanıcı sadece açıklama güncellemeye çalışıyorsa
    if (
      selectedCategory &&
      formData.name === selectedCategory.name && // Kategori adı değişmemiş
      formData.description !== selectedCategory.description // Sadece açıklama değişmiş
    ) {
      alertNotification(
        "Güncelleme işlemi sadece kategori adı ve açıklama birlikte güncellenebilir. Sadece açıklama değişikliği için kategoriyi silip yeniden ekleyiniz.",
        "error"
      );
      return;
    }

    // Normal ekleme veya güncelleme işlemi
    try {
      if (selectedCategory) {
        // Güncelleme işlemi
        await api.put(`/categories/${selectedCategory.id}`, formData);
        alertNotification("Kategori başarıyla güncellendi!", "success");
      } else {
        // Yeni kategori ekleme işlemi
        await api.post('/categories', formData);
        alertNotification("Kategori başarıyla eklendi!", "success");
      }
      fetchCategories(); // Listeyi güncelle
      setSelectedCategory(null); // Güncelleme modundan çık
      setFormData({ name: '', description: '' }); // Formu sıfırla
    } catch (error) {
      alertNotification("İşlem sırasında bir hata oluştu. Lütfen tekrar deneyiniz.", "error");
    }
  };

  // Silme işlemi
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/categories/${deleteId}`); // Endpoint: DELETE /categories/{id}
      fetchCategories();
      alertNotification('Kategori başarıyla silindi!', 'success');
    } catch (error) {
      alertNotification('Silme işlemi sırasında bir hata oluştu.', 'error');
    }
    setDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  // Formu düzenleme için doldur
  const handleEdit = (row) => {
    setSelectedCategory(row);
    setFormData({ name: row.name, description: row.description });
  };

  // DataGrid kolonları
  const columns = [
    { field: 'name', headerName: 'Kategori Adı', width: 200 },
    { field: 'description', headerName: 'Açıklama', width: 700 },
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
        Kategoriler
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
            Kategori Ekle / Güncelle
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'grid', gap: 2 }}
          >
            <TextField
              label="Kategori Adı"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Açıklama"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                {selectedCategory ? 'Güncelle' : 'Ekle'}
              </Button>
              {selectedCategory && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setSelectedCategory(null);
                    setFormData({ name: '', description: '' });
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
        Kategori Listesi:
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={categories} columns={columns} pageSize={5} />
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
        <DialogTitle>Kategori Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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

export default CategoryPage;
