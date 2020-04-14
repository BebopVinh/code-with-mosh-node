const Joi = require("@hapi/joi")
const express = require("express")
const app = express()

app.use(express.json())

let courses = [
	{ id: 1, name: "course1" },
	{ id: 2, name: "course2" },
	{ id: 3, name: "course3" },
]

app.get("/", (req, res) => {
	res.send("Hi, there.")
})

app.get("/api/courses/", (req, res) => {
	res.send(courses)
})

app.get("/api/courses/:id", (req, res) => {
	let course = courses.find((c) => c.id === parseInt(req.params.id))
	course ? res.send(course) : res.status(404).send("Course was not found!")
})

app.post("/api/courses", (req, res) => {
	const { name } = req.body
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
	})

	const { error, value } = schema.validate(req.body)

	if (error) {
		console.log(error)
		res.status(400).send(error.message)
	} else if (value) {
		console.log(value)
		const course = {
			id: courses.length + 1,
			name,
		}
		courses.push(course)
		res.send(courses)
	}
})

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Running on port ${port}!`))
