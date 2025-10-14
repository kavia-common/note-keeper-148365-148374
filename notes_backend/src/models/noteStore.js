'use strict';

const crypto = require('crypto');

/**
 * NoteStore provides an abstraction for storing notes.
 * Currently uses in-memory storage with a Map, and is structured to be easily
 * replaced with a database-backed implementation later.
 */
class NoteStore {
  constructor() {
    /** @type {Map<string, any>} */
    this.notes = new Map();
  }

  /**
   * Generates a UUID v4 string.
   * Uses Node's crypto API to avoid external dependencies.
   */
  static generateId() {
    return crypto.randomUUID ? crypto.randomUUID() : [
      crypto.randomBytes(4).toString('hex'),
      crypto.randomBytes(2).toString('hex'),
      crypto.randomBytes(2).toString('hex'),
      crypto.randomBytes(2).toString('hex'),
      crypto.randomBytes(6).toString('hex'),
    ].join('-');
  }

  /**
   * Validates a note payload for create/update operations.
   * - title: required, non-empty string
   * - content: required, non-empty string
   * Returns { valid: boolean, errors: string[] }
   */
  static validatePayload(payload) {
    const errors = [];
    if (!payload || typeof payload !== 'object') {
      return { valid: false, errors: ['Invalid payload'] };
    }
    const { title, content } = payload;

    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('title is required and must be a non-empty string');
    }
    if (typeof content !== 'string' || content.trim().length === 0) {
      errors.push('content is required and must be a non-empty string');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Creates a new note.
   */
  // PUBLIC_INTERFACE
  create({ title, content }) {
    /** This method creates and stores a new note. */
    const now = new Date().toISOString();
    const id = NoteStore.generateId();
    const note = {
      id,
      title: title.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    };
    this.notes.set(id, note);
    return note;
  }

  /**
   * Returns all notes sorted by createdAt descending.
   */
  // PUBLIC_INTERFACE
  list() {
    /** This method returns all notes sorted by creation date descending. */
    return Array.from(this.notes.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    // For DB: return query with ORDER BY createdAt DESC
  }

  /**
   * Retrieves a note by id.
   */
  // PUBLIC_INTERFACE
  get(id) {
    /** This method retrieves a single note by id or returns null. */
    if (!id) return null;
    return this.notes.get(id) || null;
  }

  /**
   * Updates an existing note by id.
   */
  // PUBLIC_INTERFACE
  update(id, { title, content }) {
    /** This method updates title/content and timestamps for a note. */
    const existing = this.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date().toISOString(),
    };
    this.notes.set(id, updated);
    return updated;
  }

  /**
   * Deletes a note by id.
   */
  // PUBLIC_INTERFACE
  delete(id) {
    /** This method deletes a note by id and returns true if it existed. */
    return this.notes.delete(id);
  }
}

module.exports = new NoteStore();
