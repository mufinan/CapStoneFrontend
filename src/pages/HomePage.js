import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';


function HomePage() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Yayıncılar',
      description: 'Yayınevleri ve yayıncıları buradan yönetebilirsiniz.',
      buttonText: 'Yayıncılar',
      path: '/publishers',
    },
    {
      title: 'Kategoriler',
      description: 'Kitapları kategorilere ayırabilir ve yönetebilirsiniz.',
      buttonText: 'Kategoriler',
      path: '/categories',
    },
    {
      title: 'Kitaplar',
      description: 'Kitapları ekleyebilir, düzenleyebilir ve silebilirsiniz.',
      buttonText: 'Kitaplar',
      path: '/books',
    },
    {
      title: 'Yazarlar',
      description: 'Yazarları ekleyebilir ve yönetebilirsiniz.',
      buttonText: 'Yazarlar',
      path: '/authors',
    },
    {
      title: 'Kitap Alma',
      description: 'Kitap alma işlemlerini yönetebilirsiniz.',
      buttonText: 'Kitap Alma',
      path: '/borrows',
    },
  ];

  return (
    <div>
      <Helmet>
        <title>Kütüphane Yönetim Sistemi - Ana Sayfa</title>
      </Helmet>
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
      <Typography variant="h3" gutterBottom sx={{ marginTop: 4, color: '#333' }}>
        Kütüphane Yönetim Sistemi
      </Typography>
      <Typography variant="subtitle1" sx={{ marginBottom: 4, color: '#555' }}>
        Tüm kitap, yazar ve kategori işlemlerini burada yapabilirsiniz.
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {sections.map((section, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                backgroundColor: '#b99873',
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ color: '#fff', marginBottom: 2 }}>
                  {section.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#f3f1eb', marginBottom: 3 }}
                >
                  {section.description}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate(section.path)}
                >
                  {section.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box
  sx={{
    position: 'fixed', // Alt kısma sabitlemek için
    bottom: 0, // Alt kenara yapıştır
    width: '100%', // Tam genişlik
    maxWidth: 1200, // Maksimum genişlik 1200px
    padding: 2,
    backgroundColor: '#6b4f4f',
    color: '#fff',
    textAlign: 'center',
    margin: '0 auto', // Ortalamak için
    left: 0, // Sol hizalama
    right: 0, // Sağ hizalama
  }}
  
>
  <Typography variant="body2">All Rights Reserved © 2024</Typography>
</Box>

    </Box>
    </div>
  );
}

export default HomePage;
