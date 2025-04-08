import { Request, Response } from "express";
import  prisma  from "../config/prisma/prisma.ts";
import redisClient from "../config/redis.ts";
import { json } from "stream/consumers";

// Create  Note
export const createNote = async (req: Request, res: Response): Promise<void> =>{
  try {
    const { title, content }: { title: string; content: string } = req.body;

    const note = await prisma.note.create({ data: { title, content } });

    await redisClient.del("notes");

    res.status(201).json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Get All Notes with Pagination & Optional Search
export const getAllNotes = async (req: Request, res: Response): Promise<any> => {
  const { page = "1", limit = "10", search } = req.query;
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const cachedNotes = await redisClient.get("notes");

    if (cachedNotes) {
      return res.json(JSON.parse(cachedNotes));
    }

    const notes = await prisma.note.findMany({
      skip,
      take: limitNumber,
      where: search
        ? {
            OR: [
              { title: { contains: search as string, mode: "insensitive" } },
              { content: { contains: search as string, mode: "insensitive" } },
            ],
          }
        : undefined,
    });

    await redisClient.set("notes", JSON.stringify(notes), { EX: 60 });

    res.json(notes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Note
export const getSingleNote = async (req: Request, res: Response): Promise<any> => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Note
export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content }: { title: string; content: string } = req.body;

    const note = await prisma.note.update({
      where: { id },
      data: { title, content },
    });

    await redisClient.del("notes");
    await redisClient.del(`note:${id}`);

    res.json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Note
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.note.delete({ where: { id } });

    await redisClient.del("notes");
    await redisClient.del(`note:${id}`);

    res.json({ message: "Note deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};