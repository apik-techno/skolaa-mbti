'use client'

import TableHeader from '@/components/TableHeader'
import IconifyIcon from '@/core/icon'
import { trpc } from '@/server/client'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2,
  Typography,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import React from 'react'

const initialPage = { page: 0, pageSize: 10, search: '' }

// Define type for Answer row
type Score = {
  id: string
  value: number
  group?: { name: string }
  groupId?: string
  title?: string
}
type AnswerRow = {
  id: string
  mainAnswer: string
  mainReason: string
  subAnswer: string
  subReason: string
  mbtiTestResult: string
  aiResult: string | null
  aiRecommendation: string | null
  createdAt: string
  user: {
    id: string
    name: string
    identity: string
  }
  scores?: Score[]
}

// Detail Modal Component
const DetailModal = ({ open, onClose, data }: { open: boolean; onClose: () => void; data: AnswerRow | null }) => {
  if (!data) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Detail Jawaban Quiz</Typography>
          <Button onClick={onClose} size="small" color="inherit">
            <IconifyIcon icon="ph:x" />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid2 container spacing={3}>
          {/* User Info */}
          <Grid2 size={{ xs: 12 }}>
            <Card variant="outlined">
              <Box p={2}>
                <Typography variant="subtitle1" gutterBottom color="primary" fontWeight={600}>
                  Informasi Pengguna
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="body2">
                    <strong>Nama:</strong> {data.user.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>NIS:</strong> {data.user.identity}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Tanggal Pengisian:</strong> {format(new Date(data.createdAt), 'dd MMMM yyyy, HH:mm:ss')}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid2>

          {/* MBTI Result */}
          <Grid2 size={{ xs: 12 }}>
            <Card variant="outlined">
              <Box p={2}>
                <Typography variant="subtitle1" gutterBottom color="primary" fontWeight={600}>
                  Hasil Tes MBTI
                </Typography>
                <Chip
                  label={data.mbtiTestResult}
                  color="primary"
                  variant="filled"
                  size="medium"
                  sx={{ fontSize: '1rem', fontWeight: 600 }}
                />
              </Box>
            </Card>
          </Grid2>

          {/* Nilai Scores */}
          {data.scores && data.scores.length > 0 && (
            <Grid2 size={{ xs: 12 }}>
              <Card variant="outlined">
                <Box p={2}>
                  <Typography variant="subtitle1" gutterBottom color="primary" fontWeight={600}>
                    Nilai Mata Pelajaran
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {data.scores.map((score) => (
                      <Box key={score.id} display="flex" justifyContent="space-between">
                        <Typography>{score.group?.name || score.title || '-'}</Typography>
                        <Typography fontWeight="bold">{score.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Card>
            </Grid2>
          )}

          {/* Main Answer */}
          <Grid2 size={{ xs: 12 }}>
            <Card variant="outlined">
              <Box p={2}>
                <Typography variant="subtitle1" gutterBottom color="primary" fontWeight={600}>
                  Jawaban Utama
                </Typography>
                <Typography variant="body1" paragraph>
                  {data.mainAnswer}
                </Typography>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Alasan:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.mainReason}
                </Typography>
              </Box>
            </Card>
          </Grid2>

          {/* Sub Answer - only show if exists */}
          {data.subAnswer && (
            <Grid2 size={{ xs: 12 }}>
              <Card variant="outlined">
                <Box p={2}>
                  <Typography variant="subtitle1" gutterBottom color="primary" fontWeight={600}>
                    Jawaban Tambahan
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {data.subAnswer}
                  </Typography>
                  {data.subReason && (
                    <>
                      <Typography variant="subtitle2" gutterBottom color="text.secondary">
                        Alasan:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.subReason}
                      </Typography>
                    </>
                  )}
                </Box>
              </Card>
            </Grid2>
          )}

          {/* AI Recommendation */}
          <Grid2 size={{ xs: 12 }}>
            <Card variant="outlined" sx={{ bgcolor: 'action.hover' }}>
              <Box p={2}>
                <Typography variant="subtitle1" gutterBottom color="primary" fontWeight={600}>
                  🤖 Rekomendasi
                </Typography>
                <Typography variant="body1" paragraph fontWeight={600}>
                  {data.aiResult || 'Rekomendasi tidak tersedia'}
                </Typography>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Detail Rekomendasi:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {data.aiRecommendation || 'Detail rekomendasi tidak tersedia'}
                </Typography>
              </Box>
            </Card>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ** renders answer column
const renderColumns = ({ onViewDetail }: { onViewDetail: (row: AnswerRow) => void }): GridColDef[] => {
  return [
    {
      flex: 0.3,
      minWidth: 200,
      field: 'user',
      headerName: 'Pengguna',
      renderCell: ({ row }: { row: AnswerRow }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography variant="body2" fontWeight={600}>
              {row.user?.name || '-'}
            </Typography>
            <Typography noWrap variant="caption" color="text.secondary">
              NIS: {row.user?.identity || '-'}
            </Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: 'mainAnswer',
      headerName: 'Jawaban Utama',
      renderCell: ({ row }: { row: AnswerRow }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography variant="body2" noWrap>
              {row.mainAnswer || '-'}
            </Typography>
            {row.mainReason && (
              <Typography noWrap variant="caption" color="text.secondary">
                Alasan: {row.mainReason}
              </Typography>
            )}
          </Box>
        )
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'subAnswer',
      headerName: 'Jawaban Tambahan',
      renderCell: ({ row }: { row: AnswerRow }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography variant="body2" noWrap>
              {row.subAnswer || '-'}
            </Typography>
            {row.subReason && (
              <Typography noWrap variant="caption" color="text.secondary">
                Alasan: {row.subReason}
              </Typography>
            )}
          </Box>
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'mbtiTestResult',
      headerName: 'MBTI',
      renderCell: ({ row }: { row: AnswerRow }) => {
        return (
          <Typography variant="body2" fontWeight={600} color="primary">
            {row.mbtiTestResult || '-'}
          </Typography>
        )
      },
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'aiResult',
      headerName: 'Rekomendasi',
      renderCell: ({ row }: { row: AnswerRow }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography variant="body2" noWrap>
              {row.aiResult || '-'}
            </Typography>
            {row.aiRecommendation && (
              <Typography noWrap variant="caption" color="text.secondary">
                {row.aiRecommendation.length > 50
                  ? `${row.aiRecommendation.substring(0, 50)}...`
                  : row.aiRecommendation}
              </Typography>
            )}
          </Box>
        )
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'createdAt',
      headerName: 'Tanggal Dibuat',
      renderCell: ({ row }: { row: AnswerRow }) => {
        return (
          <Typography noWrap variant="body2">
            {row.createdAt ? format(new Date(row.createdAt), 'dd MMM yyyy, HH:mm:ss') : '-'}
          </Typography>
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'action',
      headerName: 'Aksi',
      renderCell: ({ row }: { row: AnswerRow }) => {
        return (
          <Button
            onClick={() => onViewDetail(row)}
            size="small"
            startIcon={<IconifyIcon icon="ph:eye" />}
            variant="outlined"
          >
            Detail
          </Button>
        )
      },
    },
  ]
}

const Page = () => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [value, setValue] = React.useState<string>('')
  const [rowCount, setRowCount] = React.useState(0)
  const [paginationModel, setPaginationModel] = React.useState(initialPage)
  const [selectedRow, setSelectedRow] = React.useState<AnswerRow | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)

  const { data: _list, isSuccess, isLoading } = trpc.quiz.listAnswers.useQuery(paginationModel)

  const handleFilter = React.useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleViewDetail = React.useCallback((row: AnswerRow) => {
    setSelectedRow(row)
    setModalOpen(true)
  }, [])

  const handleCloseModal = React.useCallback(() => {
    setModalOpen(false)
    setSelectedRow(null)
  }, [])

  const columns = renderColumns({ onViewDetail: handleViewDetail })

  React.useEffect(() => {
    if (isSuccess) {
      if (_list?.paginate?.total) setRowCount(_list.paginate.total || 0)
      else setRowCount(0)
    }
  }, [_list?.paginate, isSuccess])

  React.useEffect(() => {
    const timeout = setTimeout(() => setPaginationModel((s) => ({ ...s, search: value })), 2000)
    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Box sx={{ p: 4 }}>
      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title="Laporan Jawaban Quiz"
              sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
            />
            <Divider />
            <Box ref={containerRef}>
              <TableHeader title="Cari berdasarkan nama atau NIS" value={value} handleFilter={handleFilter} />
              <DataGrid
                loading={isLoading}
                rows={_list?.result || []}
                rowCount={rowCount}
                columns={columns}
                disableColumnFilter
                disableRowSelectionOnClick
                disableColumnSorting
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                  pagination: { paginationModel: initialPage },
                }}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={({ page, pageSize }) => setPaginationModel((s) => ({ ...s, page, pageSize }))}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              />
            </Box>
          </Card>
        </Grid2>

        {/* Detail Modal */}
        <DetailModal open={modalOpen} onClose={handleCloseModal} data={selectedRow} />
      </Grid2>
    </Box>
  )
}

export default Page
