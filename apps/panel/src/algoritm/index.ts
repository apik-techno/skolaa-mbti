import dataTrain from '../data_train.json'
// Model default hasil training dari data_train.json
export const defaultModel = trainNaiveBayes(
  (dataTrain as unknown as TrainData[]).map((d) => {
    // Remove undefined property values for compatibility
    const clean: Record<string, string | number> = {}
    for (const k in d) {
      if (d[k] !== undefined) clean[k] = d[k] as string | number
    }
    return clean as TrainData
  }),
)
// ===== 1. Fungsi hitung mean dan std dev untuk nilai numerik =====
function mean(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length
}

function stdDev(numbers: number[]): number {
  const avg = mean(numbers)
  const variance = numbers.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / numbers.length
  return Math.sqrt(variance)
}

function gaussianProb(x: number, mean: number, std: number): number {
  if (std === 0) std = 0.0001 // smoothing kalau data konstan
  return (1 / (Math.sqrt(2 * Math.PI) * std)) * Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)))
}

// ===== 2. Training model =====
export type TrainData = Record<string, string | number | undefined> & { Label: string }

type Model = {
  [label: string]: {
    prior: number
    stats: Record<string, { mean: number; std: number }>
    categories: Record<string, Record<string, number>>
  }
}

export function trainNaiveBayes(data: TrainData[]): Model {
  const model: Model = {}
  const labels = Array.from(new Set(data.map((d) => d.Label)))

  labels.forEach((label) => {
    const subset = data.filter((d) => d.Label === label)
    model[label] = { prior: subset.length / data.length, stats: {}, categories: {} }

    if (!subset[0]) return
    Object.keys(subset[0] ?? {}).forEach((key) => {
      if (key === 'Label') return
      if (typeof subset[0]?.[key] === 'number') {
        const values = subset.map((d) => (typeof d[key] === 'number' ? (d[key] as number) : 0))
        if (model[label])
          model[label].stats[key] = {
            mean: mean(values),
            std: stdDev(values),
          }
      } else {
        const freq: Record<string, number> = {}
        subset.forEach((d) => {
          const val = d[key]
          if (typeof val === 'string') {
            freq[val] = (freq[val] || 0) + 1
          }
        })
        if (model[label]) model[label].categories[key] = freq
      }
    })
  })

  return model
}

// ===== 3. Prediksi =====
export function predict(input: Record<string, string | number>) {
  const probs: Record<string, number> = {}
  const model = defaultModel
  for (const label in model) {
    const labelModel = model[label]
    if (!labelModel) continue
    let prob = Math.log(labelModel.prior)

    for (const key in input) {
      if (Number.isNaN(Number(input[key]))) continue // Skip non-numeric inputs
      if (labelModel.stats[key]) {
        const { mean, std } = labelModel.stats[key]
        prob += Math.log(gaussianProb(input[key] as number, mean, std))
      } else if (labelModel.categories[key]) {
        const count = labelModel.categories[key][input[key] as string] || 0.5 // Laplace smoothing
        const total = Object.values(labelModel.categories[key]).reduce((a, b) => a + b, 0)
        prob += Math.log(count / total)
      }
    }
    probs[label] = prob
  }
  console.log('Probabilities:', probs)
  // Ubah log-prob ke persen
  const probValues = Object.values(probs)
  if (probValues.length === 0) return { predictedLabel: '', percentages: {} }
  const maxLog = Math.max(...probValues)
  const expProbs: Record<string, number> = {}
  let sumExp = 0
  for (const label in probs) {
    if (probs[label] === undefined) continue
    expProbs[label] = Math.exp(probs[label] - maxLog)
    sumExp += expProbs[label]
  }

  const percentages: Record<string, number> = {}
  for (const label in expProbs) {
    if (expProbs[label] === undefined) continue
    const value = (expProbs[label] / sumExp) * 100
    percentages[label] = Number.isNaN(value) ? 0 : value // Format ke 2 desimal
  }

  // Prediksi terbaik
  const predictedLabel = Object.keys(percentages).reduce((a, b) => {
    const pa = percentages[a] ?? 0
    const pb = percentages[b] ?? 0
    return pa > pb ? a : b
  }, 'No Prediction')

  return { predictedLabel, percentages }
}
