import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  Chip,
  
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarToday, Schedule, InfoOutlined, Videocam } from '@mui/icons-material';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  meetingPlatform: string;
  notes: string;
  privacy: boolean;
  date: Dayjs;
  time: Dayjs;
}

const SERVICES = [
  'Web Design',
  'Graphic Design',
  'Social Media Strategies',
  'ICT Technical Consultancy',
  'IT Equipment Sourcing',
];

const MEETING_PLATFORMS = [
  'Zoom',
  'Google Meet',
  'Microsoft Teams',
  'Phone Call',
  'In-Person',
  'Other (Specify in Notes)',
];

const VALIDATION_RULES = {
  name: { required: 'Full name is required' },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  },
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: /^\+?[1-9]\d{9,14}$/,
      message: 'Invalid phone number format (e.g. +1234567890)',
    },
  },
  service: { required: 'Please select a service' },
  meetingPlatform: { required: 'Please select preferred meeting method' },
  privacy: { required: 'You must accept the privacy policy' },
};

export default function BookExpertSession() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      meetingPlatform: 'Zoom',
      notes: '',
      privacy: false,
      date: dayjs().add(1, 'day'),
      time: dayjs().set('hour', 9).startOf('hour'),
    },
  });

  const selectedService = watch('service');

  const capitalizeName = useCallback((name: string) =>
    name.toLowerCase().split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '), []);

  const handleFormSubmit = (data: FormData) => {
    setBookingData(data);
    setShowConfirmation(true);
  };

  const confirmBooking = async () => {
    if (!bookingData) return;

    setShowConfirmation(false);
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          date: bookingData.date.format('YYYY-MM-DD'),
          time: bookingData.time.format('HH:mm:ss'),
          privacy: bookingData.privacy,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      reset();
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit booking. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" sx={{ py: 6, mt: { xs: 7, sm: 8 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center" mb={6}>
            <Chip
              label="Expert Session Booking"
              color="secondary"
              variant="outlined"
              sx={{ mb: 2 }}
              icon={<InfoOutlined />}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Schedule Your Consultation
            </Typography>
            <Typography color="text.secondary">
              Complete the form below to book your personalized expert session
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <FormControl fullWidth error={!!errors.service}>
              <InputLabel id="service-label">Consultation Service *</InputLabel>
              <Controller
                name="service"
                control={control}
                rules={VALIDATION_RULES.service}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="service-label"
                    label="Consultation Service *"
                    startAdornment={selectedService && (
                      <CalendarToday sx={{ mr: 1, color: 'action.active' }} />
                    )}
                  >
                    {SERVICES.map(service => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <Typography variant="body2" color="error" mt={1}>
                {errors.service?.message}
              </Typography>
            </FormControl>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
              <Box flex={1}>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: 'Date is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="Preferred Date *"
                      minDate={dayjs().add(1, 'day')}
                      disablePast
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Box>
              <Box flex={1}>
                <Controller
                  name="time"
                  control={control}
                  rules={{ required: 'Time is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <TimePicker
                      {...field}
                      label="Preferred Time *"
                      minutesStep={15}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Your Information
            </Typography>

            <Controller
              name="name"
              control={control}
              rules={VALIDATION_RULES.name}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name *"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  onChange={e => field.onChange(capitalizeName(e.target.value))}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={VALIDATION_RULES.email}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address *"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  type="email"
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              rules={VALIDATION_RULES.phone}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number *"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  type="tel"
                />
              )}
            />

            <FormControl fullWidth error={!!errors.meetingPlatform}>
              <InputLabel>Preferred Meeting Platform *</InputLabel>
              <Controller
                name="meetingPlatform"
                control={control}
                rules={VALIDATION_RULES.meetingPlatform}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Preferred Meeting Platform *"
                    startAdornment={<Videocam sx={{ mr: 1, color: 'action.active' }} />}
                  >
                    {MEETING_PLATFORMS.map(platform => (
                      <MenuItem key={platform} value={platform}>
                        {platform}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <Typography variant="body2" color="error" mt={1}>
                {errors.meetingPlatform?.message}
              </Typography>
            </FormControl>

            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Additional Details (optional)"
                  multiline
                  rows={4}
                  fullWidth
                  inputProps={{ maxLength: 500 }}
                  helperText="Include any special requirements or notes (max. 500 characters)"
                />
              )}
            />

            <FormControl error={!!errors.privacy} component="fieldset" sx={{ mt: 2 }}>
              <Controller
                name="privacy"
                control={control}
                rules={VALIDATION_RULES.privacy}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label={
                      <Typography variant="body2">
                        I agree to the{' '}
                        <Button
                          href="/privacy-policy"
                          target="_blank"
                          rel="noopener"
                          sx={{ p: 0, verticalAlign: 'baseline' }}
                        >
                          privacy policy
                        </Button>
                      </Typography>
                    }
                  />
                )}
              />
              <Typography variant="body2" color="error">
                {errors.privacy?.message}
              </Typography>
            </FormControl>

            <Box textAlign="center" mt={4}>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
                loadingPosition="end"
                endIcon={<Schedule />}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  minWidth: 200,
                }}
              >
                {isSubmitting ? 'Processing...' : 'Book Consultation'}
              </LoadingButton>
            </Box>
          </Box>

          {/* Confirmation Dialog */}
          <Dialog
            open={showConfirmation}
            onClose={() => !isSubmitting && setShowConfirmation(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Confirm Booking Details</DialogTitle>
            <DialogContent>
              <DialogContentText mb={2}>
                Please review your booking information:
              </DialogContentText>
              {bookingData && (
                <Stack spacing={2}>
                  <Box display="flex" flexWrap="wrap" gap={4}>
                    <Box flex="1 1 45%">
                      <Typography variant="subtitle2" color="text.secondary">
                        Service
                      </Typography>
                      <Typography>{bookingData.service}</Typography>
                    </Box>
                    <Box flex="1 1 45%">
                      <Typography variant="subtitle2" color="text.secondary">
                        Meeting Platform
                      </Typography>
                      <Typography>{bookingData.meetingPlatform}</Typography>
                    </Box>
                    <Box flex="1 1 45%">
                      <Typography variant="subtitle2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography>{bookingData.date.format('MMMM D, YYYY')}</Typography>
                    </Box>
                    <Box flex="1 1 45%">
                      <Typography variant="subtitle2" color="text.secondary">
                        Time
                      </Typography>
                      <Typography>{bookingData.time.format('h:mm A')}</Typography>
                    </Box>
                  </Box>
                </Stack>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowConfirmation(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <LoadingButton
                onClick={confirmBooking}
                variant="contained"
                loading={isSubmitting}
              >
                Confirm Booking
              </LoadingButton>
            </DialogActions>
          </Dialog>

          <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
            <Alert severity="success">
              Booking confirmed! A confirmation email with meeting details has been sent.
            </Alert>
          </Snackbar>

          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        </motion.div>
      </Container>
    </LocalizationProvider>
  );
}
