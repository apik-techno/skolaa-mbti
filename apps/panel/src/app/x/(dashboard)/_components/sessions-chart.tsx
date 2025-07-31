import { trpc } from '@/server/client'
import { getDaysInRange } from '@/utils/date'
import { shortenNumber } from '@/utils/format'
import { Tooltip } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { LineChart } from '@mui/x-charts/LineChart'
import { formatDate, subDays } from 'date-fns'

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  )
}

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0)
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  })
  const daysInMonth = date.getDate()
  const days = []
  let i = 1
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`)
    i += 1
  }
  return days
}

export default function SessionsChart() {
  const theme = useTheme()
  const startDate = subDays(new Date(), 30)
  const endDate = new Date()
  const data = getDaysInRange(startDate, endDate)
  const { data: universal } = trpc.dashboard.universalPage.useQuery({ interval: 30 })
  const colorPalette = [theme.palette.primary.light, theme.palette.primary.main, theme.palette.primary.dark]
  const seriesViewCount = universal?.result.data.map((item) => item._sum.viewCount) || []
  const seriesUniqueViews = universal?.result.data.map((item) => item._sum.uniqueViews) || []
  const totalViewCount = universal?.result.total.viewCount || 0
  const totalUniqueViews = universal?.result.total.uniqueViews || 0
  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Grafik Pengunjung
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
            Pengunjung periode {formatDate(startDate, 'dd MMMM')} - {formatDate(endDate, 'dd MMMM')}
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={[
            {
              id: 'direct',
              label: 'Total Pengunjung',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: seriesViewCount,
            },
            {
              id: 'referral',
              label: 'Pengunjung Unik',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: seriesUniqueViews,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-organic': {
              fill: "url('#organic')",
            },
            '& .MuiAreaElement-series-referral': {
              fill: "url('#referral')",
            },
            '& .MuiAreaElement-series-direct': {
              fill: "url('#direct')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.primary.dark} id="organic" />
          <AreaGradient color={theme.palette.primary.main} id="referral" />
          <AreaGradient color={theme.palette.primary.light} id="direct" />
        </LineChart>
      </CardContent>
    </Card>
  )
}
