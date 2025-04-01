import  prisma from "../config/prisma.js";
import redisClient from "../config/redis.js";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await prisma.note.create({ data: { title, content } });

    await redisClient.del("notes");

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNotes = async (req, res) => {
  try {
      const cachedNotes = await redisClient.get("notes");

      if (cachedNotes) {
          return res.json(JSON.parse(cachedNotes));
      }

      const notes = await prisma.note.findMany();
      await redisClient.set("notes", JSON.stringify(notes), { EX: 60 });

      res.json(notes);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

export const getNote = async (req, res) => {
  try {
      const { id } = req.params;

      const cachedNote = await redisClient.get(`note:${id}`);

      if (cachedNote) {
          return res.json(JSON.parse(cachedNote));
      }

      const note = await prisma.note.findUnique({ where: { id } });

      if (!note) {
          return res.status(404).json({ message: "Note not found" });
      }

      await redisClient.set(`note:${id}`, JSON.stringify(note), { EX: 60 });

      res.json(note);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
      const { id } = req.params;
      const { title, content } = req.body;

      const note = await prisma.note.update({ where: { id }, data: { title, content } });

      await redisClient.del("notes");
      await redisClient.del(`note:${id}`);

      res.json(note);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
      const { id } = req.params;

      await prisma.note.delete({ where: { id } });

      await redisClient.del("notes");
      await redisClient.del(`note:${id}`);

      res.json({ message: "Note deleted" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
