import express from 'express'
const app = express()

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(5000, err => {
	if (err) return console.log('Server Syka Blyat', err)

	console.log('Server OK!')
})
