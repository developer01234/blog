import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidator } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/user.js";
import bcrypt from "bcrypt";

mongoose
	.connect(
		"mongodb+srv://blog:Test123@cluster0.ji6m8.mongodb.net/blog?retryWrites=true&w=majority"
	)
	.then(() => console.log("DB OK!"))
	.catch((err) => console.log("DB ERROR!", err));

const app = express();

app.use(express.json());

app.post("/auth/register", registerValidator, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash,
		});

		const user = await doc.save();

		res.json(user);
	} catch (err) {
		res.status(500).json({ message: "Invalid password or email" });
	}
});

app.listen(5000, (err) => {
	if (err) {
		return console.log("Server Kill!", err);
	}

	console.log("Server OK!");
});
