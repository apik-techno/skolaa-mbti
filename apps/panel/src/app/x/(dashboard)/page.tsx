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
import { useEffect, useMemo, useState } from 'react'

import { trpc } from '@/server/client'

type FormData = {
  mainAnswer: string
  mainReason: string
  major: 'ipa' | 'ips'
  subAnswer: string
  subReason: string
  mbtiTestResult: string
  scores: { groupId: string; score: number; title: string }[]
}

type ScoreGroupDto = {
  id: string
  name: string
  type: 'IPA' | 'IPS' | 'GENERAL'
}

const initForm: FormData = {
  mainAnswer: '',
  mainReason: '',
  subAnswer: '',
  subReason: '',
  major: 'ipa',
  mbtiTestResult: '',
  scores: [],
}

const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

export default function Page() {
  const [showForm, setShowForm] = useState(false)
  const [showSubAnswer, setShowSubAnswer] = useState(false)
  const [formData, setFormData] = useState<FormData>(initForm)

  // Ambil score groups dari server (pastikan API mengembalikan field `type`)
  const { data: scoreGroupsData, isLoading: isLoadingScoreGroups } = trpc.scoreGroup.list.useQuery()
  const scoreGroups = (scoreGroupsData || []) as ScoreGroupDto[]

  // Hanya tampilkan GENERAL + major terpilih
  const filteredScoreGroups = useMemo(() => {
    const m = formData.major.toUpperCase(); // "IPA" | "IPS"
    return scoreGroups.filter((g: any) => {
      const t = (g?.type ?? 'GENERAL').toString().toUpperCase();
      return t === 'GENERAL' || t === m;
    });
  }, [scoreGroups, formData.major]);


  // Inisialisasi/merge scores saat daftar group berubah (nilai yang sudah diinput tetap disimpan)
  useEffect(() => {
    if (!scoreGroups || scoreGroups.length === 0) return;
    setFormData(prev => {
      const byId = new Map(prev.scores.map(s => [s.groupId, s]));
      const merged = scoreGroups.map(g => byId.get(g.id) ?? { groupId: g.id, score: 0, title: g.name });
      return { ...prev, scores: merged };
    });
  }, [scoreGroups]);


  // Handler untuk input score (clamp 0–100)
  const handleScoreChange = (groupId: string, value: number) => {
    const v = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0
    setFormData(prev => ({
      ...prev,
      scores: prev.scores.map(s => (s.groupId === groupId ? { ...s, score: v } : s)),
    }))
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
      window.location.reload()
    },
    onError: (error) => {
      setSubmitStatus('error')
      setErrorMessage(error.message)
    },
  })

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')

    const visibleIds = new Set(filteredScoreGroups.map(g => g.id))
    const scoresToSend = formData.scores
      .filter(s => visibleIds.has(s.groupId))
      .map(s => ({ groupId: s.groupId, score: Number(s.score), title: s.title }))
      .filter(s => Number.isFinite(s.score) && s.score >= 0)

    const dataToSend = {
      mainAnswer: formData.mainAnswer,
      mbtiTestResult: formData.mbtiTestResult,
      mainReason: formData.mainReason,
      ...(showSubAnswer && formData.subAnswer.trim() !== '' ? { subAnswer: formData.subAnswer } : {}),
      ...(showSubAnswer && formData.subReason.trim() !== '' ? { subReason: formData.subReason } : {}),
      scores: scoresToSend,          // FIX: was "scores"
      major: formData.major,         // kirim major jika backend memerlukan
    }

    answerMutation.mutate(dataToSend as any)
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
      setFormData(prev => ({ ...prev, subAnswer: '', subReason: '' }))
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

      {/* Latest answer */}
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

            {/* Preview skor */}
            {latestAnswer.scores && latestAnswer.scores.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Nilai Mata Pelajaran:
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {latestAnswer.scores.map((score: any) => (
                      <Box
                        key={score.groupId || score.group_id || score.id}
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <Typography>{score.group?.name || score.title || '-'}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight="bold">{score.value ?? score.score}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                {/* Grafik trainPercentage */}
                {latestAnswer.trainPercentage && Object.keys(latestAnswer.trainPercentage).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Grafik Presentase Nilai Mata Pelajaran
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {Object.entries(latestAnswer.trainPercentage).map(([name, percent]: [string, any]) => (
                          <Box key={name} sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2">{name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {percent}%
                              </Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.300', borderRadius: 2, mt: 0.5 }}>
                              <Box
                                sx={{ width: `${percent}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 2 }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                )}
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* AI Response */}
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

      {/* Form */}
      {(!hasLatestAnswer || showForm) && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h2">
                {hasLatestAnswer
                  ? 'Hasil Kecocokan Terakhir'
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
                  control={<Checkbox checked={showSubAnswer} onChange={(e) => handleSubAnswerToggle(e.target.checked)} />}
                  label="Tambahkan pilihan lainnya (opsional)"
                />

                <TextField
                  label="Jurusan (IPA/IPS)"
                  variant="outlined"
                  fullWidth
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value as 'ipa' | 'ips')}
                  select
                  required
                >
                  {['ipa', 'ips'].map((major) => (
                    <MenuItem key={major} value={major}>
                      {major.toUpperCase()}
                    </MenuItem>
                  ))}
                </TextField>

                {showSubAnswer && (
                  <TextField
                    label="Pilihan Lainnya"
                    variant="outlined"
                    fullWidth
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
                      {filteredScoreGroups.map(group => {
                        const current = formData.scores.find(s => s.groupId === group.id)
                        return (
                          <Box
                            key={group.id}
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                          >
                            <Typography>
                              {group.name}
                              <Typography component="span" variant="caption" sx={{ ml: 1, opacity: 0.6 }}>
                                ({group.type})
                              </Typography>
                            </Typography>
                            <TextField
                              type="number"
                              size="small"
                              sx={{ width: 100 }}
                              value={current?.score ?? ''}
                              onChange={(e) => handleScoreChange(group.id, Number(e.target.value))}
                              inputProps={{ min: 0, max: 100 }}
                            />
                          </Box>
                        )
                      })}
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

      {!hasLatestAnswer && !isLoadingLatest && latestAnswerError && (
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Tidak ada jawaban quiz sebelumnya. Silakan kirim jawaban quiz pertama Anda.
        </Typography>
      )}
    </Box>
  )
}
