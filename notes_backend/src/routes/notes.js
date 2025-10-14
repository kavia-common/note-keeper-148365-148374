const express = require('express');
const noteStore = require('../models/noteStore');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: CRUD operations for notes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: UUID of the note
 *         title:
 *           type: string
 *           description: Title of the note
 *         content:
 *           type: string
 *           description: Content/body of the note
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - title
 *         - content
 *         - createdAt
 *         - updatedAt
 *     NoteCreate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the note
 *         content:
 *           type: string
 *           description: Content/body of the note
 *       required:
 *         - title
 *         - content
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * GET /notes
 * Returns a list of notes.
 */
 // PUBLIC_INTERFACE
router.get(
  '/',
  /**
   * @swagger
   * /notes:
   *   get:
   *     summary: List all notes
   *     tags: [Notes]
   *     responses:
   *       200:
   *         description: List of notes
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Note'
   */
  (req, res) => {
    const notes = noteStore.list();
    return res.status(200).json(notes);
  }
);

/**
 * POST /notes
 * Creates a new note.
 */
 // PUBLIC_INTERFACE
router.post(
  '/',
  /**
   * @swagger
   * /notes:
   *   post:
   *     summary: Create a new note
   *     tags: [Notes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NoteCreate'
   *     responses:
   *       201:
   *         description: Note created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Note'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  (req, res) => {
    const { valid, errors } = noteStore.constructor.validatePayload(req.body);
    if (!valid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    const note = noteStore.create({
      title: req.body.title,
      content: req.body.content,
    });
    return res.status(201).json(note);
  }
);

/**
 * GET /notes/:id
 * Returns a single note.
 */
 // PUBLIC_INTERFACE
router.get(
  '/:id',
  /**
   * @swagger
   * /notes/{id}:
   *   get:
   *     summary: Get a note by id
   *     tags: [Notes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Note id (UUID)
   *     responses:
   *       200:
   *         description: The requested note
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Note'
   *       404:
   *         description: Note not found
   */
  (req, res) => {
    const note = noteStore.get(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    return res.status(200).json(note);
  }
);

/**
 * PUT /notes/:id
 * Updates a note.
 */
 // PUBLIC_INTERFACE
router.put(
  '/:id',
  /**
   * @swagger
   * /notes/{id}:
   *   put:
   *     summary: Update a note by id
   *     tags: [Notes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NoteCreate'
   *     responses:
   *       200:
   *         description: Updated note
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Note'
   *       400:
   *         description: Validation error
   *       404:
   *         description: Note not found
   */
  (req, res) => {
    const id = req.params.id;
    const existing = noteStore.get(id);
    if (!existing) {
      return res.status(404).json({ message: 'Note not found' });
    }
    const { valid, errors } = noteStore.constructor.validatePayload(req.body);
    if (!valid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    const updated = noteStore.update(id, {
      title: req.body.title,
      content: req.body.content,
    });
    return res.status(200).json(updated);
  }
);

/**
 * DELETE /notes/:id
 * Deletes a note.
 */
 // PUBLIC_INTERFACE
router.delete(
  '/:id',
  /**
   * @swagger
   * /notes/{id}:
   *   delete:
   *     summary: Delete a note by id
   *     tags: [Notes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Note deleted
   *       404:
   *         description: Note not found
   */
  (req, res) => {
    const id = req.params.id;
    const existing = noteStore.get(id);
    if (!existing) {
      return res.status(404).json({ message: 'Note not found' });
    }
    noteStore.delete(id);
    return res.status(204).send();
  }
);

module.exports = router;
