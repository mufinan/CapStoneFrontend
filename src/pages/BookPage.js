import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Notification from '../components/Notification';

function BookPage() {
  const [books, setBooks] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    publicationYear: '',
    stock: '',
    author: '',
    publisher: '',
    categories: [],
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Silme işlemi için gerekli state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const navigate = useNavigate();

   // Bildirim mesajı gösterme
   const alertNotification = useCallback((message, severity) => {
    setNotification({ open: true, message, severity });
  }, []);

  // Tüm kitapları getir
  const fetchBooks = useCallback(async () => {
    try {
      const response = await api.get('/books'); // Endpoint: GET /books
      setBooks(response.data);
      if (response.data.length === 0) {
        alertNotification('Veritabanında kayıtlı kitap bulunmamaktadır. Lütfen kitap ekleyiniz.', 'warning');
      }
    } catch (error) {
      alertNotification('Kitaplar yüklenirken bir hata oluştu.', 'error');
    }
  }, [alertNotification]);

  // Tüm yayıncıları getir
  const fetchPublishers = useCallback(async () => {
    try {
      const response = await api.get('/publishers');
      setPublishers(response.data);
    } catch (error) {
      alertNotification('Yayıncılar yüklenirken bir hata oluştu.', 'error');
    }
  }, [alertNotification]);

  // Tüm kategorileri getir
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories'); // Endpoint: GET /categories
      setCategories(response.data);
    } catch (error) {
      alertNotification('Kategoriler yüklenirken bir hata oluştu.', 'error');
    }
  }, [alertNotification]);

    // Tüm yazarları getir
    const fetchAuthors = useCallback(async () => {
      try {
        const response = await api.get('/authors'); // Endpoint: GET /authors
        setAuthors(response.data);
      } catch (error) {
        alertNotification('Yazarlar yüklenirken bir hata oluştu.', 'error');
      }
    }, [alertNotification]);

  useEffect(() => {
    fetchBooks();
    fetchPublishers();
    fetchCategories();
    fetchAuthors();
  },[fetchBooks,fetchPublishers,fetchCategories,fetchAuthors]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.publicationYear || !formData.stock || !formData.author || !formData.publisher || formData.categories.length === 0) {
      alertNotification('Tüm alanları doldurmanız ve en az bir kategori seçmeniz gerekmektedir.', 'error');
      return;
    }

    const payload = {
      name: formData.name,
      publicationYear: parseInt(formData.publicationYear, 10),
      stock: parseInt(formData.stock, 10),
      author: authors.find((author) => author.id === formData.author),
      publisher: publishers.find((publisher) => publisher.id === formData.publisher),
      categories: formData.categories,
    };

    try {
      if (selectedBook) {
        await api.put(`/books/${selectedBook.id}`, payload);
        alertNotification('Kitap başarıyla güncellendi!', 'success');
      } else {
        await api.post('/books', payload);
        alertNotification('Kitap başarıyla eklendi!', 'success');
      }
      fetchBooks();
      setFormData({ name: '', publicationYear: '', stock: '', author: '', publisher: '', categories: [] });
      setSelectedBook(null);
    } catch (error) {
      alertNotification('İşlem sırasında bir hata oluştu. Lütfen tekrar deneyiniz.', 'error');
    }
  };

  const handleDeleteConfirmation = (row) => {
    setBookToDelete(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/books/${bookToDelete.id}`);
      alertNotification('Kitap başarıyla silindi!', 'success');
      fetchBooks();
    } catch (error) {
      alertNotification('Silme işlemi sırasında bir hata oluştu.', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleEdit = (row) => {
    setSelectedBook(row);
    setFormData({
      name: row.name,
      publicationYear: row.publicationYear,
      stock: row.stock,
      author: row.author?.id,
      publisher: row.publisher?.id,
      categories: row.categories,
    });
  };

  const columns = [
    { field: 'name', headerName: 'Kitap Adı', width: 200 },
    { field: 'publicationYear', headerName: 'Yayın Yılı', width: 100 },
    { field: 'stock', headerName: 'Stok', width: 70 },
    {
      field: 'author',
      headerName: 'Yazar',
      width: 150,
      valueGetter: (params) => params.name,
    },
    {
      field: 'publisher',
      headerName: 'Yayınevi',
      width: 200,
      valueGetter: (params) => params.name,
    },
    {
      field: 'categories',
      headerName: 'Kategoriler',
      width: 200,
      valueGetter: (params) => params.map((cat) => cat.name).join(', '),
    },
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
            onClick={() => handleDeleteConfirmation(params.row)}
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
        Kitaplar
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
            Kitap Ekle / Güncelle
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'grid', gap: 2 }}
          >
            <TextField
              label="Kitap Adı"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Yayın Yılı"
              type="number"
              value={formData.publicationYear}
              onChange={(e) =>
                setFormData({ ...formData, publicationYear: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Stok"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Yazar</InputLabel>
              <Select
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              >
                {authors.map((author) => (
                  <MenuItem key={author.id} value={author.id}>
                    {author.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Yayınevi</InputLabel>
              <Select
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              >
                {publishers.map((publisher) => (
                  <MenuItem key={publisher.id} value={publisher.id}>
                    {publisher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Autocomplete
              multiple
              options={categories}
              getOptionLabel={(option) => option.name}
              value={formData.categories}
              onChange={(event, newValue) => setFormData({ ...formData, categories: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="Kategoriler" placeholder="Kategori seçiniz" />
              )}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                {selectedBook ? 'Güncelle' : 'Ekle'}
              </Button>
              {selectedBook && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setSelectedBook(null);
                    setFormData({ name: '', publicationYear: '', stock: '', author: '', publisher: '', categories: [] });
                  }}
                >
                  İptal
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={books} columns={columns} pageSize={5} />
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
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu kitabı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
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

export default BookPage;
