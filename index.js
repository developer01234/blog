import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidator } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/user.js";
import checkAuth from "./utils/checkAuth.js";
import bcrypt from "bcrypt";

mongoose
	.connect(
		"mongodb+srv://blog:Test123@cluster0.ji6m8.mongodb.net/blog?retryWrites=true&w=majority"
	)
	.then(() => console.log("DB OK!"))
	.catch((err) => console.log("DB ERROR!", err));

const app = express();

app.use(express.json());

app.post("/auth/login", async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		);

		if (!isValidPass) {
			return res.status(400).json({
				message: "Invalid login or password",
			});
		}

		const token = jwt.sign({ _id: user._id }, "top-secret", {
			expiresIn: "30d",
		});

		const { passwordHash, ...userData } = user._doc;

		res.json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Failed to login" });
	}
});

app.post("/auth/register", registerValidator, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		});

		const user = await doc.save();

		const token = jwt.sign({ _id: user._id }, "top-secret", {
			expiresIn: "30d",
		});

		const { passwordHash, ...userData } = user._doc;

		res.json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Failed registration" });
	}
});

app.get("/auth/me", checkAuth, (req, res) => {
	try {
		res.json({
			success: true
		})
	} catch (err) {
		console.log(err);
	}
});

app.listen(5000, (err) => {
	if (err) {
		return console.log("Server Kill!", err);
	}

	console.log("Server OK!");
});
