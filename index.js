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
	const course = findCourse(req.params.id)
	course ? res.send(course) : res.status(404).send("Course was not found!")
})

app.post("/api/courses", (req, res) => {
	const { error, value } = validateCourse(req.body)

	if (error) {
		res.status(400).send(error.message)
	} else if (value) {
		console.log(value)
		const course = {
			id: courses.length + 1,
			name: req.body.name,
		}
		courses.push(course)
		res.send(courses)
	}
})

app.put("/api/courses/:id", (req, res) => {
	const course = findCourse(req.params.id)
	if (!course) res.status(404).send("Course was not found!")

	const { error, value } = validateCourse(req.body)

	if (error) {
		res.status(400).send(error.message)
	} else if (value) {
		course.name = req.body.name
		res.send(course)
	}
})

const validateCourse = (course) => {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
	})

	return schema.validate(course)
}

const findCourse = (courseId) => {
	return courses.find((c) => c.id === parseInt(courseId))
}

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Running on port ${port}!`))
