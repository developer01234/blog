import { body } from 'express-validator'

export const registerValidator = [
	body('email').isEmail(),
	body('password').isLength({ min: 5 }),
	body('fullName').isLength({ min: 3 }),
	body('avatarUrl').optional().isURL(),
]
