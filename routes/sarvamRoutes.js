import express from "express";
import {
  speechToText,
  translateText
} from "../controllers/sarvamController.js";

const router = express.Router();

router.post("/speech-to-text", speechToText);
router.post("/translate", translateText);

export default router;