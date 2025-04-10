
import { Box, Typography, Paper, Container } from '@mui/material';
import {
  DesignServices,
  Palette,
  InsertPhoto
} from '@mui/icons-material';

const Services = () => {
  const services = [
    {
      title: 'Logo & Brand Identity',
      description: 'Crafting timeless logos and cohesive brand visuals.',
      icon: <DesignServices fontSize="large" color="primary" />,
    },
    {
      title: 'Print & Digital Design',
      description: 'Beautiful layouts ready for both print and screen.',
      icon: <InsertPhoto fontSize="large" color="primary" />,
    },
    {
      title: 'Creative Direction',
      description: 'Visual storytelling and design strategy.',
      icon: <Palette fontSize="large" color="primary" />,
    },
  ];

  return (
    <Box
      id="services"
      sx={{
        py: 10,
        backgroundColor: '#f4f6f8',
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Services
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              backgroundColor: 'primary.main',
              margin: '0 auto',
              mb: 2,
            }}
          />
          <Typography variant="body1" color="text.secondary">
            Simplifying your brand's story through design.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            gap: 4,
            flexWrap: 'wrap',
          }}
        >
          {services.map((service, index) => (
            <Paper
              key={index}
              elevation={4}
              sx={{
                flex: { xs: '1 1 100%', md: '1 1 30%' },
                maxWidth: { md: 350 },
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box mb={2}>{service.icon}</Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {service.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {service.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Services;