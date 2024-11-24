import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

function BorrowPage() {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerMail: '',
    borrowingDate: '',
    returnDate: '', // Opsiyonel alan
    bookId: '',
  });
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [borrowToDelete, setBorrowToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrows();
    fetchBooks();
  },[]);

  const alertNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const fetchBorrows = async () => {
    try {
      const response = await api.get('/borrows');
      setBorrows(response.data);
    } catch (error) {
      alertNotification('Ödünç alınan kitaplar yüklenirken bir hata oluştu.', 'error');
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
      if (response.data.length === 0) {
        alertNotification('Veritabanında kayıtlı kitap bulunmamaktadır. Lütfen kitap ekleyiniz.', 'warning');
      }
    } catch (error) {
      alertNotification('Kitaplar yüklenirken bir hata oluştu.', 'error');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Zorunlu alan kontrolü
    if (!formData.borrowerName || !formData.borrowerMail || !formData.borrowingDate || !formData.bookId) {
      alertNotification('Tüm zorunlu alanları doldurmanız gerekmektedir.', 'error');
      return;
    }
  
    // Tarih kontrolü (sadece düzenleme modunda yapılır)
    if (selectedBorrow && formData.returnDate && formData.returnDate < formData.borrowingDate) {
      alertNotification(
        'İade tarihi, ödünç alma tarihinden eski olamaz. Lütfen tarihleri kontrol ediniz.',
        'error'
      );
      return;
    }
  
    const selectedBook = books.find((book) => book.id === formData.bookId);
  
    // Payload oluşturulması
    const payload = {
      borrowerName: formData.borrowerName,
      borrowerMail: formData.borrowerMail,
      borrowingDate: formData.borrowingDate,
      ...(formData.returnDate && { returnDate: formData.returnDate }), // Opsiyonel iade tarihi
      bookForBorrowingRequest: {
        id: selectedBook.id,
        name: selectedBook.name,
        publicationYear: selectedBook.publicationYear,
        stock: selectedBook.stock,
      },
    };
  
    try {
      if (selectedBorrow) {
        // Güncelleme
        await api.put(`/borrows/${selectedBorrow.id}`, payload);
        alertNotification('Kayıt başarıyla güncellendi!', 'success');
      } else {
        // Yeni kayıt ekleme
        await api.post('/borrows', payload);
        alertNotification('Kayıt başarıyla eklendi!', 'success');
      }
      fetchBorrows();
      setFormData({ borrowerName: '', borrowerMail: '', borrowingDate: '', returnDate: '', bookId: '' });
      setSelectedBorrow(null);
    } catch (error) {
      alertNotification('İşlem sırasında bir hata oluştu. Lütfen tekrar deneyiniz.', 'error');
    }
  };  

  const handleDeleteConfirmation = (row) => {
    // İade tarihi kontrolü
    if (!row.returnDate) {
      alertNotification(
        'Silme işlemi yapılamaz. Lütfen önce düzenleme yaparak iade tarihi ekleyiniz.',
        'error'
      );
      return;
    }
  
    // Silme işlemi devam eder
    setBorrowToDelete(row);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      await api.delete(`/borrows/${borrowToDelete.id}`);
      alertNotification('Kayıt başarıyla silindi!', 'success');
      fetchBorrows();
    } catch (error) {
      alertNotification('Silme işlemi sırasında bir hata oluştu.', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setBorrowToDelete(null);
    }
  };
  

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setBorrowToDelete(null);
  };

  const handleEdit = (row) => {
    setSelectedBorrow(row);
    setFormData({
      borrowerName: row.borrowerName,
      borrowerMail: row.borrowerMail,
      borrowingDate: row.borrowingDate,
      returnDate: row.returnDate || '',
      bookId: row.book.id,
    });
  };

  const columns = [
    {
      field: 'book',
      headerName: 'Kitap',
      width: 200,
      valueGetter: (params) => params.name,
    },
    { field: 'borrowerName', headerName: 'Ödünç Alan', width: 200 },
    { field: 'borrowerMail', headerName: 'E-Posta', width: 300 },
    { field: 'borrowingDate', headerName: 'Ödünç Tarihi', width: 150 },
    { field: 'returnDate', headerName: 'İade Tarihi', width: 150 },
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
        Ödünç Alınan Kitaplar
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
            Kitap Ödünç Al / Güncelle
          </Typography>
          <Box
  component="form"
  onSubmit={handleSubmit}
  sx={{ display: 'grid', gap: 2 }}
>
<FormControl fullWidth>
  <InputLabel>Kitap</InputLabel>
  <Select
    value={formData.bookId}
    onChange={(e) => {
      if (selectedBorrow) {
        alertNotification(
          "Kitap adı değiştirilemez. Kitap adını değiştirmek istiyorsanız, lütfen kaydı silin ve yeniden oluşturun.",
          "warning"
        );
      } else {
        setFormData({ ...formData, bookId: e.target.value });
      }
    }}
  >
    {books.map((book) => (
      <MenuItem key={book.id} value={book.id}>
        {book.name} (Stok: {book.stock})
      </MenuItem>
    ))}
  </Select>
</FormControl>

  <TextField
    label="Ödünç Alan"
    value={formData.borrowerName}
    onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
    fullWidth
    required
  />
  <TextField
    label="E-Posta"
    value={formData.borrowerMail}
    onChange={(e) => setFormData({ ...formData, borrowerMail: e.target.value })}
    fullWidth
    required
  />
  <TextField
    label="Ödünç Tarihi"
    type="date"
    value={formData.borrowingDate}
    onChange={(e) => setFormData({ ...formData, borrowingDate: e.target.value })}
    fullWidth
    InputLabelProps={{ shrink: true }}
    required
  />
  
  {/* Sadece düzenleme modunda iade tarihi alanını göster */}
  {selectedBorrow && (
    <TextField
      label="İade Tarihi"
      type="date"
      value={formData.returnDate}
      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
      fullWidth
      InputLabelProps={{ shrink: true }}
    />
  )}

  <Box sx={{ display: 'flex', gap: 2 }}>
    <Button type="submit" variant="contained" color="primary">
      {selectedBorrow ? 'Güncelle' : 'Ekle'}
    </Button>
    {selectedBorrow && (
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          setSelectedBorrow(null);
          setFormData({ borrowerName: '', borrowerMail: '', borrowingDate: '', returnDate: '', bookId: '' });
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
        <DataGrid rows={borrows} columns={columns} pageSize={5} />
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
            Bu ödünç alma kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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

export default BorrowPage;
