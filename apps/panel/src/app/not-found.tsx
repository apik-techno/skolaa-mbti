'use client';

import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          background: 'linear-gradient(to bottom, #000, transparent)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontSize: '10rem',
          fontWeight: 'bold',
          lineHeight: '1',
        }}
      >
        404
      </Typography>
      <Typography variant="h2" sx={{ my: 2, fontWeight: 'bold' }}>
        Something&apos;s missing
      </Typography>
      <Typography>
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
      </Typography>
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button onClick={handleGoBack} variant="contained" size="large">
          Go back
        </Button>
        <Button onClick={handleGoHome} variant="outlined" size="large">
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}
