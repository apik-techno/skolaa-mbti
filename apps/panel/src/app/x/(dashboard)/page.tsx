'use client'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'

import { trpc } from '@/server/client'

type FormData = {
  mainAnswer: string
  mainReason: string
  subAnswer: string
  subReason: string
  mbtiTestResult: string
  scores: { groupId: string; score: number; title: string }[]
}
const initForm: FormData = {
  mainAnswer: '',
  mainReason: '',
  subAnswer: '',
  subReason: '',
  mbtiTestResult: '',
  scores: [],
}
const mbtiTypes = [
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'ESFP',
]
export default function Page() {
  const [showForm, setShowForm] = useState(false)
  const [showSubAnswer, setShowSubAnswer] = useState(false)
  const [formData, setFormData] = useState<FormData>(initForm)

  // Ambil score groups
  const { data: scoreGroupsData, isLoading: isLoadingScoreGroups } = trpc.scoreGroup.list.useQuery()
  const scoreGroups = scoreGroupsData || []

  // Inisialisasi scores jika scoreGroups berubah
  useEffect(() => {
    if (scoreGroups.length > 0 && formData.scores.length === 0) {
      setFormData((prev) => ({
        ...prev,
        scores: scoreGroups.map((g) => ({ groupId: g.id, score: 0, title: g.name })),
      }))
    }
    // eslint-disable-next-line
  }, [scoreGroups])

  // Handler untuk input score
  const handleScoreChange = (groupId: string, value: number) => {
    setFormData((prev) => {
      const updatedScores = prev.scores.map((s) => (s.groupId === groupId ? { ...s, score: value } : s))
      return {
        ...prev,
        scores: updatedScores,
      }
    })
  }

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Get latest answer
  const {
    data: latestAnswerData,
    isLoading: isLoadingLatest,
    error: latestAnswerError,
  } = trpc.quiz.latestAnswer.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  })

  const answerMutation = trpc.quiz.makeAnswer.useMutation({
    onSuccess: () => {
      setSubmitStatus('success')
      setShowForm(false)
      setFormData(initForm)
      setShowSubAnswer(false)
      // Refetch latest answer
      window.location.reload()
    },
    onError: (error) => {
      setSubmitStatus('error')
      setErrorMessage(error.message)
    },
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')

    // Prepare scores as number
    const scoresToSend = formData.scores
      .map((s) => ({ groupId: s.groupId, score: Number(s.score), title: s.title }))
      .filter((s) => s.score >= 0)
    const dataToSend = {
      mainAnswer: formData.mainAnswer,
      mbtiTestResult: formData.mbtiTestResult,
      mainReason: formData.mainReason,
      ...(showSubAnswer && formData.subAnswer.trim() !== '' ? { subAnswer: formData.subAnswer } : {}),
      ...(showSubAnswer && formData.subReason.trim() !== '' ? { subReason: formData.subReason } : {}),
      scroes: scoresToSend,
    }

    answerMutation.mutate(dataToSend)
  }

  const handleShowForm = () => {
    setShowForm(true)
    setSubmitStatus('idle')
    setErrorMessage('')
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setShowSubAnswer(false)
    setFormData(initForm)
    setSubmitStatus('idle')
    setErrorMessage('')
  }

  const handleSubAnswerToggle = (checked: boolean) => {
    setShowSubAnswer(checked)
    if (!checked) {
      setFormData((prev) => ({
        ...prev,
        subAnswer: '',
      }))
    }
  }

  const isFormValid =
    formData.mainAnswer.trim() !== '' &&
    formData.mbtiTestResult !== '' &&
    (!showSubAnswer || formData.subAnswer.trim() !== '')

  const hasLatestAnswer = latestAnswerData?.result && !latestAnswerError
  const latestAnswer = latestAnswerData?.result

  if (isLoadingLatest) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Memuat...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        {hasLatestAnswer ? 'Hasil Kecocokan Terakhir' : 'Rekomendasi Karir Berdasarkan Pilihan Anda'}
      </Typography>
      {submitStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Jawaban berhasil disimpan!
        </Alert>
      )}
      {submitStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage || 'Terjadi kesalahan saat menyimpan jawaban Anda.'}
        </Alert>
      )}
      {/* Show latest answer if exists */}
      {hasLatestAnswer && latestAnswer && !showForm && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="h2" color="primary">
                Hasil Kecocokan Terakhir
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(latestAnswer.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Pilihan Utama:
              </Typography>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                <Typography variant="body2">{latestAnswer.mainAnswer}</Typography>
              </Paper>
              {latestAnswer.subAnswer && latestAnswer.subAnswer.trim() !== '' && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Pilihan Lainnya:
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                    <Typography variant="body2">{latestAnswer.subAnswer}</Typography>
                  </Paper>
                </>
              )}

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Hasil Tes MBTI:
              </Typography>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                <Typography variant="body2" fontWeight="medium">
                  {latestAnswer.mbtiTestResult}
                </Typography>
              </Paper>
            </Box>

            {/* Tambahkan preview skor */}
            {latestAnswer.scores && latestAnswer.scores.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Nilai Mata Pelajaran:
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {latestAnswer.scores.map((score: any) => (
                      <Box
                        key={score.groupId || score.group_id || score.id}
                        sx={{ display: 'flex', justifyContent: 'space-between' }}
                      >
                        <Typography>{score.group?.name || score.title || '-'}</Typography>
                        <Typography fontWeight="bold">{score.value ?? score.score}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* AI Response Section */}
            <Typography variant="h6" component="h3" color="secondary" gutterBottom>
              Rekomendasi
            </Typography>

            {latestAnswer.aiResult && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Rekomendasi Karir:
                </Typography>
                <Paper elevation={1} sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="body1" fontWeight="medium">
                    {latestAnswer.aiResult}
                  </Typography>
                </Paper>
              </Box>
            )}

            {latestAnswer.aiRecommendation && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Rekomendasi Detail:
                </Typography>
                <Paper elevation={1} sx={{ p: 3, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                  <Typography variant="body1">{latestAnswer.aiRecommendation}</Typography>
                </Paper>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="contained" color="primary" size="large" onClick={handleShowForm} sx={{ px: 4 }}>
                Ajukan Lagi
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Show form when no latest answer or when "Ajukan Lagi" is clicked */}
      {(!hasLatestAnswer || showForm) && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h2">
                {hasLatestAnswer
                  ? 'Hasil Kecocokan Terkahir'
                  : 'Kira-kira apa yang ingin kamu lakukan setelah lulus dari SMA ? Kuliah, Bekerja, Wirausaha apa gimana ?'}
              </Typography>
              {hasLatestAnswer && showForm && (
                <Button variant="outlined" onClick={handleCancelForm}>
                  Batal
                </Button>
              )}
            </Box>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Pilihan Utama"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.mainAnswer}
                  onChange={(e) => handleInputChange('mainAnswer', e.target.value)}
                  required
                  placeholder="Masukkan pilihan utama Anda di sini..."
                />

                <TextField
                  label="Alasan"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.mainReason}
                  onChange={(e) => handleInputChange('mainReason', e.target.value)}
                  required
                  placeholder="Masukkan alasan pilihan utama Anda di sini..."
                />

                <FormControlLabel
                  control={
                    <Checkbox checked={showSubAnswer} onChange={(e) => handleSubAnswerToggle(e.target.checked)} />
                  }
                  label="Tambahkan pilihan lainnya (opsional)"
                />

                {showSubAnswer && (
                  <TextField
                    label="Pilihan Lainnya"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.subAnswer}
                    onChange={(e) => handleInputChange('subAnswer', e.target.value)}
                    placeholder="Masukkan pilihan lainnya Anda di sini..."
                  />
                )}
                {showSubAnswer && (
                  <TextField
                    label="Alasan Pilihan Lainnya"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.subReason}
                    onChange={(e) => handleInputChange('subReason', e.target.value)}
                    placeholder="Masukkan alasan pilihan lainnya Anda di sini..."
                  />
                )}
                <Divider sx={{ my: 2 }} />
                {/* Input Scores */}
                <Box className="w-full">
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Masukkan Nilai Scores
                  </Typography>
                  {isLoadingScoreGroups ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {scoreGroups.map((group, idx) => (
                        <Box
                          key={group.id}
                          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                        >
                          <Typography>{group.name}</Typography>
                          <TextField
                            type="number"
                            size="small"
                            sx={{ width: 100 }}
                            value={formData.scores[idx]?.score || ''}
                            onChange={(e) => handleScoreChange(group.id, Number(e.target.value))}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                <Divider sx={{ my: 2 }} />
                <FormControl fullWidth required>
                  <InputLabel>Hasil Tes MBTI</InputLabel>
                  <Select
                    value={formData.mbtiTestResult}
                    label="Hasil Tes MBTI"
                    onChange={(e) => handleInputChange('mbtiTestResult', e.target.value)}
                  >
                    {mbtiTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!isFormValid || answerMutation.isPending}
                  sx={{ mt: 2 }}
                >
                  {answerMutation.isPending ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Jawaban'
                  )}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Show message when no latest answer exists */}
      {!hasLatestAnswer && !isLoadingLatest && latestAnswerError && (
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Tidak ada jawaban quiz sebelumnya. Silakan kirim jawaban quiz pertama Anda.
        </Typography>
      )}
    </Box>
  )
}
