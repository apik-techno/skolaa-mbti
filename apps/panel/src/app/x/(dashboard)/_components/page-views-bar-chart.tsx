import { trpc } from '@/server/client'
import { shortenNumber } from '@/utils/format'
import { Tooltip } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'

export default function PageViewsBarChart() {
  const theme = useTheme()
  const { data: monthlyPageVisits } = trpc.dashboard.monthlyPageVisits.useQuery({ interval: 6 })
  const months =
    monthlyPageVisits?.result.monthInRange.map((date) => date.toLocaleString('default', { month: 'short' })) || []

  const seriesPageViews = monthlyPageVisits?.result.data.map((item) => item.viewCount) || []
  const seriesUniqueViews = monthlyPageVisits?.result.data.map((item) => item.uniqueViews) || []
  const totalViewCount = monthlyPageVisits?.result.total.viewCount || 0
  const totalUniqueViews = monthlyPageVisits?.result.total.uniqueViews || 0

  const colorPalette = [theme.palette.primary.dark, theme.palette.primary.main, theme.palette.primary.light]
  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Halaman dilihat selama 6 bulan terakhir
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              <Tooltip title="Total pengunjung">
                <Typography component="span" fontSize="1.5rem" fontWeight="bold">
                  {shortenNumber(totalViewCount, 2)}
                </Typography>
              </Tooltip>{' '}
              /{' '}
              <Tooltip title="Pengunjung Unik">
                <Typography component="span" fontWeight="bold">
                  {shortenNumber(totalUniqueViews, 2)}
                </Typography>
              </Tooltip>
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Jumlah halaman yang dilihat dan jumlah pengunjung unik selama 6 bulan terakhir
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={
            [
              {
                scaleType: 'band',
                categoryGapRatio: 0.5,
                data: months,
              },
            ] as any
          }
          series={[
            {
              id: 'page-views',
              label: 'Halaman dilihat',
              data: seriesPageViews,
              stack: 'A',
            },
            {
              id: 'downloads',
              label: 'Pengunjung Unik',
              data: seriesUniqueViews,
              stack: 'A',
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
