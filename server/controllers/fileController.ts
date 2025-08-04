import fs from "fs";
import path from "path";
import type { RequestHandler } from "express";

const fileController: Record<string, RequestHandler> = {};

fileController.getCharacters = (req, res, next) => {
  try {
    const { results } = JSON.parse(
      fs.readFileSync(
        path.resolve(import.meta.dirname, "../data/characters.json"),
        "utf-8",
      ),
    );
    res.locals.characters = results;
    next();
  } catch (e) {
    console.log("fileController.getCharacters: ERROR: ", e);
    res.status(400).send({
      err: "Error occurred in fileController.getCharacters. Check server logs for more details.",
    });
  }
};

fileController.getHomeworldAndFilms = async (req, res, next) => {
  if (!req.body.character)
    return res
      .status(400)
      .json({ err: "server POST /info: ERROR: Invalid request body" });
  try {
    res.locals.info = { ...req.body.character };
    const characterDeets = JSON.parse(
      fs.readFileSync(
        path.resolve(import.meta.dirname, "../data/characterDetails.json"),
        "utf-8",
      ),
    );
    if (characterDeets[req.body.character.id]) {
      res.locals.info.homeworld =
        characterDeets[req.body.character.id].homeworld;
      res.locals.info.films = characterDeets[req.body.character.id].films;
    } else {
      res.locals.info.homeworld = "Unknown";
      res.locals.info.films = [{ title: "Unknown" }];
    }
    next();
  } catch (e) {
    console.log("fileController.getHomeworldAndFilms: ERROR: ", e);
    return res.status(400).json({
      err: "fileController.getHomeworldAndFilms: ERROR: Check server logs for details",
    });
  }
};

export default fileController;
