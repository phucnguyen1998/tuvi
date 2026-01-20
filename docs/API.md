# API Contract

## Public

### POST /api/charts/compute
- Body: NatalChartInput
- Response: { id, snapshot }

### GET /api/charts/:id
- Response: { id, snapshot }

### POST /api/charts/:id/ai-readings
- Response: { id, status }

### GET /api/charts/:id/readings
- Response: { items: AIReading[] }

### GET /api/readings/:id
- Response: { id, status, content, errorMessage }

## CMS (Auth)

### GET /api/cms/charts
- Query: page, pageSize
- Response: { items, total }

### GET /api/cms/charts/:id
- Response: { id, input, readings }

### GET /api/cms/charts/:id/readings
- Response: { items }

### POST /api/cms/prompt-templates
- Body: { version, title, system, user }

### GET /api/cms/prompt-templates
- Response: { items }

### POST /api/cms/charts/:id/rerun-reading?promptVersion=...
- Response: { id, status }
