import { Router } from "express"
import {
  createDirector,
  getAllDirectors,
  getDirectorById,
  updateDirector,
  deleteDirector,
} from "../db/directors.js"

const directorRouter = Router()

// POST /api/directors (skapa)
directorRouter.post("/", async (req, res) => {
  const { name, birthYear, nationality } = req.body
  if (
    !name ||
    typeof name !== "string" ||
    !birthYear ||
    typeof birthYear !== "number" ||
    !nationality ||
    typeof nationality !== "string"
  ) {
    return res.status(400).json({
      message: "Name, birth year and nationality is required",
    })
  }
  const director = await createDirector({ name, birthYear, nationality })

  return res.status(201).json(director)
})

// GET /api/directors (lista alla)
directorRouter.get("/", async (req, res) => {
  const directors = await getAllDirectors()
  return res.json(directors)
})

// GET /api/directors/:id (hämta en)
directorRouter.get("/:id", async (req, res) => {
  const id = req.params.id
  const director = await getDirectorById(id)
  if (!director) {
    return res.status(404).json({
      message: "Director does not exist",
    })
  }

  return res.json(director)
})

// PUT /api/directors/:id (uppdatera)
directorRouter.put("/:id", async (req, res) => {
  const id = req.params.id
  const { name, birthYear, nationality } = req.body
  if (!name || typeof name !== "string") {
    return res.status(400).json({
      message: "New director name is required",
    })
  }
  if (!birthYear || isNaN(birthYear)) {
    return res.status(400).json({
      message: "New director birthYear needs to be a valid number",
    })
  }
  if (!nationality || typeof nationality !== "string") {
    return res.status(400).json({
      message: "New director nationality is required",
    })
  }
  const updatedDirector = await updateDirector(id, {
    name,
    birthYear,
    nationality,
  })
  if (!updatedDirector) {
    return res.status(404).json({
      message: "Director does not exist",
    })
  }

  return res.status(200).json(updatedDirector)
})

// DELETE /api/directors/:id (ta bort)
directorRouter.delete("/:id", async (req, res) => {
  const id = req.params.id
  console.log(id)
  const deleted = await deleteDirector(id)
  console.log(deleted)

  if (!deleted) {
    return res.status(404).json({
      message: "Director was not deleted or found",
    })
  }

  return res.status(204).json()
})

export default directorRouter
